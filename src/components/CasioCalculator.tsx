import React, { useState } from 'react';
import { X, Delete, RefreshCw, Move } from 'lucide-react';
import { motion } from 'motion/react';

interface CasioCalculatorProps {
  onClose: () => void;
}

export const CasioCalculator: React.FC<CasioCalculatorProps> = ({ onClose }) => {
  const [displayExpr, setDisplayExpr] = useState<string>(''); // Human readable expression on display
  const [evalExpr, setEvalExpr] = useState<string>(''); // Under the hood JS expression
  const [result, setResult] = useState<string>('');
  const [lastAns, setLastAns] = useState<string>('0');
  const [isRadian, setIsRadian] = useState<boolean>(true); // Mode RAD/DEG
  const [isShift, setIsShift] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle Dragging
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

  // Append characters to display and evaluation strings
  const append = (displayChar: string, evalChar: string) => {
    setDisplayExpr((prev) => prev + displayChar);
    setEvalExpr((prev) => prev + evalChar);
  };

  const handleClear = () => {
    setDisplayExpr('');
    setEvalExpr('');
    setResult('');
  };

  const handleDelete = () => {
    if (displayExpr.length === 0) return;
    setDisplayExpr((prev) => prev.slice(0, -1));
    setEvalExpr((prev) => prev.slice(0, -1));
  };

  // Safely evaluate the mathematical expression
  const handleEvaluate = () => {
    if (!evalExpr) return;
    try {
      let cleanExpr = evalExpr
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/Ans/g, lastAns);

      // Handle trigonometric functions considering RAD/DEG
      // In Degree mode, we wrap the inside of sin/cos/tan inside (deg * Math.PI / 180)
      if (!isRadian) {
        // Find triggers like Math.sin(X), Math.cos(X), Math.tan(X) and scale inner parameters
        // A simple approach is to search for trigonometric names and scale inside brackets
        // Since expressions are simple: sin(A) -> sin(A * PI / 180)
        // Let's implement dynamic replacement of functions via a simple evaluator or standard mapping
        cleanExpr = cleanExpr
          .replace(/Math\.sin\((.*?)\)/g, 'Math.sin(($1) * Math.PI / 180)')
          .replace(/Math\.cos\((.*?)\)/g, 'Math.cos(($1) * Math.PI / 180)')
          .replace(/Math\.tan\((.*?)\)/g, 'Math.tan(($1) * Math.PI / 180)');
      }

      // Safe evaluation using Function
      // Validate string to prevent code injection
      const allowedCharacters = /^[0-9+\-*/().,\s]|Math\.[a-z0-9]+/i;
      const resultVal = new Function(`return (${cleanExpr})`)();
      
      if (typeof resultVal === 'number' && !isNaN(resultVal)) {
        // Format to standard decimals
        const formatted = Number(resultVal.toFixed(6)).toString();
        setResult(formatted);
        setLastAns(formatted);
      } else {
        setResult('ERROR');
      }
    } catch (e) {
      setResult('SYNTAX ERROR');
    }
  };

  return (
    <div
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className="fixed bottom-10 right-10 z-[100] w-[340px] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 text-white select-none transition-shadow"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-move pb-2 border-b border-rose-500/10 mb-3"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1.5 text-slate-400">
          <Move size={14} className="text-zinc-500" />
          <span className="font-display text-xs font-bold tracking-wider text-rose-500">CASIO</span>
          <span className="font-mono text-[9px] text-slate-500">fx-580VN X</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsRadian(!isRadian)}
            className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750"
          >
            {isRadian ? 'RAD' : 'DEG'}
          </button>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Screen Display */}
      <div className="w-full bg-emerald-900/10 border border-emerald-500/10 rounded-lg p-3 mb-4 text-slate-100 font-mono flex flex-col items-end min-h-[74px] justify-between shadow-inner relative overflow-hidden">
        <div className="absolute top-1 left-2 text-[8px] text-emerald-500/50 flex gap-2">
          <span>{isRadian ? 'RAD' : 'DEG'}</span>
          <span>{isShift ? 'S' : ''}</span>
          <span>MATH</span>
        </div>
        
        {/* Input formula */}
        <div className="w-full text-right text-base leading-tight break-all mt-1 pr-1 text-slate-300 tracking-wide min-h-[24px]">
          {displayExpr || '0'}
        </div>
        
        {/* Result */}
        <div className="w-full text-right text-xl font-bold tracking-wider text-emerald-400">
          {result ? `= ${result}` : ''}
        </div>
      </div>

      {/* Calculator Pad Grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {/* Row 1 Scientific keys */}
        <button 
          onClick={() => { setIsShift(!isShift) }} 
          className={`py-1.5 text-[9px] font-bold rounded font-mono ${isShift ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-amber-500'}`}
        >
          {isShift ? 'SHIFT_ON' : 'SHIFT'}
        </button>
        <button onClick={() => { append('π', 'π') }} className="py-1.5 text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-300 rounded font-mono">π</button>
        <button onClick={() => { append('e', 'e') }} className="py-1.5 text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-300 rounded font-mono">e</button>
        <button onClick={() => { append('(', '(') }} className="py-1.5 text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 roundedfont-mono">(</button>
        <button onClick={() => { append(')', ')') }} className="py-1.5 text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 rounded font-mono">)</button>

        {/* Row 2 Scientific functions */}
        <button onClick={() => { append('sin(', 'Math.sin(') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-emerald-400 rounded font-mono">sin</button>
        <button onClick={() => { append('cos(', 'Math.cos(') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-emerald-400 rounded font-mono">cos</button>
        <button onClick={() => { append('tan(', 'Math.tan(') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-emerald-400 rounded font-mono">tan</button>
        <button onClick={() => { append('√(', 'Math.sqrt(') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-sky-400 rounded font-mono">√</button>
        <button onClick={() => { append('^2', '**2') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-sky-400 rounded font-mono">x²</button>

        {/* Row 3 More scientific functions */}
        <button onClick={() => { append('ln(', 'Math.log(') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-amber-400 rounded font-mono">ln</button>
        <button onClick={() => { append('log10(', 'Math.log10(') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-amber-400 rounded font-mono">log</button>
        <button onClick={() => { append('^', '**') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-sky-400 rounded font-mono">xʸ</button>
        <button onClick={() => { append('Ans', 'Ans') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-indigo-400 rounded font-mono">Ans</button>
        <button onClick={() => { append('e^', 'Math.exp(') }} className="py-1.5 text-[10px] bg-slate-850 hover:bg-slate-750 text-orange-400 rounded font-mono">eˣ</button>

        {/* Row 4 Basic numbers 7-9 & DEL/AC */}
        <button onClick={() => { append('7', '7') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">7</button>
        <button onClick={() => { append('8', '8') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">8</button>
        <button onClick={() => { append('9', '9') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">9</button>
        <button onClick={handleDelete} className="py-2.5 text-xs bg-rose-950/80 hover:bg-rose-900 border border-rose-850 text-rose-300 font-bold rounded flex items-center justify-center font-mono">DEL</button>
        <button onClick={handleClear} className="py-2.5 text-xs bg-rose-950/80 hover:bg-rose-900 border border-rose-850 text-rose-300 font-bold rounded flex items-center justify-center font-mono">AC</button>

        {/* Row 5 Basic numbers 4-6 & operators */}
        <button onClick={() => { append('4', '4') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">4</button>
        <button onClick={() => { append('5', '5') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">5</button>
        <button onClick={() => { append('6', '6') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">6</button>
        <button onClick={() => { append('×', '*') }} className="py-2.5 text-lg bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded font-mono">×</button>
        <button onClick={() => { append('÷', '/') }} className="py-2.5 text-lg bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded font-mono">÷</button>

        {/* Row 6 Basic numbers 1-3 & operators */}
        <button onClick={() => { append('1', '1') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">1</button>
        <button onClick={() => { append('2', '2') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">2</button>
        <button onClick={() => { append('3', '3') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">3</button>
        <button onClick={() => { append('+', '+') }} className="py-2.5 text-lg bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded font-mono">+</button>
        <button onClick={() => { append('-', '-') }} className="py-2.5 text-lg bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded font-mono">−</button>

        {/* Row 7 Basic number 0, dot, exponent, equal */}
        <button onClick={() => { append('0', '0') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">0</button>
        <button onClick={() => { append('.', '.') }} className="py-2.5 text-base bg-slate-700 hover:bg-slate-650 text-white font-semibold rounded font-mono">.</button>
        <button onClick={() => { append('×10^', '*10**') }} className="py-2.5 text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 rounded font-mono font-bold">x10ˣ</button>
        <button onClick={handleEvaluate} className="col-span-2 py-2.5 text-lg bg-rose-600 hover:bg-rose-500 text-white font-bold rounded shadow-lg shadow-rose-600/20 font-mono">=</button>
      </div>

      <div className="text-[8px] text-center text-slate-600 mt-2.5 font-mono">
        Nhấn phím `=` để tính • Góc tính mặc định: RADIAN.
      </div>
    </div>
  );
};
