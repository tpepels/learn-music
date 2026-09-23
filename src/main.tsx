import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker
      .getRegistrations()
      .then((registrations) =>
        Promise.all(
          registrations
            .filter((registration) =>
              registration.scope.includes(import.meta.env.BASE_URL),
            )
            .map((registration) => registration.unregister()),
        ),
      )
      .then(() => {
        if (!("caches" in window)) return;
        return caches.keys().then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith("play-lab-"))
              .map((key) => caches.delete(key)),
          ),
        );
      });
  });
}
