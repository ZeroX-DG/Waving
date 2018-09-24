import startStopButtonStructure from '../structures/startStopButton';
import '../styles/startStopButton.sass';
import { stringToNode } from '../util';

export interface IStartStopButton {
  render(): HTMLElement;
  onStart(callback: () => void);
  onStop(callback: () => void);
  start();
  stop();
}

export default class StartStopButton implements IStartStopButton {
  private button: HTMLElement;
  private icon: HTMLElement;
  private isPlaying: boolean;
  private startCallback: () => void;
  private stopCallback: () => void;

  public render(): HTMLElement {
    this.button = stringToNode(startStopButtonStructure);
    this.icon = this.button.querySelector('.icon');
    this.button.addEventListener('click', () => {
      if (this.isPlaying) {
        this.stop();
      } else {
        this.start();
      }
    });
    return this.button;
  }

  public stop() {
    this.stopCallback();
    this.isPlaying = false;
    this.icon.className = 'icon icon-play';
  }

  public start() {
    this.startCallback();
    this.isPlaying = true;
    this.icon.className = 'icon icon-pause';
  }

  public onStart(callback: () => void) {
    this.startCallback = callback;
  }

  public onStop(callback: () => void) {
    this.stopCallback = callback;
  }
}
