import React from 'react';
import { X, PhoneCall, ShieldAlert, LifeBuoy, ExternalLink } from 'lucide-react';
import { EMERGENCY_CONTACTS, TRANSIT_STATIONS } from '../data/transitData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[#0f141e] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Transit Emergency & Inquiries</h2>
              <p className="text-xs text-slate-400 font-sinhala">
                ශ්‍රී ලංකා ප්‍රවාහන හදිසි දුරකථන අංක
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of hotlines */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              National Transport Hotlines
            </span>
            {EMERGENCY_CONTACTS.map((contact, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="font-semibold text-sm text-slate-100">{contact.name}</div>
                  <div className="text-xs text-slate-400">{contact.desc}</div>
                </div>

                <a
                  href={`tel:${contact.number.split('/')[0].replace(/\s+/g, '')}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/50 font-mono text-xs font-bold transition-colors shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{contact.number}</span>
                </a>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Terminal Control Desks
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TRANSIT_STATIONS.map((st) => (
                <div key={st.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="font-semibold text-slate-200">{st.shortName}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{st.openHours}</div>
                  <a
                    href={`tel:${st.hotline.replace(/\s+/g, '')}`}
                    className="text-[#0A84FF] hover:underline font-mono font-medium block mt-1.5"
                  >
                    📞 {st.hotline}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
