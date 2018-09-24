import { IWavingOption } from './common';
import './icons/style.css';
import Canvas, { ICanvas } from './init/canvas';
import ProgressBar, { IProgressBar } from './init/progressBar';
import StartStopButton, { IStartStopButton } from './init/startStopButton';
import VolumeBar, { IVolumeBar } from './init/volumeBar';
import './styles/container.sass';

class Waving {
  private root: HTMLElement;
  private option: IWavingOption;
  private canvas: ICanvas;
  private progressBar: IProgressBar;
  private startStopButton: IStartStopButton;
  private volumeBar: IVolumeBar;
  private audio: HTMLAudioElement;

  constructor(element: HTMLElement, option?: IWavingOption) {
    this.root = element;
    this.option = option || {};
    this.init(this.option);
  }

  public setAudio(src: string) {
    this.audio = document.createElement('audio');
    this.audio.src = src;
    this.audio.onloadeddata = () => {
      this.progressBar.setAudio(this.audio);
      this.canvas.setAudio(this.audio);
      this.volumeBar.setAudio(this.audio);
      this.canvas.visualize();
      this.audio.onended = () => {
        this.startStopButton.stop();
      };
    };
  }

  private init(option: IWavingOption) {
    this.root.classList.add('waving-container');

    this.volumeBar = new VolumeBar(option);

    this.canvas = new Canvas(option);

    this.progressBar = new ProgressBar(option);

    this.startStopButton = new StartStopButton(option);
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
