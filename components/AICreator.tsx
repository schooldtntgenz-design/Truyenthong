import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Copy, 
  Download, 
  RefreshCcw, 
  Lightbulb,
  FileVideo,
  FileImage,
  Layout,
  ChevronRight
} from 'lucide-react';
import { callGeminiAI } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import Swal from 'sweetalert2';

interface AICreatorProps {
  apiKey: string;
  model: string;
}

type Step = 'idea' | 'script' | 'design' | 'final';

export default function AICreator({ apiKey, model }: AICreatorProps) {
  const [step, setStep] = useState<Step>('idea');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'poster' | 'video' | 'infographic'>('poster');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    suggestions?: string;
    script?: string;
    designNotes?: string;
  }>({});

  const generateSuggestions = async () => {
    if (!topic) return;
    setLoading(true);
    const prompt = `
      Bạn là một chuyên gia marketing hàng đầu. Tôi có ý tưởng: "${topic}".
      Hãy gợi ý 3 mẫu kịch bản hoặc ý tưởng cho ${type === 'poster' ? 'Poster' : type === 'video' ? 'Video ngắn' : 'Infographic'}.
      Yêu cầu:
      - Sáng tạo, thu hút, dễ lan truyền.
      - Phù hợp đăng tải trên Facebook, TikTok hoặc Instagram.
      - Trình bày dạng Markdown với các tiêu đề rõ ràng.
      - Ngôn ngữ: Tiếng Việt.
    `;
    
    try {
      const resp = await callGeminiAI(prompt, apiKey, model);
      if (resp) {
        setResult(prev => ({ ...prev, suggestions: resp }));
        setStep('script');
      }
    } catch (err: any) {
      Swal.fire('Lỗi', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const refineContent = async (action: 'script' | 'design') => {
    setLoading(true);
    const prompt = action === 'script' 
      ? `Dựa trên gợi ý trước, hãy viết một kịch bản chi tiết 60 giây cho video này. Bao gồm: Hook, Thân bài, Call to Action. Ý tưởng: ${topic}`
      : `Dựa trên ý tưởng: ${topic}. Hãy mô tả chi tiết thiết kế demo cho ${type}. Bao gồm: Màu sắc chủ đạo, Font chữ, Bố cục, Các thành phần hình ảnh cần thiết.`;
    
    try {
      const resp = await callGeminiAI(prompt, apiKey, model);
      if (resp) {
        if (action === 'script') setResult(prev => ({ ...prev, script: resp }));
        else setResult(prev => ({ ...prev, designNotes: resp }));
        setStep(action === 'script' ? 'design' : 'final');
      }
    } catch (err: any) {
      Swal.fire('Lỗi', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'Đã copy!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
          <Sparkles size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Xưởng sáng tạo AI</h2>
          <p className="text-slate-500">Biến ý tưởng thành kịch bản và thiết kế chuyên nghiệp trong nháy mắt.</p>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-between px-4 max-w-sm mx-auto">
        {['idea', 'script', 'design', 'final'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all",
              step === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-200"
            )}>
              {i + 1}
            </div>
            {i < 3 && <div className="flex-1 h-[2px] bg-slate-200 mx-2" />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'idea' && (
          <motion.div 
            key="idea"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 card-bento bg-white space-y-6"
          >
            <div className="space-y-4">
              <label className="block text-lg font-bold">1. Bạn muốn sáng tạo nội dung gì?</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'poster', label: 'Poster', icon: FileImage },
                  { id: 'video', label: 'Video Script', icon: FileVideo },
                  { id: 'infographic', label: 'Infographic', icon: Layout },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id as any)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                      type === t.id ? "border-primary bg-primary/5 text-primary" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <t.icon size={24} />
                    <span className="font-bold text-sm">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-bold">2. Nhập ý tưởng/chủ đề của bạn</label>
              <div className="relative">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ví dụ: Chương trình giảm giá 50% cho học sinh sinh viên nhân dịp 2/9..."
                  className="w-full h-32 p-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 transition-all resize-none outline-none"
                />
                <button
                  disabled={loading || !topic}
                  onClick={generateSuggestions}
                  className="absolute bottom-4 right-4 btn-primary flex items-center gap-2 disabled:grayscale"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Phác thảo ý tưởng
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step !== 'idea' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid lg:grid-cols-5 gap-8"
          >
            {/* Sidebar Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 card-bento bg-white space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                  <Lightbulb className="text-secondary" size={20} /> Ý tưởng ban đầu
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 text-slate-600 text-sm">
                  {topic}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {type}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    {model}
                  </span>
                </div>
                <button 
                  onClick={() => {setStep('idea'); setResult({});}}
                  className="w-full py-2 text-sm text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={14} /> Làm lại từ đầu
                </button>
              </div>

              <div className="p-6 card-bento bg-white space-y-4">
                <h4 className="font-bold">Các bước tiếp theo</h4>
                <div className="space-y-2">
                  {[
                    { id: 'script', label: 'Chi tiết kịch bản', active: !!result.suggestions },
                    { id: 'design', label: 'Mô tả thiết kế', active: !!result.script || !!result.suggestions },
                    { id: 'final', label: 'Hoàn hiện & Xuất file', active: !!result.designNotes },
                  ].map((s, i) => (
                    <button
                      key={s.id}
                      disabled={!s.active || loading}
                      onClick={() => refineContent(s.id as any)}
                      className={cn(
                        "w-full p-4 rounded-xl text-left border-2 flex items-center justify-between group transition-all",
                        step === s.id ? "border-primary bg-primary/5 text-primary" : "border-slate-100 disabled:opacity-50"
                      )}
                    >
                      <span className="font-bold text-sm">{s.label}</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="lg:col-span-3 space-y-6">
              <div className="p-8 card-bento bg-white min-h-[500px] relative prose max-w-none prose-slate">
                {loading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="font-bold text-slate-600 animate-pulse uppercase tracking-widest text-xs">AI đang suy nghĩ...</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-6 not-prose">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900 border-l-4 border-primary pl-4">
                    {step === 'script' ? 'Gợi ý ý tưởng' : step === 'design' ? 'Kịch bản chi tiết' : 'Mô tả thiết kế'}
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(result.suggestions || '')}
                      className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      <Copy size={18} />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                <div className="markdown-content">
                  <ReactMarkdown>
                    {step === 'script' ? result.suggestions || '' : step === 'design' ? result.script || '' : result.designNotes || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
