import React, { useState, useRef } from 'react';
import { VideoWidgetRenderer } from './components/VideoWidgetRenderer';
import { WidgetGridSize, ColorFilterConfig, WidgetStyleConfig, PlaybackConfig, BatteryConservationConfig } from './types/widget';
import { Upload, Square, Volume2, VolumeX, Gauge, Trash2, Sliders, Battery } from 'lucide-react';

const INITIAL_CONFIG = {
  "size": "2x2",
  "colorConfig": {
    "saturation": 110,
    "hueRotate": 0,
    "brightness": 100,
    "contrast": 105,
    "blur": 0,
    "sepia": 0,
    "invert": 0,
    "grayscale": 0,
    "rgbTint": {
      "r": 6,
      "g": 182,
      "b": 212,
      "opacity": 0
    },
    "presetName": "original"
  },
  "styleConfig": {
    "borderRadius": 24,
    "borderWidth": 1,
    "borderColor": "rgba(255, 255, 255, 0.12)",
    "shadow": "subtle",
    "objectFit": "cover",
    "showBadge": true,
    "widgetTitle": "Live Widget",
    "glassmorphism": true
  },
  "playback": {
    "sound": false,
    "volume": 0.8,
    "speed": 1,
    "fps": 30,
    "loop": true,
    "isPlaying": true,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "videoName": "Neon Cyber Grid"
  },
  "batteryConfig": {
    "livelySuspendOnHidden": true,
    "pauseOnScreenOff": true,
    "batterySaverEcoFps": true,
    "hardwareThrottling": true,
    "simulatedPhoneSleeping": false,
    "simulatedBatteryPct": 88
  }
};

export default function App() {
  const [size, setSize] = useState<WidgetGridSize>(INITIAL_CONFIG.size);
  const [playback, setPlayback] = useState<PlaybackConfig>(INITIAL_CONFIG.playback);
  const [colorConfig, setColorConfig] = useState<ColorFilterConfig>(INITIAL_CONFIG.colorConfig);
  const [styleConfig, setStyleConfig] = useState<WidgetStyleConfig>(INITIAL_CONFIG.styleConfig);
  const [batteryConfig, setBatteryConfig] = useState<BatteryConservationConfig>(INITIAL_CONFIG.batteryConfig);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPlayback((prev) => ({
        ...prev,
        videoUrl: url,
        videoName: file.name,
        isPlaying: true,
      }));
    }
  };

  const handleStopVideo = () => {
    setPlayback((prev) => ({
      ...prev,
      videoUrl: null,
      videoName: 'Blank Widget',
      isPlaying: false,
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Widget Display Area */}
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="w-full mb-3 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold text-zinc-200">AetherWidget</span>
          <span className="text-cyan-400 font-mono">{size} Matrix · {playback.fps === 0 ? 'Native' : playback.fps + ' FPS'}</span>
        </div>

        <div className="w-full shadow-2xl">
          <VideoWidgetRenderer
            playback={playback}
            colorConfig={colorConfig}
            styleConfig={styleConfig}
            batteryConfig={batteryConfig}
            onUploadClick={() => fileInputRef.current?.click()}
            aspectRatioClass={
              size === '4x2' ? 'aspect-[2/1]' :
              size === '2x4' ? 'aspect-[1/2]' :
              size === '4x1' ? 'aspect-[4/1]' :
              'aspect-square'
            }
          />
        </div>

        {/* Quick Mobile Controls */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-zinc-950 hover:bg-cyan-400"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Video</span>
            </button>

            {playback.videoUrl && (
              <button
                onClick={handleStopVideo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Stop Video</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs text-zinc-400">
            <span>FPS Target:</span>
            <div className="flex gap-1">
              {[15, 30, 60].map((fps) => (
                <button
                  key={fps}
                  onClick={() => setPlayback((prev) => ({ ...prev, fps: fps as any }))}
                  className={`px-2 py-0.5 rounded text-[11px] ${playback.fps === fps ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  {fps}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
