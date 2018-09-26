const Waving = require('../dist/waving');
import { classList } from '../src/common';

const playerWidth = 600;

const initContainer = () => {
  document.body.innerHTML = `<div id="player" style="width: ${playerWidth}px" />`;
};

describe('Waving UI', () => {
  it('Contains only 1 canvas if controls set to false', () => {
    initContainer();
    const container = document.getElementById('player');
    new Waving(container, { controls: false });
    expect(container.childElementCount).toBe(1);
    expect(container.firstChild.nodeName).toBe('CANVAS');
  });

  it('Contains all controls if controls set to true', () => {
    initContainer();
    const container = document.getElementById('player');
    new Waving(container, { controls: true });
    // canvas and control container
    expect(container.childElementCount).toBe(2);
    expect(container.firstChild.nodeName).toBe('CANVAS');
    expect((<HTMLCanvasElement>container.firstChild).className).toBe(
      classList.canvas.container
    );
    // controls container
    expect(container.lastChild.nodeName).toBe('DIV');
    const controlContainer = container.lastChild;
    // progress bar, volume bar, start stop button
    expect(controlContainer.childNodes.length).toBe(3);
    expect(controlContainer.childNodes[0].nodeName).toBe('DIV');
    const progressBar = <HTMLDivElement>controlContainer.childNodes[0];
    expect(progressBar.className).toBe(classList.progressBar.container);
    const volumeBar = <HTMLDivElement>controlContainer.childNodes[1];
    expect(volumeBar.className).toBe(classList.volumeBar.container);
    const startStopButton = <HTMLDivElement>controlContainer.childNodes[2];
    expect(startStopButton.className).toBe(classList.startStopButton.container);
  });
});
