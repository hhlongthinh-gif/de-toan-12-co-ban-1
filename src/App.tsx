import React, { useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  Calculator, 
  Paintbrush, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flag, 
  AlertCircle, 
  X, 
  FileText, 
  RefreshCw, 
  HelpCircle, 
  Send,
  Sparkles,
  Info,
  CheckCircle,
  XCircle,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS, SECTIONS, Question } from './data/questions';
import { MathText } from './components/MathText';
import { CasioCalculator } from './components/CasioCalculator';
import { Scratchpad } from './components/Scratchpad';

export default function App() {
  // ---- Exam States ----
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('math_exam_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [flags, setFlags] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem('math_exam_flags');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentId, setCurrentId] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    return localStorage.getItem('math_exam_submitted') === 'true';
  });
  
  // ---- Timer ----
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = localStorage.getItem('math_exam_time_left');
    return saved ? parseInt(saved, 10) : 90 * 60; // 90 minutes
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(!isSubmitted);

  // ---- Widgets ----
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // ---- Persist Exam locally to survive random refreshing ----
  useEffect(() => {
    localStorage.setItem('math_exam_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('math_exam_flags', JSON.stringify(flags));
  }, [flags]);

  useEffect(() => {
    localStorage.setItem('math_exam_submitted', isSubmitted.toString());
  }, [isSubmitted]);

  // Timer loop
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        localStorage.setItem('math_exam_time_left', (prev - 1).toString());
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    alert('Hết giờ làm bài! Hệ thống đã tự động nộp bài làm của bạn.');
  };

  const handleManualSubmit = () => {
    const totalAnswered = Object.keys(answers).length;
    let confirmMsg = `Bạn đã hoàn thành ${totalAnswered}/30 câu hỏi.\nBạn có chắc chắn muốn nộp bài thi ngay bây giờ không?`;
    
    if (totalAnswered < 30) {
      confirmMsg += `\nLưu ý: Bạn vẫn còn ${30 - totalAnswered} câu hỏi chưa có câu trả lời.`;
    }

    if (window.confirm(confirmMsg)) {
      setIsSubmitted(true);
      setIsTimerRunning(false);
    }
  };

  const restartExam = () => {
    if (window.confirm('Bạn có muốn xóa kết quả hiện tại và bắt đầu làm lại bài thi không?')) {
      setAnswers({});
      setFlags({});
      setCurrentId(1);
      setIsSubmitted(false);
      setTimeLeft(90 * 60);
      setIsTimerRunning(true);
      localStorage.removeItem('math_exam_answers');
      localStorage.removeItem('math_exam_flags');
      localStorage.removeItem('math_exam_submitted');
      localStorage.removeItem('math_exam_time_left');
    }
  };

  // Convert seconds to format mm:ss (or hh:mm:ss if > 60m)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const minStr = mins < 10 ? `0${mins}` : mins;
    const secStr = secs < 10 ? `0${secs}` : secs;

    if (hrs > 0) {
      return `${hrs}:${minStr}:${secStr}`;
    }
    return `${minStr}:${secStr}`;
  };

  // ---- Grade Logic & Scoring ----
  const scoreResults = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    
    // Section-based metrics: { sectionId: { correct, total } }
    const sectionMetrics: Record<string, { correct: number; total: number }> = {
      section1: { correct: 0, total: 5 },
      section2: { correct: 0, total: 5 },
      section3: { correct: 0, total: 12 },
      section4: { correct: 0, total: 8 },
    };

    QUESTIONS.forEach((q) => {
      const selectedIdx = answers[q.id];
      if (selectedIdx === undefined) {
        unattemptedCount++;
      } else if (selectedIdx === q.correctIndex) {
        correctCount++;
        sectionMetrics[q.sectionId].correct++;
      } else {
        incorrectCount++;
      }
    });

    const scoreFloat = (correctCount / 30) * 10;
    const score = Math.round(scoreFloat * 10) / 10; // Round to 1 decimal place

    // Vietnamese standard academic scale
    let rating = 'Yếu';
    let ratingColor = 'text-rose-500 bg-rose-50 border-rose-100';
    let ratingFeedback = 'Bạn cần ôn tập lại nhiều phần kiến thức cốt lõi của kỳ thi.';
    
    if (score >= 9.0) {
      rating = 'Xuất Sắc';
      ratingColor = 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30';
      ratingFeedback = 'Tuyệt vời! Bạn có tư duy toán học cực tốt và kỹ năng bấm máy rất vững vàng.';
    } else if (score >= 8.0) {
      rating = 'Giỏi';
      ratingColor = 'text-teal-600 bg-teal-50 border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/30';
      ratingFeedback = 'Rất xuất sắc! Kỹ năng giải toán và suy luận không gian của bạn rất đáng ghi nhận.';
    } else if (score >= 6.5) {
      rating = 'Khá';
      ratingColor = 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30';
      ratingFeedback = 'Tốt! Hãy cẩn thận hơn ở các phần dễ sai sót và luyện tốc độ bấm Casio.';
    } else if (score >= 5.0) {
      rating = 'Trung Bình';
      ratingColor = 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30';
      ratingFeedback = 'Đạt yêu cầu cơ bản. Hãy chăm chỉ cải thiện phần Tích phân và Hình Oxyz.';
    }

    return {
      score,
      correctCount,
      incorrectCount,
      unattemptedCount,
      rating,
      ratingColor,
      ratingFeedback,
      metrics: sectionMetrics,
    };
  };

  const results = scoreResults();

  // Current Question Obj
  const currentQuestion = QUESTIONS.find((q) => q.id === currentId) || QUESTIONS[0];

  // Helper values
  const totalAnswered = Object.keys(answers).length;
  const isFlagged = !isSubmitted && !!flags[currentId];

  // Letters mapping
  const CHOICE_LETTER = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between select-text selection:bg-blue-500/20">
      
      {/* HEADER SECTION */}
      <header className="bg-blue-700 text-white shadow-md py-4 px-6 md:px-8 sticky top-0 z-40 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded shadow-sm">
              <BookOpen size={24} className="text-white shrink-0" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg md:text-xl text-white tracking-tight leading-none">
                ĐỀ KIỂM TRA TOÁN TỔNG HỢP
              </h1>
              <p className="text-xs text-blue-200 mt-1.5 font-medium tracking-wide">
                Khảo sát kiến thức: Thống kê • Tích phân • Hình học Oxyz • Cấp số cộng/nhân
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            {/* Clock timer */}
            {!isSubmitted && (
              <div className="flex flex-col text-right">
                <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Thời gian còn lại</p>
                <p className={`text-xl font-mono font-bold leading-none mt-1 ${timeLeft < 600 ? 'text-yellow-300 animate-pulse' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            )}

            <div className="hidden sm:block h-10 w-px bg-blue-500"></div>

            {/* Student info widget */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-white">Nguyễn Hoàng Nam</p>
                <p className="text-[10px] text-blue-200">ID: 2024-HS12-0045</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center font-bold text-white text-sm" title="Học sinh: Nguyễn Hoàng Nam">
                NH
              </div>
            </div>

            <div className="h-10 w-px bg-blue-500"></div>

            {/* Mode tools control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHelpModal(true)}
                className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                title="Hướng dẫn làm bài"
              >
                <Info size={16} />
              </button>

              {isSubmitted ? (
                <button
                  onClick={restartExam}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow transition-all active:scale-97 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  LÀM LẠI
                </button>
              ) : (
                <button
                  onClick={handleManualSubmit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs bg-red-500 hover:bg-red-650 text-white shadow transition-all active:scale-97 cursor-pointer"
                >
                  <Send size={12} />
                  NỘP BÀI
                </button>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-6 relative">
        
        {/* VIEW 1: ACTIVE LIVE EXAM INTERFACE */}
        {!isSubmitted ? (
          <>
            {/* GRID NAVIGATOR PANEL (LEFT COLUMN) */}
            <section className="w-full lg:w-[300px] shrink-0 self-stretch flex flex-col gap-5">
              
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                
                {/* Progress bar and statistics */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                  <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tiến trình làm bài</h2>
                  <div className="mt-3 flex justify-between text-xs">
                    <span className="text-slate-650 dark:text-slate-350">Đã làm: <strong className="font-bold text-slate-800 dark:text-white">{totalAnswered}/30</strong></span>
                    <span className="text-slate-650 dark:text-slate-350">Tỷ lệ: <strong className="font-bold text-blue-600 dark:text-blue-400">{Math.round((totalAnswered / 30) * 100)}%</strong></span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.round((totalAnswered / 30) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Section progress categories */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 bg-white dark:bg-transparent">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Cấu trúc 4 phần của đề thi
                  </p>
                  {SECTIONS.map((sec) => {
                    const secQIdxs = QUESTIONS.filter((q) => q.sectionId === sec.id).map((q) => q.id);
                    const doneForSec = secQIdxs.filter((id) => answers[id] !== undefined).length;
                    const pct = Math.round((doneForSec / secQIdxs.length) * 100);

                    return (
                      <button
                        key={sec.id}
                        onClick={() => {
                          const firstQ = QUESTIONS.find((q) => q.sectionId === sec.id);
                          if (firstQ) setCurrentId(firstQ.id);
                        }}
                        className={`text-left p-2 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 border transition-all ${
                          currentQuestion.sectionId === sec.id
                            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/25 dark:border-blue-900/30 dark:text-blue-400 font-bold shadow-sm'
                            : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate block font-medium">{sec.title.split(': ')[1] || sec.title}</p>
                          <span className="text-[10px] text-slate-400 font-normal">{sec.range}</span>
                        </div>
                        <span className={`text-[9px] font-mono shrink-0 px-1 py-0.5 rounded font-bold ${
                          pct === 100 
                            ? 'bg-green-100 text-green-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}>
                          {pct}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* The 1-30 Bubble list of questions */}
                <div className="p-4 bg-white dark:bg-transparent">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Các câu hỏi từ 1 - 30
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {QUESTIONS.map((q) => {
                      const isIdxCurrent = q.id === currentId;
                      const hasIdxAnswer = answers[q.id] !== undefined;
                      const isIdxFlagged = !!flags[q.id];

                      let bubbleClass = 'bg-slate-100 border-slate-205 text-slate-400 dark:bg-slate-800 dark:border-slate-705 dark:text-slate-400';
                      
                      if (hasIdxAnswer) {
                        bubbleClass = 'bg-green-100 border-green-200 text-green-700 font-bold dark:bg-emerald-950/40 dark:border-emerald-900/40 dark:text-emerald-300';
                      }
                      if (isIdxFlagged) {
                        bubbleClass = 'bg-yellow-105 border-yellow-200 text-yellow-700 font-bold dark:bg-yellow-950/40 dark:border-yellow-900/40 dark:text-yellow-300';
                      }
                      if (isIdxCurrent) {
                        bubbleClass = 'bg-blue-600 border-blue-700 text-white font-black scale-110 shadow-md ring-2 ring-blue-500 ring-offset-1 z-10 dark:ring-blue-900/60';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentId(q.id)}
                          className={`aspect-square min-h-[38px] flex items-center justify-center rounded text-xs font-mono font-bold cursor-pointer transition-all active:scale-95 ${bubbleClass}`}
                        >
                          {q.id}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom CTA for manual submission inside Sidebar */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 mt-auto">
                  <button 
                    onClick={handleManualSubmit}
                    className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors shadow-sm text-xs cursor-pointer tracking-wider"
                  >
                    NỘP BÀI THI
                  </button>
                </div>

              </div>
            </section>

            {/* ACTIVE QUESTION PANEL (MIDDLE/RIGHT COLUMN) */}
            <section className="flex-1 self-stretch flex flex-col gap-6">
              
              {/* Question card */}
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden justify-between">
                
                {/* Header portion */}
                <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-bold px-3 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-100/30 dark:border-blue-900/20 rounded-full text-xs uppercase tracking-wide">
                    {currentQuestion.sectionTitle}
                  </span>
                  <button
                    onClick={() => setFlags((prev) => ({ ...prev, [currentId]: !prev[currentId] }))}
                    className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-205 text-xs italic underline decoration-slate-200 dark:decoration-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Flag size={13} className={isFlagged ? "fill-yellow-500 text-yellow-500" : ""} />
                    {isFlagged ? "Đã đánh dấu xem lại" : "Đánh dấu câu hỏi này"}
                  </button>
                </div>

                {/* Core Question Details */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-lg md:text-xl font-semibold leading-relaxed mb-6 select-text">
                    <span className="text-blue-600 dark:text-blue-400 font-bold mr-2">Câu {currentQuestion.id}:</span>
                    <MathText text={currentQuestion.questionText} />
                  </h3>

                  {/* MCQ Options with premium borders matching Design HTML */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    {currentQuestion.options.map((opt, optIdx) => {
                      const isSelected = answers[currentId] === optIdx;
                      
                      return (
                        <button
                          key={`${currentId}-${optIdx}`}
                          onClick={() => setAnswers((prev) => ({ ...prev, [currentId]: optIdx }))}
                          className={`flex items-center p-4 border-2 rounded-xl text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/70 text-blue-900 dark:bg-blue-950/20 dark:text-blue-300 font-semibold shadow-sm'
                              : 'border-slate-100 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-850 dark:hover:border-blue-950/40 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white font-extrabold'
                              : 'border border-slate-200 dark:border-slate-700 text-slate-400'
                          }`}>
                            {CHOICE_LETTER[optIdx]}
                          </div>
                          <span className="text-sm md:text-base pr-2 flex-1"><MathText text={opt} /></span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Controls footer */}
                <div className="px-6 md:px-8 py-5 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                  <button
                    disabled={currentId === 1}
                    onClick={() => setCurrentId((prev) => Math.max(1, prev - 1))}
                    className="px-5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex items-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} className="mr-1.5" />
                    Câu trước
                  </button>
                  
                  <div className="text-slate-400 dark:text-slate-550 font-semibold text-xs font-mono">
                    Câu {currentId} / 30
                  </div>

                  {currentId === 30 ? (
                    <button
                      onClick={handleManualSubmit}
                      className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-xs flex items-center shadow transition-colors cursor-pointer"
                    >
                      Nộp bài thi
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentId((prev) => Math.min(30, prev + 1))}
                      className="px-5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center shadow transition-colors cursor-pointer"
                    >
                      Câu tiếp theo
                      <ChevronRight size={14} className="ml-1.5" />
                    </button>
                  )}
                </div>

              </div>

              {/* Secondary Info & Quick Formula Cards matching Design HTML absolute look */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0 relative">
                <div className="bg-blue-900 text-white rounded-xl p-6 relative overflow-hidden shadow-sm dark:bg-blue-950">
                  <h4 className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Ghi chú &amp; Công thức</h4>
                  <p className="text-sm text-blue-100 leading-relaxed font-medium">
                    Giá trị trung bình mẫu: <br/>
                    <span className="font-serif italic font-bold text-lg inline-block mt-1">x̄ = (x₁ + x₂ + ... + xₙ) / n</span>
                  </p>
                  <p className="text-[11px] text-blue-200/80 mt-2">
                    *Mẫu số liệu: Đảm bảo đếm đúng n phần tử của dãy số liệu mẫu.
                  </p>
                  <svg className="absolute bottom-[-20px] right-[-10px] w-28 h-28 opacity-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2 19h20V5H2v14zm2-12h16v10H4V7z"/></svg>
                </div>
                
                <div className="bg-white dark:bg-slate-850 border border-slate-205 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Lưu ý đặc biệt</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                    Hãy bật máy tính Casio ảo góc dưới để giải các bài tích phân và Oxyz
                  </p>
                </div>
              </div>

            </section>
          </>
        ) : (
          
          /* VIEW 2: POST_SUBMISION COMPREHENSIVE SCORE REPORT */
          <div className="w-full flex flex-col gap-6">
            
            {/* PERFORMANCE OVERVIEW BENTO BLOCKS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Box 1: Core Score Circle */}
              <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">
                  KẾT QUẢ ĐIỂM SỐ CỦA BẠN
                </p>
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  {/* Circular SVG gauge representation */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-blue-600"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={(2 * Math.PI * 70) * (1 - results.correctCount / 30)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="font-display font-black text-4xl text-slate-900 dark:text-white tracking-tighter">
                      {results.score}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 block border-t border-slate-100 dark:border-slate-800 pt-1 mt-1 font-mono">
                      THANG ĐIỂM 10
                    </span>
                  </div>
                </div>

                <div className={`px-4 py-1.5 rounded-full border text-xs font-black tracking-wider uppercase ${results.ratingColor}`}>
                  {results.rating}
                </div>
                <p className="text-xs text-slate-500 max-w-[240px] mt-2.5 italic">
                  &quot;{results.ratingFeedback}&quot;
                </p>
              </div>

              {/* Box 2: Questions Breakdown Gauge */}
              <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3 text-center lg:text-left">
                    THỐNG KÊ CHI TIẾT CÂU TRẢ LỜI
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="flex items-center gap-1.5 text-slate-500"><CheckCircle size={15} className="text-emerald-500" /> Đúng:</span>
                      <span className="font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded text-sm font-bold">{results.correctCount} / 30</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="flex items-center gap-1.5 text-slate-500"><XCircle size={15} className="text-rose-500" /> Sai:</span>
                      <span className="font-mono text-rose-550 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded text-sm font-bold">{results.incorrectCount} / 30</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold py-1">
                      <span className="flex items-center gap-1.5 text-slate-500"><AlertCircle size={15} className="text-slate-400" /> Bỏ trống:</span>
                      <span className="font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm font-bold">{results.unattemptedCount} / 30</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-105 p-3.5 rounded-xl text-xs dark:bg-slate-800/40 dark:border-slate-800">
                  <div className="flex gap-2 items-start text-blue-700 dark:text-blue-450 font-medium">
                    <Sparkles size={16} className="shrink-0 mt-0.5 animate-pulse text-blue-500" />
                    <div>
                      <p className="font-bold mb-0.5">Lời khuyên luyện thi:</p>
                      <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                        Bạn làm đúng {Math.round((results.correctCount / 30) * 100)}% toàn bộ kỳ thi. Nhấp vào các thẻ hỏi bài phía dưới để xem từng phương án và bài giải Toán chi tiết!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Section Percentage Progress Bar list */}
              <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">
                    BÁO CÁO NĂNG LỰC THEO TỪNG PHẦN
                  </p>
                  <div className="flex flex-col gap-3.5">
                    {SECTIONS.map((sec) => {
                      const m = results.metrics[sec.id];
                      const pct = Math.round((m.correct / m.total) * 100);
                      
                      let barColor = 'bg-slate-300';
                      if (pct >= 80) barColor = 'bg-emerald-500';
                      else if (pct >= 50) barColor = 'bg-blue-600';
                      else if (pct > 0) barColor = 'bg-amber-500';

                      return (
                        <div key={sec.id} className="text-xs">
                          <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400 mb-1 leading-none">
                            <span className="truncate max-w-[180px]">{sec.title.split(': ')[1]}</span>
                            <span className="font-mono text-[11px] shrink-0 font-bold">{m.correct}/{m.total} câu ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                            <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-slate-400 text-[10px] italic leading-tight text-center">
                  Hệ thống tự động lưu giữ lịch sử. Nhấp bắt đầu lại để đạt điểm tối ưu 10.0!
                </div>
              </div>

            </div>

            {/* EXPANDABLE MATHEMATICAL SOLUTIONS PORTLET */}
            <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-2">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-5">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <FileText className="text-rose-500" size={20} />
                    XEM GIẢI CHI TIẾT & ĐÁP ÁN 30 CÂU
                  </h2>
                  <p className="text-xs text-slate-505 dark:text-slate-400">
                    Bảng đối chiếu câu trả lời bên dưới. Nhấp vào từng câu để hiển thị đầy đủ phương pháp luận và mẹo bấm máy Casio tương ứng.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-500/10 border border-emerald-400/20 text-emerald-500 text-center text-[10px] leading-tight font-bold font-mono">✓</span> Đúng
                    <span className="w-3.5 h-3.5 rounded bg-rose-500/10 border border-rose-400/20 text-rose-500 text-center text-[10px] leading-tight font-bold font-mono">✗</span> Sai
                    <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-300 text-center text-[10px] leading-tight font-bold font-mono">?</span> Bỏ trống
                  </div>
                </div>
              </div>

              {/* Grid of 30 Accordions */}
              <div className="flex flex-col gap-4">
                {QUESTIONS.map((q) => {
                  const studentAnswerIdx = answers[q.id];
                  const hasAnswered = studentAnswerIdx !== undefined;
                  const isCorrect = studentAnswerIdx === q.correctIndex;

                  let scoreIcon = <HelpCircle size={16} className="text-slate-400" />;
                  let headerBorder = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10';

                  if (hasAnswered) {
                    if (isCorrect) {
                      scoreIcon = <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center font-mono">✓</span>;
                      headerBorder = 'border-emerald-200 bg-emerald-50/10 dark:border-emerald-950/30';
                    } else {
                      scoreIcon = <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-800 text-xs font-black flex items-center justify-center font-mono">✗</span>;
                      headerBorder = 'border-rose-200 bg-rose-50/10 dark:border-rose-950/30';
                    }
                  }

                  return (
                    <div key={q.id} className={`border rounded-xl shadow-xs overflow-hidden transition-all ${headerBorder}`}>
                      
                      {/* Accordion Trigger Header */}
                      <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white dark:bg-slate-850/80">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          {scoreIcon}
                          <span className="font-mono text-xs font-bold text-slate-500">CÂU {q.id}</span>
                          <span className="text-[10px] font-bold text-slate-400 py-0.5 px-1.5 bg-slate-100 dark:bg-slate-800 rounded">
                            {q.sectionTitle.split(': ')[1]}
                          </span>
                        </div>

                        {/* Showing matching of indices */}
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 shrink-0 font-medium ml-8 md:ml-0">
                          <span>
                            Lựa chọn của bạn:{' '}
                            <strong className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {hasAnswered ? CHOICE_LETTER[studentAnswerIdx] : 'Bộ trống'}
                            </strong>
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">|</span>
                          <span>
                            Đáp án đúng:{' '}
                            <strong className="text-emerald-600 font-bold">
                              {CHOICE_LETTER[q.correctIndex]}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                        {/* The Question Text in solution */}
                        <div className="mb-4 text-slate-800 dark:text-slate-200 text-sm font-medium leading-relaxed">
                          <MathText text={q.questionText} />
                        </div>

                        {/* Display choices and highlight */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 font-normal text-xs text-slate-600 dark:text-slate-400">
                          {q.options.map((opt, optIdx) => {
                            let itemClass = 'bg-white border-slate-200 dark:bg-slate-800/40 dark:border-slate-750';
                            
                            // Highlight correct answer in green
                            if (optIdx === q.correctIndex) {
                              itemClass = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-300';
                            }
                            // Highlight student's incorrect answer in red
                            else if (hasAnswered && optIdx === studentAnswerIdx && !isCorrect) {
                              itemClass = 'bg-rose-50 border-rose-300 text-rose-800 font-bold dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-300';
                            }

                            return (
                              <div key={optIdx} className={`p-2.5 rounded-lg border flex items-center gap-2 ${itemClass}`}>
                                <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center shrink-0 border uppercase ${
                                  optIdx === q.correctIndex
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : optIdx === studentAnswerIdx && !isCorrect
                                      ? 'bg-rose-500 border-rose-500 text-white'
                                      : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'
                                }`}>
                                  {CHOICE_LETTER[optIdx]}
                                </span>
                                <MathText text={opt} />
                              </div>
                            );
                          })}
                        </div>

                        {/* Step-by-step Math Explanation */}
                        <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                          <p className="text-[10px] font-bold text-rose-500 tracking-wider uppercase mb-2 flex items-center gap-1 leading-none">
                            <Sparkles size={11} className="animate-pulse" />
                            ĐÁP ÁN & CÁCH GIẢI CHI TIẾT
                          </p>
                          <div className="text-slate-700 dark:text-slate-305 text-xs focus:outline-none whitespace-pre-line leading-relaxed">
                            <MathText text={q.explanation} />
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER ACCREDITATION (WITH FLOATING UTILITIES POPUPS) */}
      <footer className="bg-white dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-450 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-medium">
            © 2026 Đề Kiểm Tra Toán Tổng Hợp. Được thiết kế cho trải nghiệm thi cử mượt mà, chuyên nghiệp nhất.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-zinc-400">MATH EXAMPAD v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* STICKY UTILITIES BAR TRIGGER (BOTTOM-RIGHT CORNER) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 shadow-lg rounded-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCalculator(!showCalculator)}
          className={`flex items-center justify-center p-3 rounded-full shadow-lg border cursor-pointer ${
            showCalculator
              ? 'bg-rose-500 text-white border-rose-450'
              : 'bg-slate-900 text-rose-400 border-slate-700 hover:text-white'
          }`}
          title="Mở máy tính Casio ảo"
        >
          <Calculator size={22} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowScratchpad(!showScratchpad)}
          className={`flex items-center justify-center p-3 rounded-full shadow-lg border cursor-pointer ${
            showScratchpad
              ? 'bg-indigo-600 text-white border-indigo-400'
              : 'bg-slate-900 text-indigo-400 border-slate-700 hover:text-white'
          }`}
          title="Mở bảng nháp Toán"
        >
          <Paintbrush size={22} />
        </motion.button>
      </div>

      {/* FLOATING CASIO MODAL */}
      <AnimatePresence>
        {showCalculator && (
          <CasioCalculator onClose={() => setShowCalculator(false)} />
        )}
      </AnimatePresence>

      {/* FLOATING SCRATCHPAD MODAL */}
      <AnimatePresence>
        {showScratchpad && (
          <Scratchpad onClose={() => setShowScratchpad(false)} />
        )}
      </AnimatePresence>

      {/* EXAM MANUAL HELP POPUP MODAL */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-850 p-6 rounded-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 shadow-2xl relative"
            >
              <button
                onClick={() => setShowHelpModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-4">
                <BookOpen size={28} className="mx-auto text-rose-500 mb-2" />
                <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                  HƯỚNG DẪN LÀM BÀI MÔN TOÁN
                </h3>
              </div>

              <div className="space-y-3.5 text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">1</span>
                  <p>
                    Bài thi gồm **30 câu hỏi trắc nghiệm** chia làm 4 phần thống kê, tích phân, Oxyz, cấp số cộng/nhân. Thời gian tối đa để hoàn thành là **90 phút**.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">2</span>
                  <p>
                    Có thể sử dụng **Máy tính Casio ảo** (Biểu tượng Máy tính) hoặc mở **Bảng nháp** (Biểu tượng Cọ vẽ) tại góc dưới để giải toán hình khối và phân tích.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">3</span>
                  <p>
                    Tại bảng điều hướng, bạn có thể nhấp **Đánh dấu câu hỏi** đối với các câu cần suy ngẫm thêm. Biểu tượng sẽ chuyển sang màu vàng dễ nhận diện.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">4</span>
                  <p>
                    Sau khi kết thúc tuyển chọn, nhấp nút **NỘP BÀI THI** để chấm điểm trực tiếp. Bạn sẽ xem được toàn bộ **giải phương pháp luận LaTeX chi tiết** của mọi bài toán!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full mt-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/25"
              >
                TÔI ĐÃ HIỂU, BẮT ĐẦU THI
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
