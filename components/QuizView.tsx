import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, CheckCircle2, XCircle, AlertCircle, ChevronRight, RotateCcw, Home, Award } from 'lucide-react';
import { Question, Subject, Session, ViewState } from '../types';
import { cn, formatTime } from '../lib/utils';
import Swal from 'sweetalert2';

interface QuizViewProps {
  questions: Question[];
  subject: Subject | null;
  onComplete: (session: Session) => void;
  setView: (view: ViewState) => void;
}

export default function QuizView({ questions, subject, onComplete, setView }: QuizViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished]);

  if (!subject || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center card-bento">
        <AlertCircle size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Chưa có câu hỏi nào</h2>
        <p className="text-slate-500 mb-6">Chủ đề này đang được cập nhật thêm nội dung mới.</p>
        <button onClick={() => setView('dashboard')} className="btn-primary">Quay lại Tổng quan</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const handleAnswer = (optionIdx: number) => {
    if (showExplanation) return;
    setAnswers({ ...answers, [currentIdx]: optionIdx });
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLast) {
      finishQuiz();
    } else {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(false);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    setIsActive(false);
    
    const correctCount = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    const session: Session = {
      id: Math.random().toString(36).substr(2, 9),
      subjectId: subject.id,
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      timeSpent: timer,
      date: new Date().toISOString(),
    };

    onComplete(session);
  };

  if (isFinished) {
    const correctCount = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-10 card-bento text-center space-y-6"
      >
        <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-[#4A90E2] to-[#FF9500] flex items-center justify-center text-white shadow-xl animate-bounce">
          <Award size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Hoàn thành bài học!</h2>
          <p className="text-slate-500">Tuyệt vời, bạn đã vượt qua thử thách về <strong>{subject.name}</strong></p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Điểm số</p>
            <p className={cn("text-2xl font-bold", score >= 80 ? "text-emerald-500" : "text-amber-500")}>{score}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Đúng</p>
            <p className="text-2xl font-bold">{correctCount}/{questions.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Thời gian</p>
            <p className="text-2xl font-bold">{formatTime(timer)}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setView('dashboard')} className="flex-1 btn-ghost flex items-center justify-center gap-2">
            <Home size={18} /> Về trang chủ
          </button>
          <button 
            onClick={() => {
              setCurrentIdx(0);
              setAnswers({});
              setShowExplanation(false);
              setIsFinished(false);
              setTimer(0);
              setIsActive(true);
            }} 
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> Làm lại
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between p-4 card-bento">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A90E2] to-[#FF9500] flex items-center justify-center text-white">
            {currentIdx + 1}
          </div>
          <div>
            <h4 className="font-bold text-sm leading-none">{subject.name}</h4>
            <p className="text-xs text-slate-500 mt-1">Câu {currentIdx + 1} / {questions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-600 font-mono text-sm">
          <Timer size={16} />
          {formatTime(timer)}
        </div>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-br from-[#4A90E2] to-[#FF9500]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-8 card-bento bg-white space-y-6 shadow-xl"
        >
          <h3 className="text-xl sm:text-2xl font-bold leading-relaxed">
            {currentQuestion.content}
          </h3>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, i) => {
              const isSelected = answers[currentIdx] === i;
              const isCorrect = i === currentQuestion.correctAnswer;
              
              let variantStyle = "border-slate-200 hover:border-primary/50 hover:bg-slate-50";
              if (showExplanation) {
                if (isCorrect) variantStyle = "border-emerald-500 bg-emerald-50 text-emerald-900";
                else if (isSelected) variantStyle = "border-rose-500 bg-rose-50 text-rose-900";
                else variantStyle = "border-slate-100 opacity-50 grayscale cursor-default";
              } else if (isSelected) {
                variantStyle = "border-primary bg-primary/5 shadow-inner";
              }

              return (
                <button
                  key={i}
                  disabled={showExplanation}
                  onClick={() => handleAnswer(i)}
                  className={cn(
                    "w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                    variantStyle
                  )}
                >
                  <span className="font-medium text-lg">{option}</span>
                  {showExplanation && isCorrect && <CheckCircle2 className="text-emerald-500" size={24} />}
                  {showExplanation && isSelected && !isCorrect && <XCircle className="text-rose-500" size={24} />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-6 rounded-2xl bg-slate-900 text-white space-y-4"
              >
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertCircle size={20} />
                  <h4 className="font-bold uppercase text-xs tracking-widest">Giải thích</h4>
                </div>
                <p className="text-slate-300 leading-relaxed italic text-sm">
                  {currentQuestion.explanation}
                </p>
                <button 
                  onClick={handleNext}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                >
                  {isLast ? 'Hoàn thành' : 'Câu tiếp theo'} <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
