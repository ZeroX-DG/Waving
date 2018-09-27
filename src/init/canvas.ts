import canvasStructure from '../structures/canvas';
import '../styles/canvas.sass';
import { map, stringToNode } from '../util';
import { IWavingOption, IVisualCanvasColor } from '../common';

export interface ICanvas {
  render(): HTMLElement;
  setAudio(audio: HTMLAudioElement);
  visualize();
}

export default class Canvas implements ICanvas {
  private canvas: HTMLCanvasElement;
  private mediaElements: WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>;
  private audioContext: AudioContext;
  private source: MediaElementAudioSourceNode;
  private analyser: AnalyserNode;
  private visualCanvasColor: IVisualCanvasColor[];
  private animation: any;

  constructor(option: IWavingOption) {
    this.mediaElements = new WeakMap();
    this.visualCanvasColor = option.visualCanvasColor;
  }

  /**
   * @return {HTMLElement} canvas after created from string
   */
  public render(): HTMLElement {
    this.canvas = stringToNode(canvasStructure) as HTMLCanvasElement;
    return this.canvas as HTMLElement;
  }

  /**
   * Set the audio element to interact
   * @param audio audio element to interact
   */
  public setAudio(audio: HTMLAudioElement) {
    // only use 1 audio context
    this.audioContext = this.audioContext || new AudioContext();
    // remember the sources
    if (!this.mediaElements.has(audio)) {
      this.source = this.audioContext.createMediaElementSource(audio);
      this.mediaElements.set(audio, this.source);
    } else {
      this.source = this.mediaElements.get(audio);
    }
    this.analyser = this.audioContext.createAnalyser();
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  /**
   * Start the visualization of the audio
   */
  public visualize() {
    const ctx = this.canvas.getContext('2d');
    const drawBars = () => {
      window.cancelAnimationFrame(this.animation);
      this.animation = window.requestAnimationFrame(drawBars);
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
      const frequencyBinCounts = new Uint8Array(
        this.analyser.frequencyBinCount
      );
      this.analyser.getByteFrequencyData(frequencyBinCounts);
      // clear this.canvas for re-draw
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      if (this.visualCanvasColor) {
        for (const color of this.visualCanvasColor) {
          gradient.addColorStop(color.stop, color.color);
        }
      } else {
        // default gradient color
        gradient.addColorStop(0, '#EA2027');
        gradient.addColorStop(0.8, '#ff8c8c');
        gradient.addColorStop(1, '#ffefef');
      }
      ctx.fillStyle = gradient;
      const bars = this.canvas.width / 2;
      for (let i = 0; i < bars; i++) {
        const barHeight = -map(frequencyBinCounts[i], 0, 255, 5, 60);
        const barWidth = 2;
        ctx.fillRect(
          i * (barWidth + 1),
          this.canvas.height,
          barWidth,
          barHeight
        );
      }
    };

    drawBars();
  }
}
