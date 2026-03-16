/**
 * Droppable Test Cases — demoqa.com/droppable
 *
 * TC-DROP-01 : Simple drag & drop
 * TC-DROP-02 : Accept tab — acceptable draggable
 * TC-DROP-03 : Accept tab — not-acceptable draggable
 *
 * POM: cypress/pages/DroppablePage.js
 */

import DroppablePage from '../../pages/DroppablePage';

const page = new DroppablePage();

beforeEach(() => {
  page.visit();
  cy.dismissAds();
});

describe('Droppable — Drag and Drop', () => {

  it('TC-DROP-01 | Simple: Dragging element onto drop zone changes text to Dropped!', () => {
    page.simpleDropTargetText.should('have.text', 'Drop Here');
    page.dragTo('#draggable', '#simpleDropContainer #droppable');
    page.simpleDropTargetText.should('have.text', 'Dropped!');
  });

  it('TC-DROP-02 | Accept: Acceptable draggable should be dropped successfully', () => {
    page.switchToAcceptTab();
    page.acceptDropTargetText.should('have.text', 'Drop here');
    page.dragTo('#acceptable', '#acceptDropContainer .drop-box');
    page.acceptDropTargetText.should('have.text', 'Dropped!');
  });

  it('TC-DROP-03 | Accept: Not Acceptable draggable should NOT change drop zone text', () => {
    page.switchToAcceptTab();
    page.acceptDropTargetText.should('have.text', 'Drop here');
    page.dragTo('#acceptDropContainer .drag-box:not(#acceptable)', '#acceptDropContainer .drop-box');
    page.acceptDropTargetText.should('have.text', 'Drop here');
  });
});
