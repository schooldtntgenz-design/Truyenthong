/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AppData, 
  ViewState, 
  Subject, 
  Session, 
  AppSettings 
} from './types';
import { 
  INITIAL_SUBJECTS, 
  INITIAL_QUESTIONS, 
  MOCK_HISTORY 
} from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import QuizView from './components/QuizView';
import AICreator from './components/AICreator';
import Settings from './components/Settings';
import History from './components/History';
import Swal from 'sweetalert2';

export default function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [data, setData] = useState<AppData>({
    subjects: INITIAL_SUBJECTS,
    questions: INITIAL_QUESTIONS,
    sessions: [],
    totalProgress: {
      totalAttempts: 0,
      averageScore: 0,
      streakDays: 3,
      weakTopics: [],
    }
  });

  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    soundEnabled: true,
    autoSave: true,
    apiKey: '',
    model: 'gemini-3-flash-preview',
  });

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Load data from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('ai_architect_data');
    const savedSettings = localStorage.getItem('ai_architect_settings');
    
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      // Fallback or Initial Mock Data
      const initialData: AppData = {
        subjects: INITIAL_SUBJECTS,
        questions: INITIAL_QUESTIONS,
        sessions: MOCK_HISTORY as any,
        totalProgress: {
          totalAttempts: MOCK_HISTORY.length,
          averageScore: 90,
          streakDays: 3,
          weakTopics: [],
        }
      };
      setData(initialData);
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save data to LocalStorage
  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem('ai_architect_data', JSON.stringify(data));
      localStorage.setItem('ai_architect_settings', JSON.stringify(settings));
    }
  }, [data, settings]);

  const handleQuizComplete = (session: Session) => {
    const newSessions = [...data.sessions, session];
    const totalAttempts = newSessions.length;
    const averageScore = Math.round(newSessions.reduce((acc, s) => acc + s.score, 0) / totalAttempts);
    
    setData({
      ...data,
      sessions: newSessions,
      totalProgress: {
        ...data.totalProgress,
        totalAttempts,
        averageScore,
      }
    });

    Swal.fire({
      icon: 'success',
      title: 'Tuyệt vời!',
      text: `Bạn đã hoàn thành bài học với ${session.score} điểm.`,
      timer: 3000,
      showConfirmButton: false,
    });
  };

  const handleExport = () => {
    const exportData = { data, settings };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_architect_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.data && imported.settings) {
          setData(imported.data);
          setSettings(imported.settings);
          Swal.fire('Thành công', 'Đã nhập dữ liệu thành công!', 'success');
        } else {
          throw new Error('Định dạng file không đúng');
        }
      } catch (err) {
        Swal.fire('Lỗi', 'Không thể nhập dữ liệu. Vui lòng kiểm tra file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Tất cả tiến độ học tập và cài đặt sẽ bị xóa sạch!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Đồng ý, xóa hết!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('ai_architect_data');
        localStorage.removeItem('ai_architect_settings');
        window.location.reload();
      }
    });
  };

  return (
    <div className={settings.theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <Header currentView={view} setView={setView} />
        
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'dashboard' && (
                <Dashboard 
                  data={data} 
                  setView={setView} 
                  setSelectedSubject={setSelectedSubject} 
                />
              )}

              {view === 'quiz' && (
                <QuizView 
                  questions={data.questions.filter(q => q.subjectId === selectedSubject?.id)}
                  subject={selectedSubject}
                  onComplete={handleQuizComplete}
                  setView={setView}
                />
              )}

              {view === 'creator' && (
                <AICreator 
                  apiKey={settings.apiKey}
                  model={settings.model}
                />
              )}

              {view === 'history' && (
                <History 
                  sessions={data.sessions} 
                  subjects={data.subjects} 
                />
              )}

              {view === 'settings' && (
                <Settings 
                  settings={settings}
                  setSettings={setSettings}
                  onClearData={handleClearData}
                  onExport={handleExport}
                  onImport={handleImport}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
