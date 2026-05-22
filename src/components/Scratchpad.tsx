import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Trash, Paintbrush, Square, Download } from 'lucide-react';

interface ScratchpadProps {
  onClose: () => void;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#f43f5e'); // Default to Rose 500
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(3);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Preset Colors
  const COLORS = [
    { label: 'Rose', value: '#f43f5e' },
    { label: 'Indigo', value: '#6366f1' },
    { label: 'Green', value: '#10b981' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'White', value: '#ffffff' }
  ];

  // Adjust canvas size to fit its container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Initial canvas setup
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Fill background with deep charcoal for a clean blackboard effect
    ctx.fillStyle = '#1e293b'; // Slate 800
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  // Update context settings whenever color, eraser, or brushSize changes
  const setupContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = isEraser ? '#1e293b' : color;
    ctx.lineWidth = isEraser ? brushSize * 4 : brushSize;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setupContext();

    // Get exact cursor coordinate
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent scrolling on touch screens when drawing
    if (e.cancelable) e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  // Drag Scratchboard Modal handles
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className="fixed bottom-10 left-10 z-[99] w-[420px] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 text-white select-none transition-shadow"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header bar holds Drag anchor */}
      <div 
        className="flex items-center justify-between cursor-move pb-2 border-b border-indigo-500/10 mb-3"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Paintbrush size={15} className="text-indigo-400 animate-pulse" />
          <span className="font-display text-sm font-bold tracking-wide">BẢNG NHÁP THI</span>
          <span className="text-[10px] text-slate-500 font-mono">Dành cho học sinh vẽ</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
          <X size={15} />
        </button>
      </div>

      {/* Drawing Canvas Board */}
      <div className="w-full h-64 rounded-lg overflow-hidden border border-slate-800 mb-3 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair block bg-slate-800"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Control Panels */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-850 p-2.5 rounded-lg border border-slate-800">
        
        {/* Colors selector */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setColor(c.value);
                setIsEraser(false);
              }}
              style={{ backgroundColor: c.value }}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                !isEraser && color === c.value
                  ? 'border-white scale-115 shadow-md shadow-white/10'
                  : 'border-transparent hover:scale-105'
              }`}
              title={c.label}
            />
          ))}
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Eraser */}
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-1.5 rounded-md border text-xs font-semibold flex items-center gap-1 transition-colors ${
              isEraser 
                ? 'bg-rose-500 text-white border-rose-400' 
                : 'bg-slate-800 text-slate-300 border-slate-750 hover:bg-slate-750'
            }`}
            title="Tẩy nét vẽ"
          >
            <Eraser size={14} />
            Tẩy
          </button>

          {/* Reset Clear */}
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-md bg-slate-800 border border-slate-750 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Xóa toàn bộ"
          >
            <Trash size={14} />
            Xóa hết
          </button>
        </div>

        {/* Brush size slider */}
        <div className="flex items-center gap-2 w-full mt-1 border-t border-slate-800 pt-2 text-xs text-slate-400">
          <span className="shrink-0">Cỡ nét: {brushSize}px</span>
          <input
            type="range"
            min="1"
            max="12"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full accent-rose-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
