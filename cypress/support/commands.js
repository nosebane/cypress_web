// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// ─────────────────────────────────────────────────────────────────────────────
// cy.parseCSV(filePath)
//
// Reads a CSV file from disk (via the Node task registered in cypress.config.js)
// and returns a Promise that resolves to an array of plain objects, where each
// key is taken from the header row and each value is the corresponding cell.
//
// Usage:
//   cy.parseCSV('cypress/fixtures/users.csv').then((users) => { ... })
// ─────────────────────────────────────────────────────────────────────────────
Cypress.Commands.add('parseCSV', (filePath) => {
  return cy.task('parseCSV', filePath);
});

// ─────────────────────────────────────────────────────────────────────────────
// cy.dismissAds()
//
// demoqa.com sometimes renders a banner / ad iframe that sits on top of elements.
// This command attempts to remove those overlapping elements from the DOM so that
// Cypress can interact with the page controls reliably.
// ─────────────────────────────────────────────────────────────────────────────
Cypress.Commands.add('dismissAds', () => {
  // Remove ad / overlay iframes that block clicks
  cy.get('body').then(($body) => {
    const selectors = [
      '#fixedban',
      'footer',
      '.ad-space',
      '[id^="google_ads"]',
      'iframe[id*="ad"]',
    ];
    selectors.forEach((sel) => {
      if ($body.find(sel).length > 0) {
        $body.find(sel).remove();
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Custom debug logging command that can be toggled on/off via environment variable
Cypress.Commands.add('debugLog', (message, category = 'DEFAULT') => {
  cy.window().then((win) => {
    // Read from environment variable and set up config
    const debugEnv = Cypress.env("ENABLE_DEBUG_LOGGING")
    win.CONFIG = win.CONFIG || {}
    win.CONFIG.ENABLE_DEBUG_LOGGING = String(debugEnv).replace(/"/g, "") === "true"
    
    const config = win.CONFIG
    
    // Check if debug logging is enabled
    if (config.ENABLE_DEBUG_LOGGING === true) {
      // Optional: Filter by category if DEBUG_FILTER is set
      const debugFilter = config.DEBUG_FILTER
      if (!debugFilter || category.includes(debugFilter) || category === 'DEFAULT') {
        const logMessage = `[${category}] ${message}`
        
        // Show in Cypress GUI (Test Runner)
        cy.log(logMessage)
        
        // Show in terminal/console (headless runs) using cy.then for proper chaining
        cy.then(() => {
          try {
            return cy.task('log', logMessage, { log: false })
          } catch (error) {
            // Fallback if task doesn't exist
            console.log(logMessage)
            return null
          }
        })
      }
    }
  })
})