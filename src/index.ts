import './icons/style.css';
import Canvas, { ICanvas } from './init/canvas';
import ProgressBar, { IProgressBar } from './init/progressBar';
import StartStopButton, { IStartStopButton } from './init/startStopButton';
import VolumeBar, { IVolumeBar } from './init/volumeBar';
import './styles/container.sass';

interface IWavingOption {
  background?: string;
  width?: string;
  progress?: number;
  volume?: number;
}

class Waving {
  private root: HTMLElement;
  private option: IWavingOption;
  private canvas: ICanvas;
  private progressBar: IProgressBar;
  private startStopButton: IStartStopButton;
  private volumeBar: IVolumeBar;
  private background: string;
  private width: string;
  private audio: HTMLAudioElement;

  constructor(element: HTMLElement, option?: IWavingOption) {
    this.root = element;
    this.option = option || {};
    this.init(this.option);
  }

  public setAudio(src: string) {
    this.audio = document.createElement('audio');
    this.audio.src = src;
    this.progressBar.setAudio(this.audio);
    this.canvas.setAudio(this.audio);
    this.volumeBar.setAudio(this.audio);
    this.canvas.visualize();
    this.audio.onended = () => {
      this.startStopButton.stop();
    };
  }

  private init(option: IWavingOption) {
    this.background = option.background || 'transparent';
    this.width = option.width || '100%';

    this.root.classList.add('waving-container');

    this.volumeBar = new VolumeBar(option.volume);

    this.canvas = new Canvas();

    this.progressBar = new ProgressBar();

    this.startStopButton = new StartStopButton();
    this.startStopButton.onStart(() => {
      this.audio.play();
    });
    this.startStopButton.onStop(() => {
      this.audio.pause();
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
