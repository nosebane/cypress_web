/**
 * Positive Test Cases — Web Tables (demoqa.com/webtables)
 *
 * TC-POS-01: Bulk insert — register every user from CSV, verify each row in table
 * TC-POS-02: Search — after registering, search by name and verify filter works
 *
 * Teknik:
 *   - Page Object Model (POM) → cypress/pages/WebTablesPage.js
 *   - Data-Driven Testing     → cy.parseCSV() reads cypress/fixtures/users.csv
 */

import WebTablesPage from "../../pages/WebTablesPage";

const page = new WebTablesPage();
const CSV_PATH = "cypress/fixtures/users.csv";

// ─── Shared setup ─────────────────────────────────────────────────────────────
beforeEach(() => {
  page.visit();
  cy.dismissAds();
});

// ─────────────────────────────────────────────────────────────────────────────
describe("Web Tables — Positive Test Cases", () => {

  // TC-POS-01: Bulk insert all CSV users and verify each appears in the table
  it("TC-POS-01 | Bulk Insert: Register all CSV users and verify each row in table", () => {
    cy.parseCSV(CSV_PATH).then((users) => {
      cy.debugLog(`Total users to register: ${users.length}`, "POSITIVE");

      users.forEach((user, index) => {
        cy.debugLog(`[${index + 1}/${users.length}] Registering: ${user.firstName} ${user.lastName}`, "POSITIVE");

        // Open modal → fill form → submit
        page.addUser(user);

        // After valid submission the modal must close automatically
        page.verifyFormIsClosed();

        // Verify the new row is visible in the table
        page.verifyUserInTable(user);
      });
    });
  });

  // TC-POS-02: Register two users then search by first name of the first user
  it("TC-POS-02 | Search: Registered user can be found via the search box", () => {
    cy.parseCSV(CSV_PATH).then((users) => {
      const userA = users[0];
      const userB = users[1];

      // Register two users
      page.addUser(userA);
      page.verifyFormIsClosed();
      page.addUser(userB);
      page.verifyFormIsClosed();

      // Search for userA by first name
      page.searchBox.clear().type(userA.firstName);

      // userA must be visible
      page.verifyUserInTable(userA);

      // userB (different first name) must be filtered out
      page.verifyUserNotInTable(userB.email);
    });
  });
});
