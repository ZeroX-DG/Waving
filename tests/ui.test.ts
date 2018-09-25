const Waving = require('../dist/waving');

const playerWidth = 600;

const initContainer = () => {
  document.body.innerHTML = `<div id="player" style="width: ${playerWidth}px" />`;
};

it('Has no controls if controls is set to false', () => {
  initContainer();
  const container = document.getElementById('player');
  new Waving(container, { controls: false });
  expect(container.childElementCount).toBe(1);
  expect(container.firstChild.nodeName).toBe('CANVAS');
});
