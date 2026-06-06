import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { OfficeLocation } from '../../config/booking';

interface OfficeCardProps {
  office: OfficeLocation;
  isSelected: boolean;
  onSelect: () => void;
}

export function OfficeCard({ office, isSelected, onSelect }: OfficeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full ${
        isSelected 
          ? 'bg-[var(--color-ares-charcoal)] border-[var(--color-ares-teal)] shadow-[0_0_30px_rgba(41,152,170,0.15)]' 
          : 'bg-[var(--color-ares-charcoal)]/60 border-[var(--color-ares-border)] hover:border-white/30 hover:bg-[var(--color-ares-charcoal)]/80'
      }`}
      onClick={onSelect}
    >
      {/* Active Indicator Line */}
      <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-500 ${isSelected ? 'bg-[var(--color-ares-teal)]' : 'bg-transparent'}`} />

      <div className="p-5 sm:p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[var(--color-ares-purple)]/20 flex items-center justify-center shrink-0">
            <MapPin className={`h-5 w-5 sm:h-6 sm:w-6 ${isSelected ? 'text-[var(--color-ares-teal)]' : 'text-white/60'}`} />
          </div>
          {office.badge && (
            <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-1 rounded-full bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border border-[var(--color-ares-teal)]/20 text-center leading-tight">
              <ShieldCheck className="w-3 h-3 mr-1 shrink-0" />
              {office.badge}
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-tight">{office.name}</h3>
        <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-grow">
          {office.description}
        </p>

        {office.address && (
          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            <div className="flex items-start text-xs sm:text-sm text-white/70">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 mt-0.5 text-white/40 shrink-0" />
              <span>{office.address}</span>
            </div>
          </div>
        )}
        {!office.address && <div className="mb-6 sm:mb-8" />}

        <button 
          className={`w-full py-3 px-4 rounded-lg font-medium tracking-wide flex items-center justify-center transition-all duration-300 ${
            isSelected 
              ? 'bg-[var(--color-ares-teal)] text-white shadow-lg shadow-[var(--color-ares-teal)]/20' 
              : 'bg-white/5 text-white hover:bg-white/10'
          }`}
        >
          {isSelected ? 'Selected' : 'Book Here'}
          {!isSelected && <ArrowRight className="w-4 h-4 ml-2" />}
        </button>
      </div>
    </motion.div>
  );
}
