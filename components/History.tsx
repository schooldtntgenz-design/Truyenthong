import React from 'react';
import { motion } from 'motion/react';
import { History as HistoryIcon, Award, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Session, Subject } from '../types';
import { formatDate, formatTime, cn } from '../lib/utils';

interface HistoryProps {
  sessions: Session[];
  subjects: Subject[];
}

export default function History({ sessions, subjects }: HistoryProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center card-bento bg-white">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
          <HistoryIcon size={32} />
        </div>
        <h3 className="text-xl font-bold">Chưa có lịch sử học tập</h3>
        <p className="text-slate-500">Hãy bắt đầu bài học đầu tiên để theo dõi tiến độ của bạn nhé!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
          <HistoryIcon size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Lịch sử hoạt động</h2>
          <p className="text-slate-500">Xem lại kết quả các bài kiểm tra và quá trình rèn luyện của bạn.</p>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((session, i) => {
          const subject = subjects.find(s => s.id === session.subjectId);
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 card-bento bg-white flex flex-col sm:flex-row items-center gap-6 group hover:ring-2 hover:ring-primary/20 transition-all"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold leading-none shrink-0",
                session.score >= 80 ? "bg-emerald-500" : session.score >= 50 ? "bg-amber-500" : "bg-rose-500"
              )}>
                <span className="text-xl">{session.score}</span>
                <span className="text-[10px] uppercase opacity-80">ĐIỂM</span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-lg mb-1">{subject?.name || 'Chủ đề ẩn'}</h4>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-slate-500 text-xs">
                  <span className="flex items-center gap-1"><Award size={14} /> Đúng: {session.correctAnswers}/{session.totalQuestions}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> Thời gian: {formatTime(session.timeSpent)}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(session.date)}</span>
                </div>
              </div>

              <button className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                <ChevronRight size={20} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
