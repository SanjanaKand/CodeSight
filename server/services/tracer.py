import io
import sys
from contextlib import redirect_stdout
from typing import Any

from ..models.schemas import (
    ExecutionSnapshot,
    VariableState,
    StackFrame
)


TRACE_FILENAME = "<codesight>"


def safe_value(value: Any) -> Any:
    """
    Convert a Python value into a JSON/Pydantic-friendly representation.

    Simple values are preserved.
    Complex objects are represented using repr().
    """

    if value is None:
        return None

    if isinstance(value, (bool, int, float, str)):
        return value

    if isinstance(value, (list, tuple, set)):
        try:
            return repr(value)
        except Exception:
            return f"<{type(value).__name__}>"

    if isinstance(value, dict):
        try:
            return repr(value)
        except Exception:
            return "<dict>"

    try:
        return repr(value)
    except Exception:
        return f"<{type(value).__name__}>"


def get_variables(frame) -> dict[str, VariableState]:
    """
    Extract visible local variables from the current frame.
    """

    variables = {}

    for name, value in frame.f_locals.items():

        # Ignore Python internals.
        if name.startswith("__") and name.endswith("__"):
            continue

        try:
            variables[name] = VariableState(
                type=type(value).__name__,
                value=safe_value(value)
            )
        except Exception:
            variables[name] = VariableState(
                type=type(value).__name__,
                value=f"<{type(value).__name__}>"
            )

    return variables


def get_call_stack(frame) -> list[StackFrame]:
    """
    Build the current Python call stack.

    The user's module-level execution is represented as 'main'.
    """

    stack = []
    current = frame

    while current is not None:

        if current.f_code.co_filename == TRACE_FILENAME:

            function_name = current.f_code.co_name

            if function_name == "<module>":
                function_name = "main"

            stack.append(
                StackFrame(
                    functionName=function_name,
                    line=current.f_lineno
                )
            )

        current = current.f_back

    # Current frame should appear first.
    return stack


def trace_execution(
    code: str,
    language: str
) -> list[ExecutionSnapshot]:
    """
    Execute Python code and record real execution snapshots.

    Currently supported:
        - Python

    Each snapshot records:
        - execution step
        - source line
        - event type
        - variables
        - call stack
        - stdout
        - error information, if an exception occurs
    """

    language = language.lower().strip()

    if language != "python":
        raise ValueError(
            f"Execution tracing is currently supported only for Python. "
            f"Received: {language}"
        )

    snapshots: list[ExecutionSnapshot] = []

    stdout_buffer = io.StringIO()

    step_index = 0

    def tracer(frame, event, arg):

        nonlocal step_index

        # Trace only the submitted user program.
        if frame.f_code.co_filename != TRACE_FILENAME:
            return tracer

        # Ignore events that are not useful for our visualizer.
        if event not in ("call", "line", "return"):
            return tracer

        function_name = frame.f_code.co_name

        if function_name == "<module>":
            function_name = "main"

        variables = get_variables(frame)

        call_stack = get_call_stack(frame)

        stdout_text = stdout_buffer.getvalue()

        stdout_lines = stdout_text.splitlines()

        snapshot = ExecutionSnapshot(
            stepIndex=step_index,
            line=frame.f_lineno,
            event=event,
            variables=variables,
            callStack=call_stack,
            stdout=stdout_lines
        )

        snapshots.append(snapshot)

        step_index += 1

        return tracer

    # Compile the submitted code using our virtual filename.
    # Syntax errors happen during compilation, before execution starts.
    try:
        compiled_code = compile(
            code,
            TRACE_FILENAME,
            "exec"
        )

    except SyntaxError as exc:

        return [
            ExecutionSnapshot(
                stepIndex=0,
                line=exc.lineno or 0,
                event="exception",
                variables={},
                callStack=[],
                stdout=[],
                errorType="SyntaxError",
                errorMessage=str(exc)
            )
        ]

    previous_trace = sys.gettrace()

    try:
        sys.settrace(tracer)

        with redirect_stdout(stdout_buffer):

            try:
                exec(
                    compiled_code,
                    {
                        "__name__": "__main__",
                        "__builtins__": __builtins__
                    },
                    {}
                )

            except Exception as exc:

                # Find the traceback frame belonging to the
                # submitted user code.
                traceback_frame = exc.__traceback__

                while (
                    traceback_frame is not None
                    and traceback_frame.tb_frame.f_code.co_filename
                    != TRACE_FILENAME
                ):
                    traceback_frame = traceback_frame.tb_next

                if traceback_frame is not None:

                    frame = traceback_frame.tb_frame

                    snapshots.append(
                        ExecutionSnapshot(
                            stepIndex=step_index,
                            line=traceback_frame.tb_lineno,
                            event="exception",
                            variables=get_variables(frame),
                            callStack=get_call_stack(frame),
                            stdout=stdout_buffer.getvalue().splitlines(),
                            errorType=type(exc).__name__,
                            errorMessage=str(exc)
                        )
                    )

                else:

                    snapshots.append(
                        ExecutionSnapshot(
                            stepIndex=step_index,
                            line=0,
                            event="exception",
                            variables={},
                            callStack=[],
                            stdout=stdout_buffer.getvalue().splitlines(),
                            errorType=type(exc).__name__,
                            errorMessage=str(exc)
                        )
                    )

    finally:
        sys.settrace(previous_trace)

    # Add final stdout to the last snapshot.
    if snapshots:

        final_stdout = stdout_buffer.getvalue().splitlines()

        snapshots[-1].stdout = final_stdout

    return snapshots