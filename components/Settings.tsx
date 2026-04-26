import React, { useState } from 'react';
import { Eye, EyeOff, Save, Download, Upload, Shield, Trash2, Sliders } from 'lucide-react';
import { AppSettings } from '../types';
import { cn } from '../lib/utils';
import Swal from 'sweetalert2';

interface SettingsProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  onClearData: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Settings({ settings, setSettings, onClearData, onExport, onImport }: SettingsProps) {
  const [showKey, setShowKey] = useState(false);

  const MODERN_MODELS = [
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash (Nhanh)', desc: 'Tốt cho summarization & Q&A' },
    { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro (Thông minh nhất)', desc: 'Tốt cho coding & ý tưởng phức tạp' },
    { id: 'gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite', desc: 'Tối ưu độ trễ' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center shadow-sm">
          <Sliders size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Cài đặt ứng dụng</h2>
          <p className="text-slate-500">Quản lý API, giao diện và dữ liệu cá nhân của bạn.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* API Section */}
        <div className="p-8 card-bento bg-white space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Shield size={20} />
            <h3 className="font-bold text-lg">Cấu hình AI</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 block">Gemini API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder="Dán API Key của bạn vào đây..."
                  className="w-full p-4 pr-12 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-mono text-sm tracking-widest"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                * Mặc định hệ thống sử dụng Key chung nếu bạn để trống. Key của bạn sẽ được lưu an toàn trong LocalStorage.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 block">Model ưu tiên</label>
              <div className="grid gap-2">
                {MODERN_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSettings({ ...settings, model: model.id })}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      settings.model === model.id ? "border-primary bg-primary/5" : "border-slate-100 hover:bg-slate-50"
                    )}
                  >
                    <p className="font-bold text-sm">{model.label}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{model.id}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data & Appearance */}
        <div className="space-y-8">
          <div className="p-8 card-bento space-y-6">
            <h3 className="font-bold text-lg">Giao diện & Tiết kiệm</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <div>
                  <p className="font-bold text-sm">Chế độ tối (Dark mode)</p>
                  <p className="text-xs text-slate-500">Giảm mỏi mắt khi làm đêm</p>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, theme: settings.theme === 'light' ? 'dark' : 'light' })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    settings.theme === 'dark' ? "bg-slate-900" : "bg-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                    settings.theme === 'dark' ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <div>
                  <p className="font-bold text-sm">Tự động sao lưu</p>
                  <p className="text-xs text-slate-500">Lưu tiến độ ngay khi hoàn thành</p>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    settings.autoSave ? "bg-emerald-500" : "bg-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                    settings.autoSave ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 card-bento space-y-4">
            <h3 className="font-bold text-lg">Quản lý dữ liệu</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onExport} className="btn-ghost border border-slate-200 flex items-center justify-center gap-2">
                <Download size={18} /> Xuất JSON
              </button>
              <label className="btn-ghost border border-slate-200 flex items-center justify-center gap-2 cursor-pointer">
                <Upload size={18} /> Nhập file
                <input type="file" className="hidden" accept=".json" onChange={onImport} />
              </label>
              <button 
                onClick={onClearData}
                className="col-span-2 py-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors font-bold text-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Xóa toàn bộ dữ liệu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
