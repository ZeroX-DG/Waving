export interface IVisualCanvasColor {
  stop: number;
  color: string;
}

export interface IWavingOption {
  color?: string;
  width?: string;
  volume?: number;
  visualCanvasColor?: IVisualCanvasColor[];
}
