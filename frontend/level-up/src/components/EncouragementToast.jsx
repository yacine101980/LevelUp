import React, { useEffect } from 'react';
import { CheckCircle2, Star, TrendingUp } from 'lucide-react';

export default function EncouragementToast({ message, stepTitle, onClose, visible }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500); // Auto-close après 3.5 secondes
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 transform transition-all duration-500">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-2xl p-6 max-w-sm transform transition-all duration-300 hover:scale-105">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Star className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-yellow-300" />
              <h3 className="font-bold text-lg">Excellent ! ⭐</h3>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              {message || `Vous avez complété "${stepTitle}" !`}
            </p>
            <p className="text-white/80 text-xs mt-2 italic">
              Continuez sur cette lancée ! 🚀
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span className="text-xs text-white/90">Étape complétée avec succès</span>
        </div>
      </div>
    </div>
  );
}

