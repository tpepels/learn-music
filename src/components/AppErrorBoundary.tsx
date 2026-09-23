import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

function asError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return { error: asError(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("PLAY / LAB render failed", error, info);
  }

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <main className="fatal-error-shell" role="alert">
        <section className="fatal-error-card">
          <span className="section-label">PLAY / LAB could not finish loading</span>
          <h1>The interface hit an unexpected project-state error.</h1>
          <p>
            Your saved project has not been deleted. Reload once after an update;
            if the problem remains, the technical detail below identifies the
            failing state instead of leaving an empty screen.
          </p>
          <button
            className="transport-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            Reload PLAY / LAB
          </button>
          <details>
            <summary>Technical detail</summary>
            <pre>{error.stack ?? error.message}</pre>
          </details>
        </section>
      </main>
    );
  }
}
