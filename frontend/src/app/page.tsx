"use client";
import { useState } from "react";
import axios from "axios";
import { Dna, Activity, ArrowRight, ShieldCheck, Database, Zap } from "lucide-react";
import Uploader from "@/components/Uploader";
import SequenceViewer from "@/components/SequenceViewer";
import RiskDashboard from "@/components/RiskDashboard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Home() {
  const [partnerA, setPartnerA] = useState<any>(null);
  const [partnerB, setPartnerB] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSequenceUpload = async (sequence: string, partner: "A" | "B") => {
    try {
      setLoading(true);
      setError("");
      
      const res = await axios.post(`${API_BASE}/analyze`, { sequence });
      
      if (partner === "A") setPartnerA(res.data);
      else setPartnerB(res.data);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateRisk = async () => {
    if (!partnerA || !partnerB) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/couple-risk`, {
        partnerA: partnerA.genotype,
        partnerB: partnerB.genotype
      });
      setRiskData(res.data);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = async () => {
    const seqA = ">PartnerA_Sickle_Carrier\nATGGTGCACCTGACTCCTGTGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTTGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCAGTTATGGGGAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGGCTCCTGGGCAACGTGCTAGTCTGTGTGCTGGCCCATCACTTTGGCAAAGAATTCACCCCACCAGTGCAGGCTGCCTATCAGAAAGTGGTGGCTGGTGTGGCTAATGCCCTGGCCCACAAGTATCACTAA";
    const seqB = ">PartnerB_Normal\nATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTTGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCAGTTATGGGGAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGGCTCCTGGGCAACGTGCTAGTCTGTGTGCTGGCCCATCACTTTGGCAAAGAATTCACCCCACCAGTGCAGGCTGCCTATCAGAAAGTGGTGGCTGGTGTGGCTAATGCCCTGGCCCACAAGTATCACTAA";
    
    await handleSequenceUpload(seqA, "A");
    await handleSequenceUpload(seqB, "B");
  };

  return (
    <div className="min-h-screen selection:bg-teal-500/30 font-sans text-slate-300">
      
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b-0 border-slate-700/50 py-4 px-6 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-2 rounded-xl text-slate-900 shadow-[0_0_20px_rgba(45,212,191,0.4)]">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight leading-none">
              GenoMatch
            </h1>
            <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-1">AI Genotyping Engine</p>
          </div>
        </div>
        <button 
          onClick={loadDemoData}
          className="group relative inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-teal-500/50 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative z-10 flex items-center gap-2">
            Load Synthetic Data
            <Zap className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </span>
        </button>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-900/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in-up">
          <Database className="w-3 h-3" />
          Powered by ClinVar & HbVar
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight animate-fade-in-up" style={{animationDelay: '100ms'}}>
          Reproductive Risk <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-500">
             Precision Intelligence
          </span>
        </h2>
        
        <p className="text-lg text-slate-400 max-w-2xl font-light leading-relaxed animate-fade-in-up" style={{animationDelay: '200ms'}}>
          Upload genomic FASTA sequences to instantly align against the HBB reference gene, classify variants, and compute Mendelian offspring risk with absolute deterministic accuracy.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24 flex flex-col gap-12 relative z-10">
        
        {error && (
          <div className="glass-panel border-rose-500/30 text-rose-300 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
            <ShieldCheck className="w-6 h-6 text-rose-500 flex-shrink-0" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Uploaders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          <div className="animate-fade-in-up" style={{animationDelay: '300ms'}}>
            <Uploader title="Partner A Allele" partner="A" onSequenceLoaded={(seq) => handleSequenceUpload(seq, "A")} isLoaded={!!partnerA} />
          </div>
          
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-slate-900 p-4 rounded-full shadow-[0_0_30px_rgba(45,212,191,0.3)] border border-slate-700 text-teal-400">
            <Dna className="w-8 h-8 animate-spin-slow" />
          </div>

          <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
            <Uploader title="Partner B Allele" partner="B" onSequenceLoaded={(seq) => handleSequenceUpload(seq, "B")} isLoaded={!!partnerB} />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-teal-400">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
              <Activity className="absolute inset-0 m-auto w-8 h-8 animate-pulse-slow text-teal-300" />
            </div>
            <p className="mt-6 font-semibold tracking-widest uppercase text-sm animate-pulse text-teal-500">Processing Genomic Data...</p>
          </div>
        )}

        {/* Sequence Viewers */}
        <div className="space-y-12">
          {partnerA && !loading && (
            <div className="animate-slide-up">
              <SequenceViewer alignment={partnerA.alignment} title="Partner A" genotype={partnerA.genotype} />
            </div>
          )}

          {partnerB && !loading && (
            <div className="animate-slide-up" style={{animationDelay: "150ms"}}>
              <SequenceViewer alignment={partnerB.alignment} title="Partner B" genotype={partnerB.genotype} />
            </div>
          )}
        </div>

        {/* Action Button */}
        {partnerA && partnerB && !riskData && !loading && (
          <div className="flex justify-center pt-12 pb-8 animate-fade-in">
            <button 
              onClick={calculateRisk}
              className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-700 rounded-full hover:from-teal-500 hover:to-cyan-600 shadow-[0_0_40px_rgba(13,148,136,0.5)] transition-all hover:scale-105"
            >
              <span className="flex items-center gap-3 text-lg">
                <Activity className="w-6 h-6 animate-pulse" />
                Compute Mendelian Risk Engine
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>
        )}

        {/* Risk Dashboard */}
        {riskData && !loading && (
          <div className="mt-8 animate-slide-up">
            <RiskDashboard 
              partnerA={partnerA.genotype} 
              partnerB={partnerB.genotype}
              risk={riskData.riskBreakdown}
              explanation={riskData.explanation}
            />
          </div>
        )}
      </main>
    </div>
  );
}
