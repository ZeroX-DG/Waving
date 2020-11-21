export interface IVisualCanvasColor {
  stop: number;
  color: string;
}

export interface IWavingOption {
  crossOrigin?: string;
  controlsColor?: string;
  volume?: number;
  visualCanvasColor?: IVisualCanvasColor[];
  autoStart?: boolean;
  controls?: boolean;
  canvas?: boolean;
}

export interface IWavingEvents {
  onStart?: () => void;
  onEnded?: () => void;
  onStopped?: () => void;
  onPaused?: () => void;
  onVolumeChanged?: (volume: number) => void;
}

export const classList = {
  volumeBar: {
    container: 'waving-player__volume-bar',
    thumb: 'thumb',
    volumeLine: 'volume-line',
    volumeSelectedLine: 'volume-line--selected'
  },
  progressBar: {
    container: 'waving-player__progress-bar',
    thumb: 'thumb',
    progressLine: 'progress-line',
    porgressPlayedLine: 'progress-line--played'
  },
  startStopButton: {
    container: 'waving-player__start-stop-button'
  },
  canvas: {
    container: 'waving-canvas'
  }
};
