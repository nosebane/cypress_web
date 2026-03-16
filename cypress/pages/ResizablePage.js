/**
 * ResizablePage - Page Object Model
 * URL: https://demoqa.com/resizable
 */
class ResizablePage {
  get pageUrl() {
    return "/resizable";
  }

  // ── Resizable box with restriction ─────────────────────────────────────────
  get restrictedBox() {
    return cy.get("#resizableBoxWithRestriction");
  }

  get restrictedHandle() {
    return cy.get("#resizableBoxWithRestriction .react-resizable-handle");
  }

  // ── Free resizable box ──────────────────────────────────────────────────────
  get freeBox() {
    return cy.get("#resizable");
  }

  get freeHandle() {
    return cy.get("#resizable .react-resizable-handle");
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  visit() {
    cy.visit(this.pageUrl);
    this.freeBox.should("be.visible");
  }

  /**
   * Resize the free resizable box to the given width and height by
   * dragging the resize handle from its current edge.
   *
   * @param {number} targetWidth  - desired final width in px
   * @param {number} targetHeight - desired final height in px
   */
  resizeFreeBoxTo(targetWidth, targetHeight) {
    this.freeBox.then(($box) => {
      const { width: currentW, height: currentH } = $box[0].getBoundingClientRect();
      const deltaX = targetWidth - currentW;
      const deltaY = targetHeight - currentH;

      this.freeHandle.trigger("mousedown", { button: 0 })
        .trigger("mousemove", { clientX: deltaX, clientY: deltaY })
        .trigger("mouseup");
    });
  }

  /**
   * Resize by dragging the handle using real CDP mouse events.
   * realMouseMove(dx, dy) is relative to the handle's center.
   * We add handle half-dimensions to compensate for center-to-edge offset.
   *
   * @param {Cypress.Chainable} handleGetter - e.g. this.freeHandle
   * @param {number} deltaX  - desired box width change in px
   * @param {number} deltaY  - desired box height change in px
   */
  dragHandleBy(handleGetter, deltaX, deltaY) {
    handleGetter.then(($handle) => {
      const rect = $handle[0].getBoundingClientRect();
      // Compensate for handle center being offset from the box edge
      const adjX = deltaX + Math.sign(deltaX) * (rect.width / 2);
      const adjY = deltaY + Math.sign(deltaY) * (rect.height / 2);

      cy.wrap($handle)
        .realMouseDown({ position: "center" })
        .realMouseMove(adjX, adjY, { steps: 20 })
        .realMouseUp({ position: "center" });
    });
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  /**
   * Assert the free box dimensions (with a tolerance of ±5 px).
   */
  verifyFreeBoxSize(expectedWidth, expectedHeight, tolerance = 5) {
    this.freeBox.then(($el) => {
      const { width, height } = $el[0].getBoundingClientRect();
      expect(width).to.be.closeTo(expectedWidth, tolerance, `width should be ~${expectedWidth}px`);
      expect(height).to.be.closeTo(expectedHeight, tolerance, `height should be ~${expectedHeight}px`);
    });
  }

  /**
   * Assert the restricted box dimensions.
   */
  verifyRestrictedBoxSize(expectedWidth, expectedHeight, tolerance = 5) {
    this.restrictedBox.then(($el) => {
      const { width, height } = $el[0].getBoundingClientRect();
      expect(width).to.be.closeTo(expectedWidth, tolerance, `width should be ~${expectedWidth}px`);
      expect(height).to.be.closeTo(expectedHeight, tolerance, `height should be ~${expectedHeight}px`);
    });
  }
}

export default ResizablePage;
