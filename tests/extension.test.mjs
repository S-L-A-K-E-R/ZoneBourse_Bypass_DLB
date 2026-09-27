import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../extension/code/extension_content.js', import.meta.url), 'utf8');

function loadExtension(initialSelectors = []) {
  const elements = initialSelectors.map(selector => ({ selector, removed: false, remove() { this.removed = true; } }));
  const changes = [];
  const rootChanges = [];
  let interval;
  let observerCallback;
  const document = {
    documentElement: { style: { setProperty: (...args) => rootChanges.push(args) } },
    body: { style: { setProperty: (...args) => changes.push(args) } },
    querySelectorAll(selector) {
      return elements.filter(element => element.selector === selector && !element.removed);
    },
  };
  const environment = {
    document,
    console: { log() {} },
    setInterval(callback, milliseconds) { interval = { callback, milliseconds }; return 1; },
    MutationObserver: class {
      constructor(callback) { observerCallback = callback; }
      observe(target, config) {
        assert.equal(target, document.body);
        assert.deepEqual(Object.fromEntries(Object.entries(config)), { childList: true, subtree: true });
      }
    },
  };
  runInNewContext(source, environment, { timeout: 1000 });
  return {
    elements, changes, rootChanges,
    get interval() { return interval; },
    add(selector) {
      const element = { selector, removed: false, remove() { this.removed = true; } };
      elements.push(element);
      return element;
    },
    triggerMutation() { observerCallback([]); },
  };
}

test('removes targeted overlays and restores scrolling on initial load', () => {
  const app = loadExtension(["[id^='modal-portal-']", '.modal_backdrop', '.unrelated']);
  assert.deepEqual(app.elements.map(item => item.removed), [true, true, false]);
  for (const changes of [app.changes, app.rootChanges]) {
    assert.deepEqual(changes, [
      ['overflow', 'auto', 'important'],
      ['position', 'static', 'important'],
    ]);
  }
});

test('leaves scrolling alone when there are no overlays', () => {
  const app = loadExtension();
  assert.equal(app.changes.length, 0);
  assert.equal(app.rootChanges.length, 0);
});

test('detects overlays added later through the mutation observer', () => {
  const app = loadExtension();
  const popup = app.add("[id^='modal-portal-']");
  app.triggerMutation();
  assert.equal(popup.removed, true);
  assert.equal(app.changes.length, 2);
});

test('periodic check removes delayed background overlays', () => {
  const app = loadExtension();
  assert.equal(app.interval.milliseconds, 500);
  const backdrop = app.add('.modal_backdrop');
  app.interval.callback();
  assert.equal(backdrop.removed, true);
});
