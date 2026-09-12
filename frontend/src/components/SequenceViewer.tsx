"use client";
import { GitCommit } from "lucide-react";

interface AlignmentViz {
  pos: number;
  ref: string;
  up: string;
}

interface GenotypeInfo {
  status: string;
  mutation_name?: string | null;
}

interface SequenceViewerProps {
  alignment: AlignmentViz[];
  title: string;
  genotype?: GenotypeInfo;
}

export default function SequenceViewer({ alignment, title, genotype }: SequenceViewerProps) {
  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col group">
      
      <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500/10 p-2 rounded-lg">
            <GitCommit className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-wide">{title} Alignment</h3>
            {genotype && (
              <p className={`text-xs font-semibold mt-1 uppercase tracking-widest ${genotype.status === 'Normal' ? 'text-sky-400' : 'text-amber-400'}`}>
                {genotype.status} {genotype.mutation_name ? `// ${genotype.mutation_name}` : ''}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-3 h-3 bg-rose-500/20 border border-rose-500/50 rounded-sm block shadow-[0_0_8px_rgba(244,63,94,0.3)]"></span> 
            Mismatch
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-3 h-3 bg-amber-500/20 border border-amber-500/50 rounded-sm block shadow-[0_0_8px_rgba(245,158,11,0.3)]"></span> 
            Indel
          </div>
        </div>
      </div>
      
      <div className="p-6 overflow-x-auto custom-scrollbar bg-slate-900/40 relative">
        <div className="inline-block min-w-max bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50 shadow-inner">
          <div className="flex font-mono text-sm mb-3 items-center">
            <span className="w-28 font-bold text-slate-500 shrink-0 tracking-widest text-[10px] uppercase">Reference</span>
            {alignment.map((a, i) => (
              <span key={`ref-${i}`} className="w-6 text-center inline-block text-slate-400 font-medium">
                {a.ref}
              </span>
            ))}
          </div>
          
          <div className="flex font-mono text-sm items-center">
            <span className="w-28 font-bold text-teal-400 shrink-0 tracking-widest text-[10px] uppercase">Uploaded</span>
            {alignment.map((a, i) => {
              const isMismatch = a.ref !== "-" && a.up !== "-" && a.ref !== a.up;
              const isGap = a.ref === "-" || a.up === "-";
              
              let bg = "text-white";
              if (isMismatch) bg = "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/50 rounded-md shadow-[0_0_10px_rgba(244,63,94,0.2)]";
              else if (isGap) bg = "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50 rounded-md shadow-[0_0_10px_rgba(245,158,11,0.2)]";
              
              return (
                <span key={`up-${i}`} className={`w-6 h-7 leading-7 text-center inline-block transition-colors cursor-default hover:bg-slate-700 rounded-sm ${bg}`}>
                  {a.up}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
