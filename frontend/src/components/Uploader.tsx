"use client";
import { useState, useEffect } from "react";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";

interface UploaderProps {
  onSequenceLoaded: (sequence: string) => void;
  title: string;
  partner: "A" | "B";
  isLoaded: boolean;
}

export default function Uploader({ onSequenceLoaded, title, partner, isLoaded }: UploaderProps) {
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Sync state if demo data loads it
  useEffect(() => {
    if (!isLoaded) setText("");
  }, [isLoaded]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      onSequenceLoaded(content);
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = () => {
    if (text) onSequenceLoaded(text);
  };

  return (
    <div className="glass-panel rounded-3xl p-8 flex flex-col gap-6 h-full relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors"></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-600 text-slate-300 font-bold text-sm">
            {partner}
          </span>
          <h3 className="font-bold text-xl text-white">{title}</h3>
        </div>
        {isLoaded && <CheckCircle2 className="w-6 h-6 text-teal-400 animate-fade-in" />}
      </div>
      
      <div 
        className={`relative z-10 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
          isDragging 
            ? "border-teal-400 bg-teal-500/10" 
            : isLoaded
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-slate-600 bg-slate-800/30 hover:border-teal-500/50 hover:bg-slate-800/80"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label className="flex flex-col items-center cursor-pointer w-full">
          <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? "bg-teal-500/20" : "bg-slate-800"}`}>
            <UploadCloud className={`w-8 h-8 ${isDragging ? "text-teal-400" : "text-slate-400"}`} />
          </div>
          <span className="text-base font-semibold text-slate-200">
            {isDragging ? "Drop sequence here" : "Click or drag FASTA file"}
          </span>
          <span className="text-xs text-slate-500 mt-2 font-medium bg-slate-900/50 px-3 py-1.5 rounded-md border border-slate-700">.fasta, .fa, .txt</span>
          <input type="file" accept=".fasta,.fa,.txt" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold uppercase tracking-widest relative z-10">
        <div className="flex-1 h-px bg-slate-700"></div>
        <span>Or paste raw</span>
        <div className="flex-1 h-px bg-slate-700"></div>
      </div>

      <div className="flex flex-col gap-3 flex-1 relative z-10">
        <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Raw Sequence Data
        </label>
        <textarea
          className="w-full flex-1 min-h-[120px] bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-300 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all resize-none"
          placeholder=">Sequence_Name&#10;ATGGTGCACCTGACTCCTGTGGAGAAGTCTGCC..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className={`py-3 px-6 rounded-xl font-bold transition-all self-end mt-2 shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto ${
            isLoaded 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20" 
              : "bg-white text-slate-900 hover:bg-teal-400 disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500"
          }`}
          onClick={handleSubmit}
          disabled={!text}
        >
          {isLoaded ? "Sequence Loaded" : "Analyze Sequence"}
        </button>
      </div>
    </div>
  );
}
