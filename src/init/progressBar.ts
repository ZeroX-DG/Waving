import progressBarStructure from '../structures/progressBar';
import '../styles/progress-bar.sass';
import { stringToNode } from '../util';

export interface IProgressBar {
  render(): HTMLElement;
  setAudio(audio: HTMLAudioElement);
}

export default class ProgressBar implements IProgressBar {
  private progressBar: HTMLElement;
  private thumb: HTMLElement;
  private progressLine: HTMLElement;
  private progressPlayedLine: HTMLElement;
  private duration: number;
  private percentage: number;
  private currentDuration: number;
  private audio: HTMLAudioElement;

  public render(): HTMLElement {
    this.progressBar = stringToNode(progressBarStructure);
    this.thumb = this.progressBar.querySelector('.thumb');
    this.progressLine = this.progressBar.querySelector('.progress-line');
    this.progressPlayedLine = this.progressBar.querySelector(
      '.progress-line--played'
    );

    this.initMouseEvent();

    return this.progressBar;
  }

  public setAudio(audio: HTMLAudioElement) {
    this.audio = audio;
    this.audio.onloadeddata = () => {
      this.duration = this.audio.duration;
      this.percentage = 0;
      this.currentDuration = 0;
      this.update();
      this.trackProgress();
    };
  }

  private initMouseEvent() {
    const self = this;
    this.thumb.addEventListener('mousedown', ev => {
      ev.preventDefault();
      window.addEventListener('mousemove', dragThumb);
      window.addEventListener('mouseup', stopDragThumb);

      function dragThumb(e) {
        self.onProgressBarThumbDrag(e);
      }

      function stopDragThumb() {
        window.removeEventListener('mousemove', dragThumb);
      }
    });
    this.progressLine.addEventListener('mousedown', ev => {
      this.onProgressBarThumbDrag(ev);
    });

    this.progressPlayedLine.addEventListener('mousedown', ev => {
      this.onProgressBarThumbDrag(ev);
    });
  }

  private onProgressBarThumbDrag(e) {
    e.stopPropagation();
    const progressBarRect = this.progressLine.getBoundingClientRect();
    const progressBarLeft = progressBarRect.left;
    const progressBarRight = progressBarRect.right;
    const progressBarWidth = this.progressLine.offsetWidth;
    const songDuration = this.duration;
    if (e.clientX <= progressBarRight && e.clientX >= progressBarLeft) {
      const playedDuration =
        ((e.clientX - progressBarLeft) / progressBarWidth) * songDuration;
      const playedPercentage = (playedDuration * 100) / songDuration;
      this.percentage = playedPercentage;
      this.currentDuration = playedDuration;
      this.audio.currentTime = this.currentDuration;
      this.update();
    }
  }

  private trackProgress() {
    if (!this.audio) {
      return;
    }
    this.audio.ontimeupdate = () => {
      const newPercentage = (this.audio.currentTime * 100) / this.duration;
      this.percentage = newPercentage;
      this.update();
    };
  }

  private update() {
    if (!this.audio) {
      return;
    }
    this.progressPlayedLine.style.width = `${this.percentage}%`;
    this.thumb.style.left = `${this.percentage}%`;
  }
}
