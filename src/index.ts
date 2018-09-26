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
  stop();
  setVolume(volume: number);
  mute();
}

class Waving implements IWaving {
  private root: HTMLElement;
  private option: IWavingOption;
  private canvas: ICanvas;
  private progressBar: IProgressBar;
  private startStopButton: IStartStopButton;
  private volumeBar: IVolumeBar;
  private audio: HTMLAudioElement;
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

  public setAudio(src: string) {
    this.audio = this.audio || document.createElement('audio');
    this.stop();
    this.audio.src = src;
    this.audio.onloadeddata = () => {
      if (this.option.controls) {
        this.startStopButton.setAudio(this.audio);
        this.progressBar.setAudio(this.audio);
        this.volumeBar.setAudio(this.audio);
      }
      this.canvas.setAudio(this.audio);
      this.canvas.visualize();
      this.audio.onended = () => {
        if (this.option.controls) {
          this.startStopButton.stop();
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

  public start() {
    this.audio.play();
    if (this.listeners.onStart) {
      this.listeners.onStart();
    }
  }

  public stop() {
    this.audio.pause();
    if (this.listeners.onPaused) {
      this.listeners.onPaused();
    }
  }

  public setVolume(volume: number) {
    if (volume > 100) {
      throw new Error('The volume must be from 0 - 100');
    }
    this.audio.volume = Math.floor(volume) / 100;
  }

  public mute() {
    this.audio.volume = 0;
  }

  private init(option: IWavingOption) {
    this.root.classList.add('waving-container');
    if (!this.option.controls) {
      this.root.classList.add('no-controls');
    }

    this.canvas = new Canvas(option);

    if (option.controls) {
      this.volumeBar = new VolumeBar(option);
      this.progressBar = new ProgressBar(option);

      this.startStopButton = new StartStopButton(option);
      this.startStopButton.onStart(() => {
        this.start();
      });
      this.startStopButton.onStop(() => {
        this.stop();
      });
    }

    this.root.appendChild(this.canvas.render());
    if (option.controls) {
      const controlContainer = document.createElement('div');
      controlContainer.className = 'control-container';

      controlContainer.appendChild(this.progressBar.render());
      controlContainer.appendChild(this.volumeBar.render());
      controlContainer.appendChild(this.startStopButton.render());
      this.root.appendChild(controlContainer);
    }
  }
}

export default Waving;
