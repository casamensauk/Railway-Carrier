import { useEffect, useRef, useState } from 'react';
import { AudioEngine } from '@/audio/engine';
import { useCarrierStore } from '@/store/useCarrierStore';

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);
  if (engineRef.current === null) {
    engineRef.current = new AudioEngine();
  }
  const engine = engineRef.current;

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frequency = useCarrierStore((s) => s.frequency);
  const depth = useCarrierStore((s) => s.depth);
  const volume = useCarrierStore((s) => s.volume);
  const source = useCarrierStore((s) => s.source);

  useEffect(() => {
    if (isPlaying) engine.setFrequency(frequency);
  }, [engine, frequency, isPlaying]);

  useEffect(() => {
    if (isPlaying) engine.setDepth(depth);
  }, [engine, depth, isPlaying]);

  useEffect(() => {
    if (isPlaying) engine.setVolume(volume);
  }, [engine, volume, isPlaying]);

  useEffect(() => {
    return () => {
      void engine.stop({ fade: false });
    };
  }, [engine]);

  const start = async () => {
    setError(null);
    try {
      if (source === 'upload' && !engine.hasUpload()) {
        throw new Error('Upload an audio file first.');
      }
      await engine.start(source, { frequency, depth, volume });
      setIsPlaying(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not start audio.';
      setError(message);
      setIsPlaying(false);
    }
  };

  const stop = async (options: { fade?: boolean } = { fade: true }) => {
    await engine.stop(options);
    setIsPlaying(false);
  };

  const loadFile = async (file: File) => {
    setError(null);
    try {
      await engine.loadFile(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not decode that file.';
      setError(message);
      throw err;
    }
  };

  return { isPlaying, error, start, stop, loadFile, hasUpload: () => engine.hasUpload() };
}
