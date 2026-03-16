import './commands'
import '@4tw/cypress-drag-drop'
import 'cypress-real-events'

// ── Global ad/tracker blocking ─────────────────────────────────────────────
// Block all third-party requests that are NOT from demoqa.com itself.
// This prevents ad and analytics scripts from delaying window.load.
beforeEach(() => {
  cy.intercept(
    { url: /^https?:\/\/(?!.*demoqa\.com).*/ },
    { statusCode: 204, body: '' }
  );
});