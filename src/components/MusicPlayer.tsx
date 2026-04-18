import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';

const tracks = [
  { id: 1, title: 'Neon Serpent Sequence', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Grooves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Matrix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = tracks[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Playback failed", error);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => console.error("Playback failed", error));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-[var(--color-card-bg)] border-2 border-[var(--color-accent)] shadow-[0_0_15px_var(--color-accent-secondary)] flex items-center px-[30px] gap-[40px] text-[var(--color-text)] relative">
      
      <audio 
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Track Info */}
      <div className="flex gap-[15px] items-center w-[250px] shrink-0">
        <div className="w-[60px] h-[60px] bg-gradient-to-tr from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center overflow-hidden border-2 border-white/20">
           {isPlaying && <Disc3 className="animate-spin text-white/50" size={32} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[16px] truncate">{track.title}</div>
          <div className="text-[13px] text-[var(--color-text-dim)] truncate">NEURAL SQUAD</div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-[20px] items-center shrink-0">
        <button onClick={prevTrack} className="w-[40px] h-[40px] rounded-full border border-[var(--color-border)] flex items-center justify-center bg-[rgba(255,255,255,0.05)] hover:bg-white/10 transition-colors">
          <SkipBack size={16} fill="currentColor" />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-[54px] h-[54px] bg-[var(--color-accent)] rounded-full border-none text-black flex items-center justify-center hover:scale-105 transition-transform drop-shadow-[0_0_10px_var(--color-accent)]"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="w-[40px] h-[40px] rounded-full border border-[var(--color-border)] flex items-center justify-center bg-[rgba(255,255,255,0.05)] hover:bg-white/10 transition-colors">
          <SkipForward size={16} fill="currentColor" />
        </button>
      </div>

      {/* Playback Bar */}
      <div className="flex-1 flex flex-col gap-[8px]">
        <div className="h-[4px] bg-[#222] rounded-[2px] relative">
          <div 
            className="h-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)] rounded-[2px] absolute left-0 top-0 transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-[var(--color-text-dim)]">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-[10px] text-[var(--color-text-dim)] shrink-0">
        <button onClick={toggleMute} className="hover:text-[var(--color-text)] transition-colors p-2">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="w-[80px] h-[3px] bg-[#333] rounded-[2px] overflow-hidden">
          <div className="w-[70%] h-full bg-[var(--color-text-dim)]"></div>
        </div>
      </div>

    </div>
  );
}
