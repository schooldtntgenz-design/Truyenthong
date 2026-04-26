import React from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  Video, 
  BarChart3, 
  Zap, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { AppData, Subject, ViewState } from '../types';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  data: AppData;
  setView: (view: ViewState) => void;
  setSelectedSubject: (subject: Subject) => void;
}

const ICON_MAP: Record<string, any> = {
  Palette,
  Video,
  BarChart3,
  Zap
};

const CHART_DATA = [
  { name: 'T2', score: 65 },
  { name: 'T3', score: 45 },
  { name: 'T4', score: 85 },
  { name: 'T5', score: 70 },
  { name: 'T6', score: 90 },
  { name: 'T7', score: 75 },
  { name: 'CN', score: 95 },
];

export default function Dashboard({ data, setView, setSelectedSubject }: DashboardProps) {
  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setView('quiz');
  };

  return (
    <div className="grid grid-cols-12 auto-rows-[100px] gap-4 pb-20">
      {/* Hero Welcome - Bento Large */}
      <section className="relative overflow-hidden rounded-3xl p-8 bg-slate-900 text-white col-span-12 lg:col-span-8 row-span-4 lg:row-span-3 flex flex-col justify-center">
        <div className="relative z-10 max-w-xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold sm:text-4xl mb-3 tracking-tight"
          >
            Sáng tạo nội dung triệu view cùng AI! 🚀
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg mb-6"
          >
            Học tập kịch bản & thiết kế poster chuyên nghiệp cho Facebook, TikTok.
          </motion.p>
          <div className="flex gap-3">
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setView('creator')}
              className="btn-primary inline-flex items-center gap-2"
            >
              Tạo Content <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#4A90E2] to-[#FF9500] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
      </section>

      {/* Mini Stats Bento Row */}
      <div className="col-span-12 lg:col-span-4 row-span-3 grid grid-cols-2 gap-4">
        {[
          { label: 'Thực hiện', value: data.totalProgress.totalAttempts, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Điểm tb', value: `${data.totalProgress.averageScore}%`, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Chuỗi ngày', value: data.totalProgress.streakDays, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Cần ôn', value: 'Video', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 card-bento flex flex-col items-center justify-center text-center gap-1 group hover:scale-[1.02]"
          >
            <div className={cn("p-2 rounded-xl mb-1 transition-transform group-hover:rotate-12", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <span className="text-xl font-bold">{stat.value}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Chart Section - Bento Box */}
      <div className="col-span-12 lg:col-span-5 row-span-4 card-bento p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Hoạt động học tập</h3>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-md">Tuần này</span>
        </div>
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#4A90E2" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subjects Grid - The "Heart" of the Bento */}
      <div className="col-span-12 lg:col-span-7 row-span-6 lg:row-span-4 grid grid-cols-2 gap-4">
        {data.subjects.map((subject, i) => {
          const Icon = ICON_MAP[subject.icon] || Palette;
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSubjectClick(subject)}
              className="group card-bento p-6 hover:ring-2 hover:ring-primary/20 cursor-pointer flex flex-col justify-between overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold text-md mb-1">{subject.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mb-2 font-medium">{subject.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto relative z-10">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">{subject.questionsCount} questions</span>
                <ChevronRight size={14} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              {/* Subtle background decoration */}
              <div className="absolute -bottom-2 -right-2 text-slate-50 scale-150 rotate-12 opacity-50 transition-transform group-hover:rotate-0">
                <Icon size={64} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Row - Featured/Ads/Tip */}
      <div className="col-span-12 row-span-2 card-bento p-6 flex flex-col sm:flex-row items-center gap-6 justify-between border-t-4 border-t-secondary/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4A90E2] to-[#FF9500] flex items-center justify-center text-white shrink-0 shadow-lg">
            <Lightbulb size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Mẹo sáng tạo hôm nay</h4>
            <p className="text-xs text-slate-500">Sử dụng quy tắc 1/3 để tạo sự cân bằng và thu hút cho Poster sự kiện của bạn.</p>
          </div>
        </div>
        <button onClick={() => setView('creator')} className="px-6 py-2.5 rounded-xl border-2 border-slate-100 font-bold text-xs hover:bg-slate-50 transition-all text-slate-600 block sm:inline-block">
          Thử áp dụng ngay →
        </button>
      </div>
    </div>
  );
}
