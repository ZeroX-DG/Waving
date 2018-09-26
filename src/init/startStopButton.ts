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

  /**
   * @return {HTMLElement} start-stop button after created from string
   */
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

  /**
   * Set audio element to interact
   * @param audio Audio element to interact
   */
  public setAudio(audio: HTMLAudioElement) {
    this.audio = audio;
    this.trackState();
  }

  /**
   * Track "playing state" of the audio to update the UI accordingly
   */
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

  /**
   * Pause the audio and update UI
   */
  public pause() {
    this.pauseCallback();
    this.isPlaying = false;
    this.icon.className = 'icon icon-play';
  }

  /**
   * Start the audio and start the UI accordingly
   */
  public start() {
    this.startCallback();
    this.isPlaying = true;
    this.icon.className = 'icon icon-pause';
  }

  /**
   * Set callback function for tracking when the audio is started
   * @param callback Callback function when audio file is started
   */
  public onStart(callback: () => void) {
    this.startCallback = callback;
  }

  /**
   * Set callback function for tracking when the audio is paused
   * @param callback Callback function when audio file is paused
   */
  public onPause(callback: () => void) {
    this.pauseCallback = callback;
  }

  /**
   * Update the UI if controls option set the true
   */
  private initInterface() {
    if (this.color) {
      this.button.style.background = this.color;
    }
  }
}
