/**
 * Resizable Test Cases — demoqa.com/resizable
 *
 * TC-RES-01 : Resize free box ke 400 x 200
 * TC-RES-02 : Verifikasi free box dimulai dari ukuran default (200 x 200)
 * TC-RES-03 : Resize restricted box (max 500x300) dan verifikasi dimensi
 *
 * POM: cypress/pages/ResizablePage.js
 *
 * Teknik resize:
 *   Cypress tidak punya built-in resize command. Kita trigger pointer events
 *   (pointerdown → pointermove → pointerup) pada resize handle.
 *   Delta dihitung dari ukuran saat ini ke ukuran target.
 */

import ResizablePage from "../../pages/ResizablePage";

const page = new ResizablePage();

const TARGET_WIDTH  = 400;
const TARGET_HEIGHT = 200;

beforeEach(() => {
  page.visit();
  cy.dismissAds();
});

describe("Resizable — Resize Element", () => {

  // TC-RES-01 : Resize free box ke 400 x 200
  it(`TC-RES-01 | Resize free box to ${TARGET_WIDTH} x ${TARGET_HEIGHT}`, () => {
    // Ambil ukuran awal free box
    page.freeBox.then(($box) => {
      const { width: initW, height: initH } = $box[0].getBoundingClientRect();

      const deltaX = TARGET_WIDTH  - initW;
      const deltaY = TARGET_HEIGHT - initH;

      cy.debugLog(`Initial size: ${Math.round(initW)}x${Math.round(initH)}`, "RESIZABLE");
      cy.debugLog(`Delta needed: dx=${Math.round(deltaX)}, dy=${Math.round(deltaY)}`, "RESIZABLE");

      // Drag resize handle sebesar delta yang dibutuhkan
      page.dragHandleBy(page.freeHandle, deltaX, deltaY);
    });

    // Verifikasi dimensi akhir mendekati 400 x 200 (toleransi ±10px)
    page.verifyFreeBoxSize(TARGET_WIDTH, TARGET_HEIGHT, 10);

    cy.debugLog(`TC-RES-01 PASSED: free box resized to ~${TARGET_WIDTH}x${TARGET_HEIGHT}`, "RESIZABLE");
  });

  // TC-RES-02 : Verifikasi ukuran awal free box adalah 200 x 200
  it("TC-RES-02 | Default size: Free resizable box starts at 200 x 200", () => {
    page.freeBox.then(($el) => {
      const { width, height } = $el[0].getBoundingClientRect();
      cy.debugLog(`Default size: ${Math.round(width)}x${Math.round(height)}`, "RESIZABLE");
      expect(width).to.be.closeTo(200, 10, "default width should be ~200px");
      expect(height).to.be.closeTo(200, 10, "default height should be ~200px");
    });
  });

  // TC-RES-03 : Resize restricted box (max 500x300)
  it("TC-RES-03 | Restricted box: Resize within boundaries and verify dimensions", () => {
    const restrictedTargetW = 400;
    const restrictedTargetH = 200;

    page.restrictedBox.then(($box) => {
      const { width: initW, height: initH } = $box[0].getBoundingClientRect();

      const deltaX = restrictedTargetW - initW;
      const deltaY = restrictedTargetH - initH;

      cy.debugLog(`Restricted box initial: ${Math.round(initW)}x${Math.round(initH)}`, "RESIZABLE");

      page.dragHandleBy(page.restrictedHandle, deltaX, deltaY);
    });

    page.verifyRestrictedBoxSize(restrictedTargetW, restrictedTargetH, 10);

    cy.debugLog("TC-RES-03 PASSED: restricted box resized successfully", "RESIZABLE");
  });
});
