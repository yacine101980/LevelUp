import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, Trophy } from 'lucide-react';

export default function CelebrationToast({ message, habitName, goalTitle, onClose, visible }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-close après 4 secondes
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 transform transition-all duration-500">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-6 max-w-sm transform transition-all duration-300 hover:scale-105">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-6 h-6 text-white animate-bounce" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <h3 className="font-bold text-lg">Bravo ! 🎉</h3>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              {message || (habitName ? `Vous avez complété "${habitName}" aujourd'hui !` : goalTitle ? `Félicitations ! Vous avez terminé "${goalTitle}" ! 🎊` : 'Félicitations !')}
            </p>
            <p className="text-white/80 text-xs mt-2 italic">
              {goalTitle ? 'Vous avez accompli quelque chose de formidable ! 🌟' : 'Continuez comme ça, vous êtes sur la bonne voie ! 💪'}
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
          <span className="text-xs text-white/90">
            {goalTitle ? 'Objectif terminé avec succès' : 'Habitude complétée avec succès'}
          </span>
        </div>
      </div>
    </div>
  );
}

