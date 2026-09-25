import { useState } from 'react'
import {
  Braces,
  ChevronDown,
  Code2,
  GitBranch,
  Play,
  Settings,
  Sparkles,
} from 'lucide-react'

import CodeEditor from './components/editor/CodeEditor'
import { parseCode, type ParseResponse } from './services/api'

function App() {
  const [code, setCode] = useState(`def calculate(a, b):
    total = a + b
    return total


result = calculate(10, 20)
print(result)`)

  const [parseResult, setParseResult] = useState<ParseResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRun = async () => {
    setIsRunning(true)
    setError(null)

    try {
      const result = await parseCode({
        code,
        language: 'python',
      })

      setParseResult(result)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to communicate with the backend',
      )
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0d12] text-slate-100">
      {/* Top Navigation */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0d1117] px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/15 ring-1 ring-blue-500/30">
            <Code2 className="h-5 w-5 text-blue-400" />
          </div>

          <div>
            <h1 className="text-sm font-semibold tracking-wide">
              CodeSight
            </h1>

            <p className="text-[11px] text-slate-500">
              Visual Code Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">
            Python
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="grid min-h-[calc(100vh-4rem)] grid-cols-[220px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="border-r border-white/10 bg-[#0d1117] p-4">
          <div className="mb-6">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Workspace
            </p>

            <button className="flex w-full items-center gap-3 rounded-lg bg-blue-500/10 px-3 py-2.5 text-sm text-blue-300 ring-1 ring-blue-500/20">
              <Code2 className="h-4 w-4" />
              Code Editor
            </button>

            <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200">
              <GitBranch className="h-4 w-4" />
              Syntax Tree
            </button>

            <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200">
              <Sparkles className="h-4 w-4" />
              Execution
            </button>
          </div>

          <div>
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Project
            </p>

            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-slate-500">
              No project loaded
            </div>
          </div>
        </aside>

        {/* Workspace */}
        <section className="flex min-w-0 flex-col">
          {/* Toolbar */}
          <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#0b0f15] px-4">
            <div className="flex items-center gap-2">
              <Braces className="h-4 w-4 text-slate-500" />

              <span className="text-xs text-slate-400">
                main.py
              </span>
            </div>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {isRunning ? 'Analyzing...' : 'Run'}
            </button>
          </div>

          {/* Editor / Visualization */}
          <div className="grid min-h-0 flex-1 grid-cols-2">
            {/* Monaco Editor */}
            <div className="min-h-0 border-r border-white/10 p-6">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl shadow-black/20">
                {/* Editor Header */}
                <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/10 px-4">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-xs text-slate-500">
                    Editor
                  </span>
                </div>

                {/* Monaco */}
                <div className="min-h-0 flex-1">
                  <CodeEditor
                    value={code}
                    language="python"
                    onChange={setCode}
                  />
                </div>
              </div>
            </div>

            {/* Visualization */}
            <div className="min-h-0 p-6">
              <div className="flex h-full items-center justify-center overflow-auto rounded-xl border border-dashed border-white/10 bg-[#0d1117]/60 p-6">
                <div className="w-full max-w-md">
                  {/* Initial State */}
                  {!parseResult && !error && (
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20">
                        <GitBranch className="h-6 w-6 text-blue-400" />
                      </div>

                      <h2 className="text-sm font-medium text-slate-300">
                        Visualization
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-slate-600">
                        Click Run to analyze your code.
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-400" />

                        <p className="text-xs font-medium text-red-400">
                          Analysis failed
                        </p>
                      </div>

                      <p className="mt-3 text-xs leading-5 text-red-300/70">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Parse Result */}
                  {parseResult && (
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                              Parser Result
                            </p>

                            <h2 className="mt-1 text-sm font-medium text-slate-200">
                              Syntax Analysis
                            </h2>
                          </div>

                          <div
                            className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                              parseResult.has_syntax_errors
                                ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                            }`}
                          >
                            {parseResult.has_syntax_errors
                              ? 'Syntax Error'
                              : 'Valid Syntax'}
                          </div>
                        </div>
                      </div>

                      {/* Syntax Tree */}
                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <p className="text-[11px] text-slate-500">
                          Syntax Tree
                        </p>

                        <p className="mt-1 font-mono text-sm text-blue-300">
                          {parseResult.syntax_tree_type}
                        </p>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                          <p className="text-[11px] text-slate-500">
                            Functions
                          </p>

                          <p className="mt-1 text-2xl font-semibold text-blue-400">
                            {parseResult.functions_found.length}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                          <p className="text-[11px] text-slate-500">
                            Classes
                          </p>

                          <p className="mt-1 text-2xl font-semibold text-purple-400">
                            {parseResult.classes_found.length}
                          </p>
                        </div>
                      </div>

                      {/* Functions */}
                      {parseResult.functions_found.length > 0 && (
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                          <p className="mb-3 text-[11px] text-slate-500">
                            Functions Found
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {parseResult.functions_found.map((name) => (
                              <span
                                key={name}
                                className="rounded-md bg-blue-500/10 px-2.5 py-1.5 font-mono text-xs text-blue-300 ring-1 ring-blue-500/20"
                              >
                                {name}()
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Classes */}
                      {parseResult.classes_found.length > 0 && (
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                          <p className="mb-3 text-[11px] text-slate-500">
                            Classes Found
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {parseResult.classes_found.map((name) => (
                              <span
                                key={name}
                                className="rounded-md bg-purple-500/10 px-2.5 py-1.5 font-mono text-xs text-purple-300 ring-1 ring-purple-500/20"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Syntax Errors */}
                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Syntax Errors
                          </span>

                          <span
                            className={
                              parseResult.has_syntax_errors
                                ? 'text-xs font-medium text-red-400'
                                : 'text-xs font-medium text-emerald-400'
                            }
                          >
                            {parseResult.has_syntax_errors
                              ? 'Detected'
                              : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <footer className="flex h-9 items-center justify-between border-t border-white/10 bg-[#0d1117] px-4 text-[11px]">
            <span
              className={
                error
                  ? 'text-red-400'
                  : isRunning
                    ? 'text-blue-400'
                    : parseResult
                      ? 'text-emerald-400'
                      : 'text-slate-600'
              }
            >
              {error
                ? 'Analysis failed'
                : isRunning
                  ? 'Analyzing code...'
                  : parseResult
                    ? 'Analysis complete'
                    : 'Ready'}
            </span>

            <span className="text-slate-600">
              CodeSight Engine
            </span>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App