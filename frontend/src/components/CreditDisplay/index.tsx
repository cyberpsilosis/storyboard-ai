import { useCredits } from '@/contexts/credits-context';

export const CreditDisplay = () => {
  const { togetherCredits, perplexityCredits } = useCredits();

  return (
    <div className="inline-flex items-center justify-center gap-2 perspective-[2000px] absolute left-1/2 -translate-x-1/2 mt-2 animate-float">
      <div className="relative w-24 h-20 bg-black rounded-lg border border-[#1a1a1a] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-2 flex flex-col gap-1.5 p-1.5">
          <div className="flex flex-col items-center justify-center h-1/2 border border-[#66ff66]/20 rounded-md bg-black/50 shadow-inner">
            <span className="text-[11px] font-mono text-[#66ff66]/70 tracking-wide">PLX</span>
            <span className="text-sm font-bold text-[#66ff66] drop-shadow-[0_0_2px_rgba(102,255,102,0.3)]">
              ${perplexityCredits !== null ? (perplexityCredits / 100).toFixed(2) : '-.--'}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center h-1/2 border border-[#66ff66]/20 rounded-md bg-black/50 shadow-inner">
            <span className="text-[11px] font-mono text-[#66ff66]/70 tracking-wide">FLUX</span>
            <span className="text-sm font-bold text-[#66ff66] drop-shadow-[0_0_2px_rgba(102,255,102,0.3)]">
              ${togetherCredits?.image !== undefined ? (togetherCredits.image / 100).toFixed(2) : '-.--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 