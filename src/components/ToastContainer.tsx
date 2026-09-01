import React from 'react';
import { useStore } from '../context/StoreContext';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-[#181818]/90 border-[#C1121F]/40 text-[#F8F8F8]'
                : toast.type === 'error'
                ? 'bg-[#181818]/90 border-red-500/50 text-red-200'
                : 'bg-[#181818]/90 border-[#C7A55B]/40 text-[#C7A55B]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#C1121F] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#C7A55B] shrink-0" />}
            
            <p className="text-xs font-medium tracking-wide leading-snug">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
