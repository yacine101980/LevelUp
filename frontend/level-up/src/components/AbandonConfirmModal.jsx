import React from 'react';
import { AlertTriangle, Heart } from 'lucide-react';

export default function AbandonConfirmModal({ goalTitle, onConfirm, onCancel, visible }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl max-w-md w-full shadow-2xl border-2 border-red-200 transform transition-all duration-300 scale-100">
        <div className="p-6">
          {/* Header avec icône triste */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold text-red-900 text-center mb-2">
            Vraiment abandonner ?
          </h2>

          {/* Message principal */}
          <div className="bg-white/60 rounded-xl p-4 mb-4 border border-red-200">
            <p className="text-gray-800 text-center mb-2">
              <span className="font-semibold text-red-700">"{goalTitle}"</span>
            </p>
            <p className="text-sm text-gray-700 text-center leading-relaxed">
              Tu veux vraiment abandonner ton objectif ? 😢
            </p>
            <p className="text-xs text-gray-600 text-center mt-2 italic">
              Tous tes progrès seront conservés, mais l'objectif sera marqué comme abandonné.
            </p>
          </div>

          {/* Icône cœur brisé */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            <span className="text-sm text-red-700 font-medium">
              Réfléchis-y bien...
            </span>
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium shadow-sm"
            >
              Non, je continue
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all font-medium shadow-lg"
            >
              Oui, abandonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

