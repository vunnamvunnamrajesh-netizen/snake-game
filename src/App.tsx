import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden p-2.5 bg-[var(--color-bg)] text-[var(--color-text)] font-sans screen-tear relative">
      <div className="static-noise"></div>
      <div className="scanline"></div>
      <div className="grid grid-cols-[280px_1fr_280px] grid-rows-[80px_1fr_120px] gap-[15px] h-full w-full border-jarring p-[10px] relative z-10">
        
        {/* Header */}
        <header className="col-span-3 flex items-center justify-between px-[20px] bg-[var(--color-card-bg)] border-2 border-[var(--color-accent-secondary)] rounded-none shadow-[0_0_15px_var(--color-accent-secondary)]">
          <div className="font-black text-[32px] tracking-[4px] text-[var(--color-accent)] uppercase glitch-text" data-text="NEON_SYNTH.exe">
            NEON_SYNTH.exe
          </div>
          <div className="flex gap-[20px] text-sm font-bold items-center">
            <span className="text-[var(--color-accent-secondary)]">● SYSTEM ACTIVE</span>
            <span className="text-[var(--color-text-dim)]">VER: 0.8.2-BETA</span>
          </div>
        </header>

        {/* Left Column: Queue Sidebar */}
        <aside className="bg-[var(--color-card-bg)] border-2 border-[var(--color-accent)] rounded-none p-[20px] flex flex-col gap-[20px] overflow-hidden">
          <h3 className="text-[12px] uppercase tracking-[2px] text-[var(--color-text-dim)] mb-[-10px]">Queue</h3>
          
          <div className="flex items-center gap-[12px] p-[10px] rounded-lg bg-[rgba(0,243,255,0.1)] border-l-[3px] border-[var(--color-accent)]">
            <div className="w-[36px] h-[36px] bg-[#222] rounded-[4px]"></div>
            <div>
              <div className="text-[14px]">Digital Pulse</div>
              <div className="text-[11px] text-[var(--color-text-dim)]">AI Synthwave</div>
            </div>
          </div>
          
          <div className="flex items-center gap-[12px] p-[10px] rounded-lg">
            <div className="w-[36px] h-[36px] bg-[#222] rounded-[4px]"></div>
            <div>
              <div className="text-[14px]">Neon Horizon</div>
              <div className="text-[11px] text-[var(--color-text-dim)]">Cyberfunk</div>
            </div>
          </div>

          <div className="flex items-center gap-[12px] p-[10px] rounded-lg">
            <div className="w-[36px] h-[36px] bg-[#222] rounded-[4px]"></div>
            <div>
              <div className="text-[14px]">Chrome Dreams</div>
              <div className="text-[11px] text-[var(--color-text-dim)]">Lo-fi Glitch</div>
            </div>
          </div>
        </aside>

        {/* Center Game Area */}
        <main className="flex items-center justify-center bg-[radial-gradient(circle_at_center,#111_0%,#000_100%)] rounded-none border-2 border-[var(--color-accent-secondary)] relative shadow-[0_0_20px_var(--color-accent)]">
          <SnakeGame 
            onScoreUpdate={handleScoreUpdate}
            gameState={gameState}
            setGameState={setGameState}
          />
        </main>

        {/* Right Column: Title & Stats */}
        <aside className="bg-[var(--color-card-bg)] border-2 border-[var(--color-accent)] rounded-none p-[20px] flex flex-col gap-[15px] overflow-hidden relative shadow-[-5px_0_15px_var(--color-accent)]">
          <h3 className="text-[12px] uppercase tracking-[2px] text-[var(--color-text-dim)]">Session Stats</h3>
          
          <div className="p-[15px] bg-[rgba(0,0,0,0.5)] border-l-4 border-[var(--color-accent-secondary)] shadow-[0_0_10px_var(--color-accent-secondary)]">
            <div className="text-[11px] text-[var(--color-text-dim)] uppercase">Current Score</div>
            <div className="text-[28px] font-extrabold font-mono text-[var(--color-accent-secondary)]">
              {score.toString().padStart(5, '0')}
            </div>
          </div>
          
          <div className="p-[15px] bg-[rgba(0,0,0,0.5)] border-l-4 border-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]">
            <div className="text-[11px] text-[var(--color-text-dim)] uppercase">High Score</div>
            <div className="text-[28px] font-extrabold font-mono text-[var(--color-accent)]">
              {highScore.toString().padStart(5, '0')}
            </div>
          </div>

          <div className="p-[15px] bg-[rgba(0,0,0,0.5)] border-l-4 border-[var(--color-text-dim)]">
            <div className="text-[11px] text-[var(--color-text-dim)] uppercase">Game Speed</div>
            <div className="text-[18px] text-[var(--color-text)] drop-shadow-none">
              1.25x
            </div>
          </div>

          <div className="absolute bottom-5 left-0 right-0 text-[10px] text-[var(--color-text-dim)] text-center uppercase tracking-widest mt-auto">
            Use Arrow Keys / WASD
          </div>
        </aside>

        {/* Footer: Music Player */}
        <footer className="col-span-3">
          <MusicPlayer />
        </footer>
        
      </div>
    </div>
  );
}
