import { IWavingOption } from '../common';
import volumeBarStructure from '../structures/volumeBar';
import '../styles/volume-bar.sass';
import { stringToNode } from '../util';

export interface IVolumeBar {
  render(): HTMLElement;
  setAudio(audio: HTMLAudioElement);
}

export default class VolumeBar implements IVolumeBar {
  private volumeBar: HTMLElement;
  private thumb: HTMLElement;
  private volumeLine: HTMLElement;
  private volumeLineSelected: HTMLElement;
  private percentage: number;
  private audio: HTMLAudioElement;
  private color: string;

  constructor(option: IWavingOption) {
    this.percentage = option.volume >= 0 ? option.volume : 50;
    this.color = option.color;
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
    const volumeTrackRight = volumeTrackRect.right;
    const volumeTrackLeft = volumeTrackRect.left;
    const mouseX = e.clientX;
    if (mouseX <= volumeTrackRight && mouseX >= volumeTrackLeft) {
      const percentage = ((mouseX - volumeTrackLeft) * 100) / volumnTrackWidth;
      this.percentage = percentage;
      this.audio.volume = Math.floor(percentage) / 100;
      this.update();
    }
  }

  private update() {
    if (!this.audio) {
      return;
    }
    this.volumeLineSelected.style.width = `${this.percentage}%`;
    this.thumb.style.left = `${this.percentage}%`;
  }
}
