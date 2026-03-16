/**
 * DroppablePage - Page Object Model
 * URL: https://demoqa.com/droppable
 *
 * DOM structure (confirmed via probe):
 *  Simple tab pane (#droppableExample-tabpane-simple):
 *    #simpleDropContainer > #draggable (.drag-box)
 *    #simpleDropContainer > #droppable (.drop-box) > p
 *
 *  Accept tab pane (#droppableExample-tabpane-accept):
 *    #acceptDropContainer > div > #acceptable (.drag-box)
 *    #acceptDropContainer > div > .drag-box  (Not Acceptable — NO id)
 *    #acceptDropContainer > .drop-box > p    (drop zone — NO id)
 */
class DroppablePage {
  get pageUrl() {
    return "/droppable";
  }

  // ── Tab selectors ────────────────────────────────────────────────────────────
  get simpleTab() {
    return cy.get("#droppableExample-tab-simple");
  }

  get acceptTab() {
    return cy.get("#droppableExample-tab-accept");
  }

  // ── Simple tab elements ──────────────────────────────────────────────────────
  get simpleDraggable() {
    return cy.get("#draggable");
  }

  get simpleDropTarget() {
    return cy.get("#simpleDropContainer #droppable");
  }

  get simpleDropTargetText() {
    return cy.get("#simpleDropContainer #droppable p");
  }

  // ── Accept tab elements ──────────────────────────────────────────────────────
  get acceptableBox() {
    return cy.get("#acceptable");
  }

  /** "Not Acceptable" has no ID — select by text content inside the accept container */
  get notAcceptableBox() {
    return cy.get("#acceptDropContainer .drag-box").not("#acceptable");
  }

  /** Drop zone inside accept tab — .drop-box (no id) */
  get acceptDropTarget() {
    return cy.get("#acceptDropContainer .drop-box");
  }

  get acceptDropTargetText() {
    return cy.get("#acceptDropContainer .drop-box p");
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  /**
   * Intercept the main JS bundle and prepend a patch that captures the internal
   * jQuery instance (`g`) used by jQuery UI, exposing its `.fn` on `window.$`.
   * Must be called BEFORE cy.visit().
   */
  _interceptBundle() {
    const patch = [
      ";(function(){",
      "try{",
      "var _o=Object.defineProperty;",
      "Object.defineProperty=function(a,b,c){",
      "try{",
      'if(b==="fn"&&c&&c.value&&typeof c.value.jquery==="string"){window.__jq=a;}',
      "return _o.call(this,a,b,c);",
      "}catch(e){return _o.call(this,a,b,c);}",
      "};",
      "}catch(e){}",
      "})();"
    ].join("");

    cy.intercept("**/index-D_rDx8ml.js", (req) => {
      req.continue((res) => {
        res.body = patch + res.body;
      });
    });
  }

  visit() {
    this._interceptBundle();
    cy.visit(this.pageUrl);
    cy.get("#draggable", { timeout: 30000 }).should("exist");
    // Poll until jQuery UI droppable plugin is ready (lazy-loaded via ES module)
    cy.window({ timeout: 20000 }).should((win) => {
      expect(win.$ && typeof win.$.fn.droppable).to.equal("function");
    });
  }

  switchToAcceptTab() {
    this.acceptTab.click();
    cy.get("#acceptDropContainer", { timeout: 15000 }).should("be.visible");
  }

  /**
   * Drag source onto target using jQuery UI's own event system (window.$).
   * The bundle intercept ensures window.$ has jQuery UI plugins attached.
   * jQuery UI listens: mousedown on element, mousemove/mouseup on document.
   */
  dragTo(sourceSelector, targetSelector) {
    cy.get(sourceSelector).scrollIntoView();
    cy.window().then((win) => {
      const jq = win.$;
      const drag = jq(sourceSelector);
      const drop = jq(targetSelector);
      const sX = drag.offset().left + drag.outerWidth() / 2;
      const sY = drag.offset().top + drag.outerHeight() / 2;
      const tX = drop.offset().left + drop.outerWidth() / 2;
      const tY = drop.offset().top + drop.outerHeight() / 2;
      const doc = jq(win.document);

      drag.trigger({ type: "mousedown", which: 1, button: 0, pageX: sX, pageY: sY, clientX: sX, clientY: sY });
      for (let i = 1; i <= 30; i++) {
        const x = sX + (tX - sX) * i / 30;
        const y = sY + (tY - sY) * i / 30;
        doc.trigger({ type: "mousemove", which: 1, button: 0, pageX: x, pageY: y, clientX: x, clientY: y });
      }
      doc.trigger({ type: "mouseup", which: 1, button: 0, pageX: tX, pageY: tY, clientX: tX, clientY: tY });
    });
  }
}

export default DroppablePage;
