/**
 * WebTablesPage - Page Object Model
 *
 * Represents the demoqa.com/webtables page.
 * Contains all selectors, actions, and assertions
 * needed to interact with the Web Tables feature.
 */
class WebTablesPage {
  // ─────────────────────────────────────────────
  // SELECTORS
  // ─────────────────────────────────────────────

  /** Page URL (relative to baseUrl) */
  get pageUrl() {
    return "/webtables";
  }

  // ── Table Controls ──────────────────────────
  get addButton() {
    return cy.get("#addNewRecordButton");
  }

  get searchBox() {
    return cy.get("#searchBox");
  }

  get tableBody() {
    // demoqa.com now renders a standard HTML <table> with class 'web-table'
    return cy.get("table tbody");
  }

  get tableRows() {
    return cy.get("table tbody tr");
  }

  // ── Registration Form ────────────────────────
  get registrationForm() {
    return cy.get(".modal-content");
  }

  get registrationFormTitle() {
    return cy.get("#registration-form-modal");
  }

  get firstNameField() {
    return cy.get("#firstName");
  }

  get lastNameField() {
    return cy.get("#lastName");
  }

  get emailField() {
    return cy.get("#userEmail");
  }

  get ageField() {
    return cy.get("#age");
  }

  get salaryField() {
    return cy.get("#salary");
  }

  get departmentField() {
    return cy.get("#department");
  }

  get submitButton() {
    return cy.get("#submit");
  }

  /** × button in the modal header (Bootstrap 4 / demoqa default) */
  get closeXButton() {
    return cy.get("button[aria-label='Close']");
  }

  /** 'Close' button in the modal footer */
  get closeFooterButton() {
    return cy.get("#closeLargeModal");
  }

  // ─────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────

  /**
   * Navigate to the Web Tables page and wait for the table to render.
   * Ad hosts are blocked at the config level (blockHosts in cypress.config.js)
   * to prevent slow third-party scripts from delaying the page load event.
   */
  visit() {
    cy.visit(this.pageUrl);
    // Wait for the table body to be present before any test step runs
    cy.get("table tbody", { timeout: 30000 }).should("exist");
  }

  /**
   * Click the "Add" button and wait for the modal to be visible.
   */
  openRegistrationForm() {
    this.addButton.click();
    this.registrationForm.should("be.visible");
  }

  /**
   * Fill the registration form fields.
   * Only fills fields whose values are provided (truthy).
   *
   * @param {Object} user - User data object
   * @param {string} [user.firstName]
   * @param {string} [user.lastName]
   * @param {string} [user.email]
   * @param {string} [user.age]
   * @param {string} [user.salary]
   * @param {string} [user.department]
   */
  fillForm({ firstName, lastName, email, age, salary, department }) {
    if (firstName)   this.firstNameField.clear().type(firstName);
    if (lastName)    this.lastNameField.clear().type(lastName);
    if (email)       this.emailField.clear().type(email);
    if (age)         this.ageField.clear().type(age);
    if (salary)      this.salaryField.clear().type(salary);
    if (department)  this.departmentField.clear().type(department);
  }

  /**
   * Click the Submit button.
   */
  submitForm() {
    this.submitButton.click();
  }

  /**
   * Dismiss the registration modal without submitting.
   *
   * Uses the Escape key which is always safe for Bootstrap modals and
   * avoids any risk of button clicks that could trigger a navigation.
   * Falls back to clicking the footer Close button if ESC fails.
   */
  closeForm() {
    // ESC is the most reliable way to dismiss a Bootstrap modal
    cy.get('body').type('{esc}');
    // Give the modal animation time to finish
    cy.get('.modal').should('not.be.visible');
  }

  /**
   * Full flow: open modal → fill form → submit.
   *
   * @param {Object} user - User data object
   */
  addUser(user) {
    this.openRegistrationForm();
    this.fillForm(user);
    this.submitForm();
  }

  // ─────────────────────────────────────────────
  // ASSERTIONS
  // ─────────────────────────────────────────────

  /**
   * Assert that a user row is visible in the table.
   * Checks firstName, lastName, email, age, salary, and department.
   *
   * @param {Object} user - User data object
   */
  verifyUserInTable(user) {
    this.tableBody
      .should("contain.text", user.firstName)
      .and("contain.text", user.lastName)
      .and("contain.text", user.email)
      .and("contain.text", user.age)
      .and("contain.text", user.salary)
      .and("contain.text", user.department);
  }

  /**
   * Assert that a user is NOT present in the table
   * (identified by email as the unique field).
   *
   * @param {string} email - Email of the user that should not appear
   */
  verifyUserNotInTable(email) {
    this.tableBody.should("not.contain.text", email);
  }

  /**
   * Assert that the registration form (modal) is still open.
   * Used after a failed submission to confirm the form was not dismissed.
   */
  verifyFormIsStillOpen() {
    this.registrationForm.should("be.visible");
  }

  /**
   * Assert that the registration form is closed (hidden or removed from DOM).
   * Uses a body-level assertion so it works whether the modal element
   * is visibility:hidden, display:none, OR fully removed from the DOM.
   */
  verifyFormIsClosed() {
    cy.get("body", { timeout: 10000 }).should(($body) => {
      expect($body.find(".modal-content:visible").length, "modal should not be visible").to.equal(0);
    });
  }

  /**
   * Assert that a specific form field has the HTML5 invalid state
   * (red border is applied by demoqa when submit fails validation).
   *
   * @param {Cypress.Chainable} fieldGetter - e.g. this.emailField
   */
  verifyFieldIsInvalid(fieldGetter) {
    fieldGetter.should(($el) => {
      // The element must carry an :invalid pseudo-class via browser constraint API
      expect($el[0].validity.valid).to.be.false;
    });
  }

  /**
   * Assert that the border of a field has turned red (demoqa validation colour).
   *
   * @param {Cypress.Chainable} fieldGetter - e.g. this.emailField
   */
  verifyFieldBorderIsRed(fieldGetter) {
    fieldGetter.should("have.css", "border-color", "rgb(220, 53, 69)");
  }
}

export default WebTablesPage;
