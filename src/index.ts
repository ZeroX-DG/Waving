import { IWavingOption, IWavingEvents } from './common';
import './icons/style.css';
import Canvas, { ICanvas } from './init/canvas';
import ProgressBar, { IProgressBar } from './init/progressBar';
import StartStopButton, { IStartStopButton } from './init/startStopButton';
import VolumeBar, { IVolumeBar } from './init/volumeBar';
import './styles/container.sass';

interface IWaving {
  setAudio(audio: string);
  start();
  pause();
  stop();
  setVolume(volume: number);
  mute();
}

let canvas: ICanvas;
let progressBar: IProgressBar;
let startStopButton: IStartStopButton;
let volumeBar: IVolumeBar;
let audio: HTMLAudioElement;

class Waving implements IWaving {
  private root: HTMLElement;
  private option: IWavingOption;
  private listeners: IWavingEvents;

  constructor(
    element: HTMLElement,
    option?: IWavingOption,
    events?: IWavingEvents
  ) {
    this.root = element;
    this.option = option || {};
    this.listeners = events || {};

    // default to show controls
    if (this.option.controls === undefined) {
      this.option.controls = true;
    }
    this.init(this.option);
  }

  /**
   * Set audio file for player
   * @param src The address to the audio file
   */
  public setAudio(src: string) {
    if (typeof src !== 'string') {
      throw new Error(
        'The audio source must a string containing the address to the audio'
      );
    }

    audio = audio || document.createElement('audio');
    this.stop();
    audio.src = src;
    audio.onloadeddata = () => {
      if (this.option.controls) {
        startStopButton.setAudio(audio);
        progressBar.setAudio(audio);
        volumeBar.setAudio(audio);
      }
      canvas.setAudio(audio);
      canvas.visualize();
      audio.onended = () => {
        if (this.option.controls) {
          startStopButton.pause();
        }
        if (this.listeners.onEnded) {
          this.listeners.onEnded();
        }
      };
      if (this.option.autoStart) {
        this.start();
      }
    };
  }

  /**
   * Start the player programmatically
   */
  public start() {
    audio.play();
    if (this.listeners.onStart) {
      this.listeners.onStart();
    }
  }

  /**
   * Pause the player programmatically
   */
  public pause() {
    audio.pause();
    if (this.listeners.onPaused) {
      this.listeners.onPaused();
    }
  }

  /**
   * Pause and reset the audio current time programmatically
   */
  public stop() {
    audio.pause();
    audio.currentTime = 0;
    if (this.listeners.onStopped) {
      this.listeners.onStopped();
    }
  }

  /**
   * Set volume for player
   * @param volume percentage of volume (0 - 100)
   */
  public setVolume(volume: number) {
    if (volume > 100) {
      throw new Error('The volume must be from 0 - 100');
    }
    audio.volume = Math.floor(volume) / 100;
  }

  /**
   * Mute the player
   */
  public mute() {
    audio.volume = 0;
  }

  /**
   * Initialize controls and containers
   * @param option Options passed by the user
   */
  private init(option: IWavingOption) {
    this.root.classList.add('waving-container');
    // if the user set the option controls: false
    if (!this.option.controls) {
      this.root.classList.add('no-controls');
    }

    canvas = new Canvas(option);

    this.root.appendChild(canvas.render());
    // if the user disable default controls then we don't need to create them
    if (option.controls) {
      // initialize controls
      volumeBar = new VolumeBar(option);
      volumeBar.onChange(volume => {
        if (this.listeners.onVolumeChanged) {
          this.listeners.onVolumeChanged(volume);
        }
      });

      progressBar = new ProgressBar(option);

      startStopButton = new StartStopButton(option);
      startStopButton.onStart(() => {
        this.start();
      });
      startStopButton.onPause(() => {
        this.pause();
      });
      // append all controls into the main control container
      const controlContainer = document.createElement('div');
      controlContainer.className = 'control-container';

      controlContainer.appendChild(progressBar.render());
      controlContainer.appendChild(volumeBar.render());
      controlContainer.appendChild(startStopButton.render());
      this.root.appendChild(controlContainer);
    }
  }
}

export default Waving;
