type ASTPanelProps = {
  result: any | null;
};

function ASTPanel({ result }: ASTPanelProps) {
  if (!result) {
    return (
      <div className="ast-panel-content">
        <div className="ast-root">Program</div>
        <div className="ast-message">
          Run your code to see AST information
        </div>
      </div>
    );
  }

  return (
    <div className="ast-panel-content">
      <div className="ast-root">
        {result.syntax_tree_type}
      </div>

      <div className="ast-info">
        <div className="ast-item">
          <strong>Language:</strong> {result.language}
        </div>

        <div className="ast-item">
          <strong>Syntax Errors:</strong>{" "}
          {result.has_syntax_errors ? "Yes" : "No"}
        </div>

        <div className="ast-item">
          <strong>Functions:</strong>{" "}
          {result.functions_found?.length ?? 0}
        </div>

        {result.functions_found?.length > 0 && (
          <div className="ast-list">
            {result.functions_found.map((name: string) => (
              <div key={name}>↳ Function: {name}</div>
            ))}
          </div>
        )}

        <div className="ast-item">
          <strong>Classes:</strong>{" "}
          {result.classes_found?.length ?? 0}
        </div>

        {result.classes_found?.length > 0 && (
          <div className="ast-list">
            {result.classes_found.map((name: string) => (
              <div key={name}>↳ Class: {name}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ASTPanel;