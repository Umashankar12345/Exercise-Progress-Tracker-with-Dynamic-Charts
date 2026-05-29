import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented via browser cookies
    const cookies = document.cookie.split(';');
    const hasConsented = cookies.some(c => c.trim().startsWith('cookie_consent=true'));
    const hasDeclined = sessionStorage.getItem('cookie_consent_declined');
    
    if (!hasConsented && !hasDeclined) {
      // Small delay for a better cinematic entrance UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Set an actual HTTP cookie valid for 1 year
    document.cookie = "cookie_consent=true; max-age=31536000; path=/; SameSite=Lax";
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Set for session only so they aren't bugged again this session
    sessionStorage.setItem('cookie_consent_declined', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[400px] z-[99999]"
        >
          <div className="bg-surface/95 backdrop-blur-2xl border border-outline-variant rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <button 
              onClick={handleDecline}
              className="absolute top-4 right-4 p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-colors"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="flex gap-4 items-start relative z-10 mt-1">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0 border border-primary/30 shadow-lg shadow-primary/20">
                <Cookie className="w-6 h-6 text-primary stroke-[2]" />
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-base font-black text-on-surface tracking-tight">We Value Your Privacy</h3>
                  <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed font-semibold">
                    We use strictly necessary cookies to keep your session secure, and optional cookies to personalize your AI fitness experience.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <button 
                    onClick={handleAccept}
                    className="flex-1 py-2.5 px-3 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Accept All
                  </button>
                  <button 
                    onClick={handleDecline}
                    className="flex-1 py-2.5 px-3 bg-surface-bright hover:bg-surface-container-highest text-on-surface text-[10px] font-black uppercase tracking-widest rounded-xl border border-outline-variant transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
