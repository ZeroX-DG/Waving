import './icons/style.css';
import ProgressBar, { IProgressBar } from './init/progressBar';
import StartStopButton, { IStartStopButton } from './init/startStopButton';
import './styles/container.sass';

interface IWavingOption {
  background?: string;
  width?: string;
  bars?: number;
  progress?: number;
  volume?: number;
}

class Waving {
  private root: HTMLElement;
  private option: IWavingOption;
  private canvas: HTMLCanvasElement;
  private progressBar: IProgressBar;
  private startStopButton: IStartStopButton;
  private volume: number;
  private progress: number;
  private bars: number;
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
    this.audio.onended = () => {
      this.startStopButton.stop();
    };
  }

  private init(option) {
    this.background = option.background || 'transparent';
    this.width = option.width || '100%';
    this.bars = option.bars || this.root.clientWidth / 3;
    this.progress = option.progress || 0;
    this.volume = option.volume || 50;

    this.root.classList.add('waving-container');

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'waving-canvas';

    this.progressBar = new ProgressBar();
    this.root.appendChild(this.progressBar.render());

    this.startStopButton = new StartStopButton();
    this.startStopButton.onStart(() => {
      this.audio.play();
    });
    this.startStopButton.onStop(() => {
      this.audio.pause();
    });
    this.root.appendChild(this.startStopButton.render());
  }
}

export default Waving;
