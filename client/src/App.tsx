import ASTCanvas from "./components/editor/ASTCanvas/ASTCanvas";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>CodeSight AST Visualizer</h1>

      <ASTCanvas />
    </div>
  );
}

export default App;