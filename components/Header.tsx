import React from 'react';
import { LayoutDashboard, BookOpen, PenTool, Settings, History } from 'lucide-react';
import { ViewState } from '../types';
import { cn } from '../lib/utils';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export default function Header({ currentView, setView }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'quiz', label: 'Học tập', icon: BookOpen },
    { id: 'creator', label: 'Tạo Content', icon: PenTool },
    { id: 'history', label: 'Lịch sử', icon: History },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 bg-gradient-to-br from-[#4A90E2] to-[#FF9500] shadow-md sm:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm hover:rotate-12 transition-transform">
            <PenTool size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight text-white sm:text-xl">
              SocialAI Creator
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                  isActive 
                    ? "bg-white text-slate-900 shadow-sm font-bold" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-white/20 px-3 py-1.5 rounded-full text-white text-[10px] border border-white/30 font-bold uppercase tracking-widest">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
            Gemini Active
          </div>
          <button 
            onClick={() => setView('settings')}
            className="bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors"
          >
            Cài đặt API
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 rounded-2xl glass p-2 gap-1 shadow-2xl z-50 ring-1 ring-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  isActive 
                    ? "bg-slate-900 text-white" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
