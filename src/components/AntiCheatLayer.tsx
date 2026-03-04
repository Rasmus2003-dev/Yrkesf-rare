import React, { useEffect, useState } from 'react';
import { AlertTriangle, EyeOff } from 'lucide-react';

interface AntiCheatLayerProps {
  children: React.ReactNode;
  isActive: boolean;
}

export default function AntiCheatLayer({ children, isActive }: AntiCheatLayerProps) {
  const [violationCount, setViolationCount] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // 1. Prevent Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning("Högerklick är inaktiverat under provet.");
    };

    // 2. Prevent Copy/Cut/Paste
    const handleCopyCutPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      showWarning("Kopiering är inte tillåten.");
    };

    // 3. Prevent Keyboard Shortcuts (PrintScreen, Ctrl+C, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen (often doesn't fire in modern browsers, but good to have)
      if (e.key === 'PrintScreen') {
        setIsBlurred(true);
        showWarning("Skärmdump upptäckt! Detta loggas.");
        setTimeout(() => setIsBlurred(false), 2000);
      }

      // Ctrl+C, Ctrl+Shift+I (DevTools), Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && ['c', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        showWarning("Kortkommandon är inaktiverade.");
      }
      
      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };

    // 4. Visibility Change (Tab Switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationCount(prev => prev + 1);
        setIsBlurred(true);
      } else {
        // Keep blurred for a moment to discourage quick switching
        setTimeout(() => setIsBlurred(false), 1000);
        showWarning("Du lämnade provfönstret! Detta har noterats.");
      }
    };

    // Add Event Listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyCutPaste);
      document.removeEventListener('cut', handleCopyCutPaste);
      document.removeEventListener('paste', handleCopyCutPaste);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive]);

  const showWarning = (msg: string) => {
    setWarningMessage(msg);
    setTimeout(() => setWarningMessage(null), 3000);
  };

  return (
    <div className="relative w-full h-full select-none" onContextMenu={(e) => e.preventDefault()}>
      {/* Content */}
      <div className={`transition-all duration-300 ${isBlurred ? 'blur-xl opacity-50' : ''}`}>
        {children}
      </div>

      {/* Warning Toast */}
      {warningMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold">{warningMessage}</span>
        </div>
      )}

      {/* Blur Overlay Message */}
      {isBlurred && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center p-8 bg-white rounded-2xl shadow-2xl border border-red-100 max-w-md">
            <EyeOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Säkerhetsläge Aktivt</h3>
            <p className="text-slate-600">
              Vänligen stanna i provfönstret. Misstänkt aktivitet loggas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
