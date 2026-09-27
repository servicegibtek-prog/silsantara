import React, { useState } from 'react';
import { X, HelpCircle, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import { CULTURAL_INTERVIEW_QUESTIONS, InterviewPrompt } from '../../services/aiService';

interface InterviewAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterviewAssistantModal: React.FC<InterviewAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const categories = ['Semua', ...Array.from(new Set(CULTURAL_INTERVIEW_QUESTIONS.map(q => q.category)))];

  const filteredQuestions = selectedCategory === 'Semua'
    ? CULTURAL_INTERVIEW_QUESTIONS
    : CULTURAL_INTERVIEW_QUESTIONS.filter(q => q.category === selectedCategory);

  const handleCopy = (question: string, index: number) => {
    navigator.clipboard.writeText(question);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6] shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#1E3A2F]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                Panduan Wawancara Sejarah Keluarga
              </h2>
              <p className="text-xs text-[#78716C]">
                Pertanyaan terpilih untuk menggali kisah lisan dari sesepuh dan orang tua
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5 shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#1E3A2F] text-white'
                  : 'bg-[#FAF8F5] text-[#57534E] hover:bg-[#F2EFEA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions list */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredQuestions.map((q, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-3.5 hover:border-[#1E3A2F]/40 transition group"
            >
              <div className="flex items-center justify-between text-[11px] text-[#78716C] mb-1.5">
                <span className="font-medium text-[#2D5A46]">{q.category}</span>
                <span>Ditujukan untuk: {q.targetRole}</span>
              </div>
              <p className="font-serif text-sm text-[#1C1917] leading-relaxed">
                "{q.question}"
              </p>
              <div className="mt-2.5 flex justify-end">
                <button
                  onClick={() => handleCopy(q.question, idx)}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#57534E] hover:text-[#1E3A2F] transition"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Salin Pertanyaan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cultural Tip */}
        <div className="mt-4 rounded-xl bg-[#F4F8F5] p-3 text-xs text-[#2D5A46] border border-[#D5E3DA] shrink-0">
          💡 <span className="font-semibold">Tips Pewawancara:</span> Sediakan secangkir teh hangat dan biarkan sesepuh bercerita dengan tempo mereka sendiri. Rekam audio percakapan dengan izin beliau agar nada tutur asli tetap lestari.
        </div>

        <div className="mt-4 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
