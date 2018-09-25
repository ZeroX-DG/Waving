export interface IVisualCanvasColor {
  stop: number;
  color: string;
}

export interface IWavingOption {
  controlsColor?: string;
  volume?: number;
  visualCanvasColor?: IVisualCanvasColor[];
  autoStart?: boolean;
  controls?: boolean;
}

export interface IWavingEvents {
  onStart?: () => void;
  onEnded?: () => void;
  onPaused?: () => void;
}
