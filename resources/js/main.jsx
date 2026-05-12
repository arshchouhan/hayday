import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LanguageProvider } from "./context/LanguageContext";

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// ─── Global fetch patch ───────────────────────────────────────────────────────
// Every raw fetch('/api/...') call in this codebase was missing
// credentials: 'include', so the session cookie was never sent and the backend
// treated every request as unauthenticated.  Patching once here is safer and
// less error-prone than updating 25+ individual call sites.
const _nativeFetch = window.fetch.bind(window);
window.fetch = function patchedFetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url ?? '';
    // Only inject credentials for our own API — leave external fetches alone
    if (url.startsWith('/api') || url.startsWith('/sanctum')) {
        init = {
            ...init,
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
                ...(init.headers ?? {}),
            },
        };
    }
    return _nativeFetch(input, init);
};
// ─────────────────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
