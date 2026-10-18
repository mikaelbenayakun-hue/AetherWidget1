import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ColorFilterConfig, WidgetStyleConfig, PlaybackConfig, BatteryConservationConfig } from '../types/widget';
import { Upload, Volume2, VolumeX, Pause, Play, Sparkles } from 'lucide-react';

interface VideoWidgetRendererProps {
  playback: PlaybackConfig;
  colorConfig: ColorFilterConfig;
  styleConfig: WidgetStyleConfig;
  batteryConfig: BatteryConservationConfig;
  onUploadClick?: () => void;
  onTogglePlay?: () => void;
  aspectRatioClass?: string;
  isInteractive?: boolean;
  className?: string;
}

export const VideoWidgetRenderer: React.FC<VideoWidgetRendererProps> = ({
  playback,
  colorConfig,
  styleConfig,
  batteryConfig,
  onUploadClick,
  onTogglePlay,
  aspectRatioClass = 'aspect-square',
  isInteractive = true,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Lively power conservation
  const isSuspendedByPowerSaver =
    batteryConfig.simulatedPhoneSleeping ||
    (batteryConfig.livelySuspendOnHidden && isTabHidden);

  useEffect(() => {
    if (!batteryConfig.livelySuspendOnHidden) {
      setIsTabHidden(false);
      return;
    }

    const handleVisibilityChange = () => setIsTabHidden(document.hidden);
    const handleBlur = () => setIsTabHidden(true);
    const handleFocus = () => setIsTabHidden(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [batteryConfig.livelySuspendOnHidden]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !playback.sound;
    video.volume = playback.sound ? playback.volume : 0;
    video.playbackRate = playback.speed;
    video.loop = playback.loop;

    if (isSuspendedByPowerSaver || !playback.isPlaying) {
      video.pause();
    } else if (playback.videoUrl && isVideoLoaded) {
      video.play().catch(() => {});
    }
  }, [playback, isSuspendedByPowerSaver, isVideoLoaded]);

  const useCanvasRendering = playback.fps > 0;

  const renderLoop = useCallback(
    (timestamp: number) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || isSuspendedByPowerSaver || !playback.isPlaying) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const targetFps = playback.fps;
      const frameInterval = 1000 / targetFps;
      const elapsed = timestamp - lastFrameTimeRef.current;

      if (elapsed >= frameInterval) {
        lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);

        if (video.readyState >= 2 && video.videoWidth > 0) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    },
    [playback.fps, playback.isPlaying, isSuspendedByPowerSaver]
  );

  useEffect(() => {
    if (useCanvasRendering && playback.videoUrl && !isSuspendedByPowerSaver) {
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
      return () => {
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      };
    }
  }, [useCanvasRendering, playback.videoUrl, isSuspendedByPowerSaver, renderLoop]);

  const cssFilter = `
    saturate(${colorConfig.saturation}%)
    hue-rotate(${colorConfig.hueRotate}deg)
    brightness(${colorConfig.brightness}%)
    contrast(${colorConfig.contrast}%)
    blur(${colorConfig.blur}px)
    sepia(${colorConfig.sepia}%)
    invert(${colorConfig.invert}%)
    grayscale(${colorConfig.grayscale}%)
  `.trim();

  // Blank widget state when stopped
  if (!playback.videoUrl) {
    return (
      <div
        onClick={onUploadClick}
        style={{
          borderRadius: `${styleConfig.borderRadius}px`,
          borderWidth: `${styleConfig.borderWidth}px`,
          borderColor: styleConfig.borderColor,
        }}
        className={`relative group cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 bg-zinc-900/90 border border-zinc-800 ${aspectRatioClass} ${className}`}
      >
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
            <Upload className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-zinc-200">Upload Video</h4>
            <p className="text-xs text-zinc-500 mt-0.5">Tap to select MP4, WebM, or MOV</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: `${styleConfig.borderRadius}px`,
        borderWidth: `${styleConfig.borderWidth}px`,
        borderColor: styleConfig.borderColor,
      }}
      className={`relative group overflow-hidden select-none bg-black ${aspectRatioClass} ${className}`}
    >
      <video
        ref={videoRef}
        src={playback.videoUrl}
        crossOrigin="anonymous"
        playsInline
        autoPlay
        muted={!playback.sound}
        loop={playback.loop}
        onLoadedData={() => setIsVideoLoaded(true)}
        className={`w-full h-full object-${styleConfig.objectFit} ${useCanvasRendering ? 'hidden' : 'block'}`}
        style={{ filter: cssFilter }}
      />

      {useCanvasRendering && (
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-${styleConfig.objectFit}`}
          style={{ filter: cssFilter }}
        />
      )}

      {colorConfig.rgbTint.opacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color"
          style={{
            backgroundColor: `rgba(${colorConfig.rgbTint.r}, ${colorConfig.rgbTint.g}, ${colorConfig.rgbTint.b}, ${colorConfig.rgbTint.opacity})`,
          }}
        />
      )}

      {isSuspendedByPowerSaver && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-3 z-20">
          <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-emerald-300">Lively Sleep Active</span>
        </div>
      )}
    </div>
  );
};
