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
    this.init(this.option);
  }

  public setAudio(src: string) {
    this.audio = this.audio || document.createElement('audio');
    this.startStopButton.stop();
    this.audio.src = src;
    this.audio.onloadeddata = () => {
      this.progressBar.setAudio(this.audio);
      this.canvas.setAudio(this.audio);
      this.volumeBar.setAudio(this.audio);
      this.canvas.visualize();
      this.audio.onended = () => {
        this.startStopButton.stop();
        if (this.listeners.onEnded) {
          this.listeners.onEnded();
        }
      };
      if (this.option.autoStart) {
        this.startStopButton.start();
      }
    };
  }

  public start() {
    this.startStopButton.start();
  }

  public stop() {
    this.startStopButton.stop();
  }

  private init(option: IWavingOption) {
    this.root.classList.add('waving-container');
    if (option.width) {
      this.root.style.width = option.width;
    }

    this.volumeBar = new VolumeBar(option);

    this.canvas = new Canvas(option);

    this.progressBar = new ProgressBar(option);

    this.startStopButton = new StartStopButton(option);
    this.startStopButton.onStart(() => {
      this.audio.play();
      if (this.listeners.onStart) {
        this.listeners.onStart();
      }
    });
    this.startStopButton.onStop(() => {
      this.audio.pause();
      if (this.listeners.onPaused) {
        this.listeners.onPaused();
      }
    });

    const controlContainer = document.createElement('div');
    controlContainer.className = 'control-container';

    controlContainer.appendChild(this.progressBar.render());
    controlContainer.appendChild(this.startStopButton.render());
    controlContainer.appendChild(this.volumeBar.render());
    this.root.appendChild(this.canvas.render());
    this.root.appendChild(controlContainer);
  }
}

export default Waving;
