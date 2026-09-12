"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, Dna, Cpu } from "lucide-react";

interface RiskBreakdown {
  affected: number;
  carrier: number;
  normal: number;
}

interface Partner {
  status: string;
  mutation_name?: string | null;
}

interface RiskDashboardProps {
  partnerA: Partner;
  partnerB: Partner;
  risk: RiskBreakdown;
  explanation: string;
}

export default function RiskDashboard({ partnerA, partnerB, risk, explanation }: RiskDashboardProps) {
  const data = [
    { name: "Affected", value: risk.affected, color: "#f43f5e" }, 
    { name: "Carrier", value: risk.carrier, color: "#f59e0b" },  
    { name: "Normal", value: risk.normal, color: "#0ea5e9" },    
  ].filter(d => d.value > 0);

  return (
    <div className="glass-panel rounded-3xl overflow-hidden relative">
      {/* Top Bar */}
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="font-bold text-xl flex items-center gap-3 text-white tracking-wide">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Cpu className="w-5 h-5 text-teal-400" />
          </div>
          Couple Risk Analysis
        </h2>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Computation Complete</span>
        </div>
      </div>
      
      <div className="p-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center lg:border-r border-slate-700/50 pr-0 lg:pr-8">
          <div className="h-72 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-teal-500/5 to-transparent rounded-full blur-3xl"></div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:opacity-80 outline-none transition-all" 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Probability']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '500' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-teal-900/30 p-6 rounded-2xl border border-teal-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 shadow-[0_0_10px_#14b8a6]"></div>
            <h4 className="font-bold text-teal-300 mb-3 flex items-center gap-2 tracking-wide uppercase text-sm">
              <AlertCircle className="w-5 h-5" />
              Clinical Explanation
            </h4>
            <p className="text-sm text-teal-50 leading-relaxed font-medium">
              {explanation}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
                <Dna className="w-24 h-24 text-slate-100" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-slate-700 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">A</span>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Partner A</span>
              </div>
              <p className={`font-bold text-2xl ${partnerA.status === 'Normal' ? 'text-sky-400' : 'text-amber-400'}`}>
                {partnerA.status}
              </p>
              {partnerA.mutation_name && (
                <div className="mt-3 inline-flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <p className="text-xs text-slate-300 font-mono font-medium truncate">{partnerA.mutation_name}</p>
                </div>
              )}
            </div>
            
            <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
                <Dna className="w-24 h-24 text-slate-100" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-slate-700 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">B</span>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Partner B</span>
              </div>
              <p className={`font-bold text-2xl ${partnerB.status === 'Normal' ? 'text-sky-400' : 'text-amber-400'}`}>
                {partnerB.status}
              </p>
              {partnerB.mutation_name && (
                <div className="mt-3 inline-flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <p className="text-xs text-slate-300 font-mono font-medium truncate">{partnerB.mutation_name}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-[11px] font-medium text-slate-500 mt-auto bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 uppercase tracking-wider">
            <span className="text-rose-500 font-bold mr-2 text-sm">*</span> 
            GenoMatch is an educational decision-support tool. Not a diagnostic device. All results must be confirmed by a certified genetic counselor.
          </div>
        </div>
      </div>
    </div>
  );
}
