type ConsoleProps = {
  output: string;
};

function Console({ output }: ConsoleProps) {
  return (
    <div className="console">
      <div className="console-title">Console</div>

      <pre className="console-output">
        {output}
      </pre>
    </div>
  );
}

export default Console;