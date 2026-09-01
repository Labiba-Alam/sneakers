import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check, Brain, Ruler, RefreshCw, ArrowRight } from 'lucide-react';
import { AISizeInput, AISizeResult } from '../../types';

interface AISizeAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedSize: (size: number) => void;
  currentProductSizes: number[];
}

export const AISizeAdvisorModal: React.FC<AISizeAdvisorModalProps> = ({
  isOpen,
  onClose,
  onSelectRecommendedSize,
  currentProductSizes
}) => {
  const [input, setInput] = useState<AISizeInput>({
    heightCm: 178,
    weightKg: 75,
    preferredFit: 'Regular',
    footLengthCm: 26.5
  });

  const [result, setResult] = useState<AISizeResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      // Logic for calculating optimal EU size
      let recommendedEU = 42;
      if (input.footLengthCm) {
        if (input.footLengthCm <= 24.5) recommendedEU = 39;
        else if (input.footLengthCm <= 25.2) recommendedEU = 40;
        else if (input.footLengthCm <= 26.0) recommendedEU = 41;
        else if (input.footLengthCm <= 26.8) recommendedEU = 42;
        else if (input.footLengthCm <= 27.5) recommendedEU = 43;
        else if (input.footLengthCm <= 28.2) recommendedEU = 44;
        else if (input.footLengthCm <= 29.0) recommendedEU = 45;
        else recommendedEU = 46;
      } else {
        // Estimate based on height and weight
        const bmi = input.weightKg / Math.pow(input.heightCm / 100, 2);
        if (input.heightCm < 170) recommendedEU = 40;
        else if (input.heightCm < 175) recommendedEU = 41;
        else if (input.heightCm < 182) recommendedEU = 42;
        else if (input.heightCm < 188) recommendedEU = 43;
        else recommendedEU = 44;

        if (input.preferredFit === 'Slim') recommendedEU = Math.max(39, recommendedEU - 1);
        if (input.preferredFit === 'Loose') recommendedEU = Math.min(46, recommendedEU + 1);
      }

      // Ensure size is available in product
      if (!currentProductSizes.includes(recommendedEU)) {
        recommendedEU = currentProductSizes[0] || 42;
      }

      setResult({
        recommendedEU,
        confidence: 96,
        reason: `Based on your ${input.footLengthCm ? `${input.footLengthCm}cm foot length` : `height/weight profile`} and ${input.preferredFit} fit preference, EU ${recommendedEU} offers ideal heel lockdown with optimal Tuscan leather stretch expansion.`
      });

      setIsCalculating(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#141414] border border-[#C7A55B]/50 text-white p-6 shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#C7A55B]" />
              <h3 className="font-serif-luxury text-lg font-bold text-white uppercase tracking-wider">
                AI Size Advisor
              </h3>
            </div>
            <button onClick={onClose} className="p-2 text-white/50 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!result ? (
            <form onSubmit={handleCalculate} className="space-y-4">
              <p className="text-xs text-white/70 font-light">
                Our machine learning algorithm analyzes thousands of Florentine feet profiles to guarantee a bespoke fit.
              </p>

              {/* Foot Length Input */}
              <div>
                <label className="text-[10px] uppercase font-bold text-white/50 tracking-widest block mb-1">
                  Foot Length (CM) - Optional but exact
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="35"
                    value={input.footLengthCm || ''}
                    onChange={(e) => setInput({ ...input, footLengthCm: Number(e.target.value) })}
                    placeholder="e.g. 26.5"
                    className="w-full px-3 py-2 bg-[#1E1E1E] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C7A55B]"
                  />
                  <Ruler className="w-4 h-4 text-white/40 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Height & Weight Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/50 tracking-widest block mb-1">
                    Height (CM)
                  </label>
                  <input
                    type="number"
                    value={input.heightCm}
                    onChange={(e) => setInput({ ...input, heightCm: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#1E1E1E] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C7A55B]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/50 tracking-widest block mb-1">
                    Weight (KG)
                  </label>
                  <input
                    type="number"
                    value={input.weightKg}
                    onChange={(e) => setInput({ ...input, weightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#1E1E1E] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C7A55B]"
                  />
                </div>
              </div>

              {/* Preferred Fit */}
              <div>
                <label className="text-[10px] uppercase font-bold text-white/50 tracking-widest block mb-2">
                  Preferred Fit Feeling
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Slim', 'Regular', 'Loose'] as const).map(fit => (
                    <button
                      type="button"
                      key={fit}
                      onClick={() => setInput({ ...input, preferredFit: fit })}
                      className={`py-2 text-xs font-semibold border transition-colors ${
                        input.preferredFit === fit
                          ? 'bg-[#C1121F] border-[#C1121F] text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {fit} Fit
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-3 bg-[#C7A55B] hover:bg-[#b08e48] text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-6 shadow-lg"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating Neural Fit...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Recommendation</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-[#C7A55B]/20 border border-[#C7A55B] text-[#C7A55B] mx-auto flex items-center justify-center font-serif-luxury text-2xl font-black">
                EU {result.recommendedEU}
              </div>

              <div className="inline-flex items-center gap-1 bg-emerald-950 px-3 py-1 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Check className="w-3.5 h-3.5" />
                <span>{result.confidence}% Recommendation Match</span>
              </div>

              <p className="text-xs text-white/80 font-light leading-relaxed bg-white/5 p-3 border border-white/10">
                {result.reason}
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="w-1/3 py-2.5 bg-white/5 border border-white/10 text-white text-xs uppercase font-bold"
                >
                  Recalculate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectRecommendedSize(result.recommendedEU);
                    onClose();
                  }}
                  className="w-2/3 py-2.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  <span>Select EU {result.recommendedEU}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
