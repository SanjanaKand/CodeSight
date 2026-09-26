import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import ASTPanel from "./components/ASTPanel";
import Console from "./components/Console";

import {
  parseCode,
  traceCode,
  type ExecutionSnapshot,
  type ParseResponse,
} from "./services/api";

function App() {
  // Selected programming language
  const [language, setLanguage] = useState("python");

  // Code written inside Monaco Editor
  const [code, setCode] = useState(
    "def add(a, b):\n    total = a + b\n    return total\n\nresult = add(10, 20)\nprint(result)"
  );

  // Backend AST/parser response
  const [astResult, setAstResult] = useState<ParseResponse | null>(null);

  // Execution snapshots returned by /api/trace
  const [executionSnapshots, setExecutionSnapshots] = useState<
    ExecutionSnapshot[]
  >([]);

  // Currently selected execution step
  const [selectedStep, setSelectedStep] = useState(0);

  // Console output
  const [output, setOutput] = useState(
    "Run your code to see parsing and execution results."
  );

  // Loading state
  const [isRunning, setIsRunning] = useState(false);

  // General error
  const [error, setError] = useState<string | null>(null);

  // Runtime error returned by tracer
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Currently selected execution snapshot
  const currentSnapshot =
    executionSnapshots.length > 0
      ? executionSnapshots[selectedStep]
      : null;

  // Runs when user clicks the Run button
  const handleRun = async () => {
    try {
      setIsRunning(true);
      setError(null);
      setRuntimeError(null);
      setExecutionSnapshots([]);
      setSelectedStep(0);
      setOutput("Parsing code...");

      // -----------------------------
      // STEP 1: Parse the code
      // -----------------------------
      const result = await parseCode({
        code,
        language,
      });

      setAstResult(result);

      console.log("Backend parse response:", result);

      // Get functions and classes
      const functions = result.functions_found ?? [];
      const classes = result.classes_found ?? [];

      // If syntax errors exist, don't try to execute the code
      if (result.has_syntax_errors) {
        setOutput(
          `✗ Syntax errors found

Language: ${result.language}
Syntax Tree: ${result.syntax_tree_type}

Functions: ${functions.length}
${functions.length > 0 ? functions.join(", ") : "None"}

Classes: ${classes.length}
${classes.length > 0 ? classes.join(", ") : "None"}

Execution skipped because the code contains syntax errors.`
        );

        return;
      }

      // -----------------------------
      // STEP 2: Trace the execution
      // -----------------------------
      setOutput("Code parsed successfully.\n\nTracing execution...");

      try {
        const snapshots = await traceCode({
          code,
          language,
        });

        setExecutionSnapshots(snapshots);

        console.log("Backend trace response:", snapshots);

        // Look for runtime error
        const errorSnapshot = snapshots.find(
          (snapshot) => snapshot.errorType !== null
        );

        if (errorSnapshot) {
          setRuntimeError(
            `${errorSnapshot.errorType}: ${
              errorSnapshot.errorMessage ?? "Runtime error"
            }`
          );
        }

        // Collect stdout
        const stdout = snapshots.flatMap(
          (snapshot) => snapshot.stdout ?? []
        );

        setOutput(
          `✓ Code parsed and execution traced successfully

Language: ${result.language}
Syntax Tree: ${result.syntax_tree_type}
Syntax Errors: No

Functions: ${functions.length}
${functions.length > 0 ? functions.join(", ") : "None"}

Classes: ${classes.length}
${classes.length > 0 ? classes.join(", ") : "None"}

Execution Steps: ${snapshots.length}

${
  stdout.length > 0
    ? `Program Output:\n${stdout.join("\n")}`
    : "Program Output:\nNo output"
}`
        );
      } catch (traceError) {
        console.error("Trace error:", traceError);

        setError(
          traceError instanceof Error
            ? traceError.message
            : "Execution tracing failed."
        );

        setOutput(
          `✓ Code parsed successfully

Language: ${result.language}
Syntax Tree: ${result.syntax_tree_type}
Syntax Errors: No

Execution tracing failed.`
        );
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);

      setError(
        parseError instanceof Error
          ? parseError.message
          : "Error connecting to backend."
      );

      setOutput("✗ Error connecting to backend.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="app">
      {/* Header with language selector and Run button */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onRun={handleRun}
      />

      {/* Main workspace */}
      <div className="main-content">
        {/* Code Editor */}
        <div className="editor-section">
          <CodeEditor
            code={code}
            language={language}
            onCodeChange={setCode}
            activeLine={currentSnapshot?.line ?? null}
          />
        </div>

        {/* AST + Execution Information */}
        <div className="ast-section">
          {/* Your existing AST panel */}
          <ASTPanel result={astResult} />

          {/* Execution section */}
          <div className="mt-4 border-t border-gray-700 pt-4 px-4 pb-4">
            <h2 className="text-lg font-semibold text-white mb-3">
              Execution
            </h2>

            {isRunning && (
              <div className="text-blue-400 text-sm mb-3">
                Running code...
              </div>
            )}

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-md p-3 mb-3">
                <div className="text-red-400 font-semibold">
                  Error
                </div>

                <div className="text-red-300 text-sm mt-1">
                  {error}
                </div>
              </div>
            )}

            {runtimeError && (
              <div className="bg-red-900/30 border border-red-700 rounded-md p-3 mb-3">
                <div className="text-red-400 font-semibold">
                  Runtime Error
                </div>

                <div className="text-red-300 text-sm mt-1">
                  {runtimeError}
                </div>
              </div>
            )}

            {executionSnapshots.length === 0 && !isRunning && (
              <div className="text-gray-400 text-sm">
                Run the code to see execution steps.
              </div>
            )}

            {executionSnapshots.length > 0 && (
              <>
                {/* Current execution step */}
                <div className="bg-gray-900 rounded-md p-3 mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">
                      Current Step
                    </span>

                    <span className="text-blue-400 text-sm">
                      {selectedStep + 1} /{" "}
                      {executionSnapshots.length}
                    </span>
                  </div>

                  <div className="text-white text-sm">
                    Line: {currentSnapshot?.line ?? "-"}
                  </div>

                  <div className="text-gray-400 text-sm">
                    Event: {currentSnapshot?.event ?? "-"}
                  </div>
                </div>

                {/* Execution timeline */}
                <div className="mb-3">
                  <div className="text-gray-300 text-sm mb-2">
                    Execution Timeline
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {executionSnapshots.map((snapshot, index) => (
                      <button
                        key={`${snapshot.stepIndex}-${index}`}
                        onClick={() => setSelectedStep(index)}
                        className={`px-2 py-1 rounded text-xs ${
                          selectedStep === index
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variables */}
                <div className="bg-gray-900 rounded-md p-3 mb-3">
                  <div className="text-gray-300 text-sm mb-2">
                    Variables
                  </div>

                  {currentSnapshot &&
                  Object.keys(currentSnapshot.variables).length > 0 ? (
                    <div className="space-y-1">
                      {Object.entries(
                        currentSnapshot.variables
                      ).map(([name, variable]) => (
                        <div
                          key={name}
                          className="text-sm"
                        >
                          <span className="text-blue-400">
                            {name}
                          </span>

                          <span className="text-gray-500">
                            {" "}
                            ({variable.type})
                          </span>

                          <span className="text-gray-300">
                            {" = "}
                            {String(variable.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      No variables at this step.
                    </div>
                  )}
                </div>

                {/* Call Stack */}
                <div className="bg-gray-900 rounded-md p-3">
                  <div className="text-gray-300 text-sm mb-2">
                    Call Stack
                  </div>

                  {currentSnapshot &&
                  currentSnapshot.callStack.length > 0 ? (
                    <div className="space-y-1">
                      {currentSnapshot.callStack.map(
                        (frame, index) => (
                          <div
                            key={`${frame.functionName}-${index}`}
                            className="text-sm text-gray-300"
                          >
                            {frame.functionName} — line{" "}
                            {frame.line}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      No active function call.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Console */}
      <Console output={output} />
    </div>
  );
}

export default App;