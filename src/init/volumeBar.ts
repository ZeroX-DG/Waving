import { IWavingOption } from '../common';
import volumeBarStructure from '../structures/volumeBar';
import '../styles/volume-bar.sass';
import { stringToNode } from '../util';

export interface IVolumeBar {
  render(): HTMLElement;
  setAudio(audio: HTMLAudioElement);
  onChange(fn: (volume: number) => void);
}

export default class VolumeBar implements IVolumeBar {
  private volumeBar: HTMLElement;
  private thumb: HTMLElement;
  private volumeLine: HTMLElement;
  private volumeLineSelected: HTMLElement;
  private percentage: number;
  private audio: HTMLAudioElement;
  private color: string;
  private volumeChangeCallback: (volume: number) => void;

  constructor(option: IWavingOption) {
    this.percentage = option.volume >= 0 ? option.volume : 50;
    this.color = option.controlsColor;
  }

  public render(): HTMLElement {
    this.volumeBar = stringToNode(volumeBarStructure);
    this.thumb = this.volumeBar.querySelector('.thumb');
    this.volumeLine = this.volumeBar.querySelector('.volume-line');
    this.volumeLineSelected = this.volumeBar.querySelector(
      '.volume-line--selected'
    );

    this.initInterface();

    this.initMouseEvent();

    return this.volumeBar;
  }

  public setAudio(audio: HTMLAudioElement) {
    this.audio = audio;
    this.audio.volume = Math.floor(this.percentage) / 100;
    this.update();
    this.trackVolume();
  }

  public onChange(fn: (volume: number) => void) {
    this.volumeChangeCallback = fn;
  }

  private trackVolume() {
    let isFirstTime = true;
    this.audio.onvolumechange = () => {
      if (isFirstTime) {
        isFirstTime = false;
        return;
      }
      this.percentage = this.audio.volume * 100;
      this.update();
      if (this.volumeChangeCallback) {
        this.volumeChangeCallback(this.percentage);
      }
    };
  }

  private initInterface() {
    if (this.color) {
      this.volumeLineSelected.style.background = this.color;
      this.thumb.style.background = this.color;
    }
  }

  private initMouseEvent() {
    const self = this;
    this.thumb.addEventListener('mousedown', ev => {
      ev.preventDefault();
      window.addEventListener('mousemove', dragThumb);
      window.addEventListener('mouseup', stopDragThumb);

      function dragThumb(e) {
        self.onvolumeThumbDrag(e);
      }

      function stopDragThumb() {
        window.removeEventListener('mousemove', dragThumb);
      }
    });
    this.volumeLine.addEventListener('mousedown', ev => {
      this.onvolumeThumbDrag(ev);
    });

    this.volumeLineSelected.addEventListener('mousedown', ev => {
      this.onvolumeThumbDrag(ev);
    });
  }

  private onvolumeThumbDrag(e: MouseEvent) {
    const volumeTrackRect = this.volumeBar.getBoundingClientRect();
    const volumnTrackWidth = volumeTrackRect.width;
    const volumeTrackLeft = volumeTrackRect.left;
    const mouseX = e.clientX;
    let percentage = Math.floor(
      ((mouseX - volumeTrackLeft) * 100) / volumnTrackWidth
    );
    if (percentage < 0) {
      percentage = 0;
    } else if (percentage > 100) {
      percentage = 100;
    }
    this.percentage = percentage;
    this.audio.volume = percentage / 100;
    this.update();
  }

  private update() {
    if (!this.audio) {
      return;
    }
    this.volumeLineSelected.style.width = `${this.percentage}%`;
    this.thumb.style.left = `${this.percentage}%`;
  }
}
