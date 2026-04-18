import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

type Point = { x: number; y: number };
type GameState = 'IDLE' | 'PLAYING' | 'GAME_OVER';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

const GRID_SIZE = 20;
const CANVAS_SIZE = 400; // Fixed canvas size
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const SPEED_MS = 100;

export default function SnakeGame({ onScoreUpdate, gameState, setGameState }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // To avoid stale closures in the interval, use refs for mutable state accessed inside
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 15, y: 15 });
  const dirRef = useRef<Point>({ x: 0, y: 0 });
  const nextDirRef = useRef<Point>({ x: 0, y: 0 });
  const scoreRef = useRef(0);

  // For forcing renders when drawing needs an update (though we draw with refs mostly, maybe need to trigger on game over)
  const [, setTick] = useState(0); 

  const containerRef = useRef<HTMLDivElement>(null);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    foodRef.current = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    
    onScoreUpdate(0);
    setGameState('PLAYING');
    containerRef.current?.focus();
    drawBoard();
  }, [onScoreUpdate, setGameState]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (gameState === 'PLAYING') {
          e.preventDefault();
        }
      }

      if (gameState !== 'PLAYING') return;

      const dir = dirRef.current;
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y === 0) nextDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y === 0) nextDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x === 0) nextDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x === 0) nextDirRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') {
        drawBoard();
        return;
    }

    const moveSnake = () => {
      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const food = foodRef.current;
      
      // Update direction
      dirRef.current = nextDirRef.current;
      const dir = dirRef.current;
      
      head.x += dir.x;
      head.y += dir.y;

      // Collision with walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState('GAME_OVER');
        return;
      }

      // Collision with self
      for (let i = 0; i < currentSnake.length; i++) {
        if (head.x === currentSnake[i].x && head.y === currentSnake[i].y) {
          setGameState('GAME_OVER');
          return;
        }
      }

      currentSnake.unshift(head); // Add new head

      // Eat Food
      if (head.x === food.x && head.y === food.y) {
        scoreRef.current += 10;
        onScoreUpdate(scoreRef.current);
        
        // Generate new food
        let newFood;
        while (true) {
          newFood = { 
            x: Math.floor(Math.random() * GRID_SIZE), 
            y: Math.floor(Math.random() * GRID_SIZE) 
          };
          let onSnake = false;
          for (let segment of currentSnake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
              onSnake = true;
              break;
            }
          }
          if (!onSnake) break;
        }
        foodRef.current = newFood;
      } else {
        currentSnake.pop(); // Remove tail
      }

      snakeRef.current = currentSnake;
      drawBoard();
    };

    const interval = setInterval(moveSnake, SPEED_MS);
    return () => clearInterval(interval);
  }, [gameState, onScoreUpdate, setGameState]);

  // Drawing Logic
  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear board
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid 
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake
    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00f3ff';
      
      // Neon glow
      ctx.shadowBlur = index === 0 ? 12 : 8;
      ctx.shadowColor = index === 0 ? '#ffffff' : '#00f3ff';

      // Slight padding
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw Food
    const food = foodRef.current;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    
    ctx.beginPath();
    ctx.arc(food.x * CELL_SIZE + CELL_SIZE/2, food.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Clear shadow state
    ctx.shadowBlur = 0;
  }, []);

  // Initial draw
  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  return (
    <div 
      className="p-[10px] bg-[rgba(0,0,0,0.8)] border-4 border-[var(--color-accent-secondary)] shadow-[0_0_30px_var(--color-accent-secondary)] outline-none relative"
      ref={containerRef}
      tabIndex={-1} // Allow focus to capture key events without scrolling
    >
      <canvas 
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="w-full max-w-[min(100vw-32px,400px)] aspect-square relative z-10 block"
        style={{
           imageRendering: 'pixelated'
        }}
      />
      
      {/* Overlays for IDLE / GAME OVER */}
      {gameState !== 'PLAYING' && (
        <div className="absolute z-20 inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm border-2 border-[var(--color-accent)]">
          {gameState === 'IDLE' && (
            <div className="text-center">
              <button 
                onClick={resetGame}
                className="group relative px-6 py-3 font-bold text-black uppercase tracking-widest bg-[var(--color-accent)] rounded-sm hover:-translate-y-1 transition-transform"
              >
                <div className="absolute inset-0 bg-[var(--color-accent)] blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  <Play size={18} fill="currentColor" /> Initialize
                </span>
              </button>
            </div>
          )}
          {gameState === 'GAME_OVER' && (
            <div className="text-center flex flex-col items-center gap-4">
              <h2 className="text-3xl font-black italic text-[var(--color-accent-secondary)] drop-shadow-[0_0_10px_rgba(255,0,255,0.6)]">SYSTEM FAILURE</h2>
              <p className="text-[var(--color-text-dim)] text-sm tracking-widest uppercase mb-4">Signal Lost</p>
              <button 
                onClick={resetGame}
                className="group relative px-6 py-3 font-bold text-black uppercase tracking-widest bg-[var(--color-accent-secondary)] rounded-sm hover:-translate-y-1 transition-transform"
              >
                <div className="absolute inset-0 bg-[var(--color-accent-secondary)] blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  <RotateCcw size={18} /> Reboot Sequence
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
