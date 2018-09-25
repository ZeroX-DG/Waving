import startStopButtonStructure from '../structures/startStopButton';
import '../styles/startStopButton.sass';
import { stringToNode } from '../util';
import { IWavingOption } from '../common';

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
  private color: string;
  private startCallback: () => void;
  private stopCallback: () => void;

  constructor(option: IWavingOption) {
    this.color = option.controlsColor;
  }

  public render(): HTMLElement {
    this.button = stringToNode(startStopButtonStructure);
    this.icon = this.button.querySelector('.icon');
    this.initInterface();
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

  private initInterface() {
    if (this.color) {
      this.button.style.background = this.color;
    }
  }
}
