import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
};

function CodeEditor({
  code,
  language,
  onCodeChange,
}: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={(value) => onCodeChange(value ?? "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        automaticLayout: true,
      }}
    />
  );
}

export default CodeEditor;