import startStopButtonStructure from '../structures/startStopButton';
import '../styles/startStopButton.sass';
import { stringToNode } from '../util';
import { IWavingOption } from '../common';

export interface IStartStopButton {
  render(): HTMLElement;
  setAudio(audio: HTMLAudioElement);
  onStart(callback: () => void);
  onPause(callback: () => void);
  start();
  pause();
}

export default class StartStopButton implements IStartStopButton {
  private button: HTMLElement;
  private icon: HTMLElement;
  private isPlaying: boolean;
  private color: string;
  private audio: HTMLAudioElement;
  private startCallback: () => void;
  private pauseCallback: () => void;

  constructor(option: IWavingOption) {
    this.color = option.controlsColor;
  }

  public render(): HTMLElement {
    this.button = stringToNode(startStopButtonStructure);
    this.icon = this.button.querySelector('.icon');
    this.initInterface();
    this.button.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.start();
      }
    });
    return this.button;
  }

  public setAudio(audio: HTMLAudioElement) {
    this.audio = audio;
    this.trackState();
  }

  public trackState() {
    let isFirstTime = true;
    this.audio.onpause = () => {
      if (isFirstTime) {
        isFirstTime = false;
        return;
      }
      this.pause();
    };

    this.audio.onplay = () => {
      if (isFirstTime) {
        isFirstTime = false;
        return;
      }
      this.start();
    };
  }

  public pause() {
    this.pauseCallback();
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

  public onPause(callback: () => void) {
    this.pauseCallback = callback;
  }

  private initInterface() {
    if (this.color) {
      this.button.style.background = this.color;
    }
  }
}
