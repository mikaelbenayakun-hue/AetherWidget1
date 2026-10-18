export type WidgetGridSize = '1x1' | '2x2' | '4x2' | '2x4' | '4x4' | '4x1';

export interface ColorFilterConfig {
  saturation: number;
  hueRotate: number;
  brightness: number;
  contrast: number;
  blur: number;
  sepia: number;
  invert: number;
  grayscale: number;
  rgbTint: {
    r: number;
    g: number;
    b: number;
    opacity: number;
  };
  presetName: string;
}

export interface WidgetStyleConfig {
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadow: 'none' | 'subtle' | 'glow' | 'deep';
  objectFit: 'cover' | 'contain' | 'fill';
  showBadge: boolean;
  widgetTitle: string;
  glassmorphism: boolean;
}

export type TargetFps = 15 | 24 | 30 | 60 | 0;

export interface PlaybackConfig {
  sound: boolean;
  volume: number;
  speed: number;
  fps: TargetFps;
  loop: boolean;
  isPlaying: boolean;
  videoUrl: string | null;
  videoName: string;
}

export interface BatteryConservationConfig {
  livelySuspendOnHidden: boolean;
  pauseOnScreenOff: boolean;
  batterySaverEcoFps: boolean;
  hardwareThrottling: boolean;
  simulatedPhoneSleeping: boolean;
  simulatedBatteryPct: number;
}
