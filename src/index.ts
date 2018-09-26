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

  public setAudio(src: string) {
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
          startStopButton.stop();
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
    audio.play();
    if (this.listeners.onStart) {
      this.listeners.onStart();
    }
  }

  public stop() {
    audio.pause();
    if (this.listeners.onPaused) {
      this.listeners.onPaused();
    }
  }

  public setVolume(volume: number) {
    if (volume > 100) {
      throw new Error('The volume must be from 0 - 100');
    }
    audio.volume = Math.floor(volume) / 100;
  }

  public mute() {
    audio.volume = 0;
  }

  private init(option: IWavingOption) {
    this.root.classList.add('waving-container');
    if (!this.option.controls) {
      this.root.classList.add('no-controls');
    }

    canvas = new Canvas(option);

    if (option.controls) {
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
      startStopButton.onStop(() => {
        this.stop();
      });
    }

    this.root.appendChild(canvas.render());
    if (option.controls) {
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
