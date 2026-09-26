import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as Monaco from "monaco-editor";

type CodeEditorProps = {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  activeLine?: number | null;
};

function CodeEditor({
  code,
  language,
  onCodeChange,
  activeLine = null,
}: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const highlightActiveLine = (line: number | null) => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    if (!line || line < 1) {
      decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        []
      );
      return;
    }

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      [
        {
          range: new Monaco.Range(line, 1, line, 1),
          options: {
            isWholeLine: true,
            className: "codesight-execution-line",
            glyphMarginClassName: "codesight-execution-glyph",
            overviewRuler: {
              color: "#60a5fa",
              position: Monaco.editor.OverviewRulerLane.Full,
            },
          },
        },
      ]
    );
  };

  const handleEditorMount = (
    editor: Monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
    highlightActiveLine(activeLine);
  };

  useEffect(() => {
    highlightActiveLine(activeLine);

    return () => {
      if (editorRef.current) {
        decorationsRef.current = editorRef.current.deltaDecorations(
          decorationsRef.current,
          []
        );
      }
    };
  }, [activeLine]);

  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={(value) => onCodeChange(value ?? "")}
      onMount={handleEditorMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        automaticLayout: true,
        lineNumbers: "on",
        glyphMargin: true,
      }}
    />
  );
}

export default CodeEditor;