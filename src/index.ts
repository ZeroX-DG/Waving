import { IWavingOption, IWavingEvents } from './common';
import './icons/style.css';
import Canvas, { ICanvas } from './init/canvas';
import ProgressBar, { IProgressBar } from './init/progressBar';
import StartStopButton, { IStartStopButton } from './init/startStopButton';
import VolumeBar, { IVolumeBar } from './init/volumeBar';
import './styles/container.sass';

interface IWaving {
  setAudio(audio: string): void;
  start(): void;
  pause(): void;
  stop(): void;
  setVolume(volume: number): void;
  mute(): void;
}

class WavingCore {
  private root: HTMLElement;
  private option: IWavingOption;
  private listeners: IWavingEvents;
  private canvas: ICanvas;
  private progressBar: IProgressBar;
  private startStopButton: IStartStopButton;
  private volumeBar: IVolumeBar;
  private audio: HTMLAudioElement;

  constructor(
    element: HTMLElement,
    option?: IWavingOption,
    events?: IWavingEvents
  ) {
    this.root = element;
    this.option = option || {};
    this.listeners = events || {};

    // default to show controls and canvas
    if (this.option.controls === undefined) {
      this.option.controls = true;
    }
    if (this.option.canvas === undefined) {
      this.option.canvas = true;
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

    this.audio = this.audio || document.createElement('audio');
    this.audio.src = src;
    this.audio.crossOrigin = this.option.crossOrigin;
    this.audio.onloadeddata = () => {
      if (this.option.controls) {
        this.startStopButton.setAudio(this.audio);
        this.progressBar.setAudio(this.audio);
        this.volumeBar.setAudio(this.audio);
      }
      if (this.option.canvas) {
        this.canvas.setAudio(this.audio);
        this.canvas.visualize();
      }
      this.audio.onended = () => {
        if (this.option.controls) {
          this.startStopButton.pause();
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
    this.audio.play();
    if (this.listeners.onStart) {
      this.listeners.onStart();
    }
  }

  /**
   * Pause the player programmatically
   */
  public pause() {
    this.audio.pause();
    if (this.listeners.onPaused) {
      this.listeners.onPaused();
    }
  }

  /**
   * Pause and reset the audio current time programmatically
   */
  public stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
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
    this.audio.volume = Math.floor(volume) / 100;
  }

  /**
   * Mute the player
   */
  public mute() {
    this.audio.volume = 0;
  }

  /**
   * Set the audio crossOrigin
   * @param crossOrigin the crossOrigin to set for the audio
   */
  public setCrossOrigin(crossOrigin: string) {
    if (typeof crossOrigin !== 'string') {
      throw new Error('The crossOrigin must be a string');
    }
    this.audio.crossOrigin = crossOrigin;
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
    if (!this.option.canvas) {
      this.root.classList.add('no-canvas');
    }

    // if user disable canvas
    if (option.canvas) {
      this.canvas = new Canvas(option);
      this.root.appendChild(this.canvas.render());
    }
    // if the user disable default controls then we don't need to create them
    if (option.controls) {
      // initialize controls
      this.volumeBar = new VolumeBar(option);
      this.volumeBar.onChange(volume => {
        if (this.listeners.onVolumeChanged) {
          this.listeners.onVolumeChanged(volume);
        }
      });

      this.progressBar = new ProgressBar(option);

      this.startStopButton = new StartStopButton(option);
      this.startStopButton.onStart(() => {
        this.start();
      });
      this.startStopButton.onPause(() => {
        this.pause();
      });
      // append all controls into the main control container
      const controlContainer = document.createElement('div');
      controlContainer.className = 'control-container';

      controlContainer.appendChild(this.progressBar.render());
      controlContainer.appendChild(this.volumeBar.render());
      controlContainer.appendChild(this.startStopButton.render());
      this.root.appendChild(controlContainer);
    }
  }
}

export default class Waving implements IWaving {
  public start: () => void;
  public stop: () => void;
  public pause: () => void;
  public mute: () => void;
  public setAudio: (src: string) => void;
  public setVolume: (volume: number) => void;
  constructor(el, options?, events?) {
    const instance: WavingCore = new WavingCore(el, options, events);
    this.start = () => instance.start();
    this.stop = () => instance.stop();
    this.pause = () => instance.pause();
    this.setAudio = (src: string) => instance.setAudio(src);
    this.setVolume = (volume: number) => instance.setVolume(volume);
    this.mute = () => instance.mute();
  }
}
