import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import ASTPanel from "./components/ASTPanel";
import Console from "./components/Console";
import { parseCode } from "./services/api";

function App() {
  // Selected programming language
  const [language, setLanguage] = useState("python");

  // Code written inside Monaco Editor
  const [code, setCode] = useState(
    "x = 10\ny = 20\nprint(x + y)"
  );

  // Console output
  const [output, setOutput] = useState(
    "Code execution will be connected soon..."
  );

  // Backend AST/parser response
  const [astResult, setAstResult] = useState<any | null>(null);

  // Runs when user clicks the Run button
  const handleRun = async () => {
    try {
      // Show loading message
      setOutput("Parsing code...");

      // Send code to FastAPI backend
      const result = await parseCode(code, language);

      // Save backend response for AST panel
      setAstResult(result);

      // Show response in browser console
      console.log("Backend response:", result);

      // Get functions and classes
      const functions = result.functions_found ?? [];
      const classes = result.classes_found ?? [];

      // Display readable result in our Console
      setOutput(
        `✓ Code parsed successfully

Language: ${result.language}
Syntax Tree: ${result.syntax_tree_type}
Syntax Errors: ${result.has_syntax_errors ? "Yes" : "No"}

Functions: ${functions.length}
${functions.length > 0 ? functions.join(", ") : "None"}

Classes: ${classes.length}
${classes.length > 0 ? classes.join(", ") : "None"}`
      );
    } catch (error) {
      console.error(error);

      setOutput("✗ Error connecting to backend.");
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
          />
        </div>

        {/* AST Visualization */}
        <div className="ast-section">
          <ASTPanel result={astResult} />
        </div>

      </div>

      {/* Console */}
      <Console output={output} />

    </div>
  );
}

export default App;