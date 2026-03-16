/**
 * Negative Test Cases — Web Tables (demoqa.com/webtables)
 *
 * TC-NEG-01 — Email dikosongkan
 * TC-NEG-02 — Age diisi dengan huruf (non-numeric)
 * TC-NEG-03 — Salary dikosongkan
 * TC-NEG-04 — Semua field dikosongkan
 * TC-NEG-05 — Format email tidak valid (missing @)
 *
 * Expected Result (semua skenario):
 *   ✅ Modal registrasi TETAP TERBUKA → bukti langsung data tidak disimpan
 *   ✅ Field yang invalid memiliki :invalid pseudo-class (HTML5 constraint API)
 *
 * Catatan desain:
 *   Ketika form TIDAK ter-dismiss setelah Submit, itu membuktikan secara
 *   definitif bahwa data tidak disimpan ke tabel — verifikasi tabel terpisah
 *   tidak diperlukan dan berpotensi menimbulkan flakiness.
 */

import WebTablesPage from "../../pages/WebTablesPage";

const page = new WebTablesPage();

const VALID_USER = {
  firstName:  "Test",
  lastName:   "Negative",
  email:      "test.negative@example.com",
  age:        "28",
  salary:     "5000000",
  department: "QA",
};

beforeEach(() => {
  page.visit();
  cy.dismissAds();
  // Wait for the table to be present (page.visit() already does this, belt-and-suspenders)
  cy.get("table tbody", { timeout: 30000 }).should("exist");
});

describe("Web Tables — Negative Test Cases", () => {

  it("TC-NEG-01 | Empty Email: Form should NOT submit; email field shows error", () => {
    cy.debugLog("TC-NEG-01: empty email submission", "NEGATIVE");

    page.openRegistrationForm();
    page.fillForm({ ...VALID_USER, email: undefined });
    page.submitForm();

    // Form must remain open — proves data was NOT saved
    page.verifyFormIsStillOpen();
    // Email field must be in browser :invalid state
    page.verifyFieldIsInvalid(page.emailField);
  });

  it("TC-NEG-02 | Age with Letters: Form should NOT submit; age field shows error", () => {
    cy.debugLog("TC-NEG-02: non-numeric age submission", "NEGATIVE");

    page.openRegistrationForm();
    page.fillForm({ ...VALID_USER, age: undefined });
    // type="number" silently drops non-numeric chars → field becomes ""  → :invalid
    page.ageField.clear().type("abcde");
    page.submitForm();

    page.verifyFormIsStillOpen();
    page.verifyFieldIsInvalid(page.ageField);
  });

  it("TC-NEG-03 | Empty Salary: Form should NOT submit; salary field shows error", () => {
    cy.debugLog("TC-NEG-03: empty salary submission", "NEGATIVE");

    page.openRegistrationForm();
    page.fillForm({ ...VALID_USER, salary: undefined });
    page.submitForm();

    page.verifyFormIsStillOpen();
    page.verifyFieldIsInvalid(page.salaryField);
  });

  it("TC-NEG-04 | All Fields Empty: All required fields should show errors", () => {
    cy.debugLog("TC-NEG-04: blank form submission", "NEGATIVE");

    page.openRegistrationForm();
    page.submitForm(); // submit without filling anything

    page.verifyFormIsStillOpen();

    [
      page.firstNameField,
      page.lastNameField,
      page.emailField,
      page.ageField,
      page.salaryField,
      page.departmentField,
    ].forEach((field) => page.verifyFieldIsInvalid(field));
  });

  it("TC-NEG-05 | Invalid Email Format: Form should NOT submit with malformed email", () => {
    cy.debugLog("TC-NEG-05: malformed email submission", "NEGATIVE");

    page.openRegistrationForm();
    page.fillForm({ ...VALID_USER, email: "not-a-valid-email" });
    page.submitForm();

    // Browser native email validation catches missing "@"
    page.verifyFormIsStillOpen();
    page.verifyFieldIsInvalid(page.emailField);
  });
});
