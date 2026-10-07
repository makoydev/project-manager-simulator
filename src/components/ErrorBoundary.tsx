import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Leave the broken screen but keep the saved run. */
  onBack: () => void
  /** Discard the saved run, in case the save itself is what crashes. */
  onFresh: () => void
}

interface State {
  error: Error | null
}

/** A crash anywhere shows a recovery card instead of a blank page. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Ship It, Lah! crashed:', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    const reset = (fn: () => void) => () => {
      fn()
      this.setState({ error: null })
    }
    return (
      <div role="alert" className="grid h-full place-items-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 text-center shadow-[var(--shadow-pop)]">
          <p className="text-4xl" aria-hidden>
            ⚠️
          </p>
          <h1 className="mt-2 font-display text-[20px] font-bold">Train fault on the line</h1>
          <p className="mt-2 text-[14px] text-ink-2">Something went wrong on this screen. Your progress up to your last move is saved.</p>
          <pre className="mt-3 max-h-24 overflow-auto rounded-xl bg-surface-2 p-2 text-left text-[11px] whitespace-pre-wrap text-muted">{error.message}</pre>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={reset(this.props.onBack)} className="h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink">
              Back to title
            </button>
            <button type="button" onClick={reset(this.props.onFresh)} className="h-10 rounded-xl border border-line-strong bg-surface px-4 text-sm font-semibold text-ink">
              Start fresh
            </button>
          </div>
        </div>
      </div>
    )
  }
}
