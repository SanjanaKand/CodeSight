import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  value: string
  language: string
  onChange: (value: string) => void
}

function CodeEditor({
  value,
  language,
  onChange,
}: CodeEditorProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(value) => onChange(value ?? '')}
        theme="vs-dark"
        options={{
          automaticLayout: true,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          minimap: {
            enabled: true,
          },
          padding: {
            top: 16,
            bottom: 16,
          },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: 'on',
          renderWhitespace: 'selection',
          tabSize: 4,
          wordWrap: 'on',
        }}
      />
    </div>
  )
}

export default CodeEditor