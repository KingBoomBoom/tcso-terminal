"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw, BarChart2, Send, Crosshair, Radio, AlertTriangle } from 'lucide-react';

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [quantData, setQuantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [prices, setPrices] = useState({ BTC: "...", ETH: "...", SOL: "..." });
  const [displayScore, setDisplayScore] = useState<string | number>(50);
  const [isIdle, setIsIdle] = useState(false);

  const API_URL = "/api/oracle";

  const fetchOracleData = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      let fetchedData = Array.isArray(json) ? json : (json.live_feed || []);
      setData(fetchedData);
      if (!Array.isArray(json)) setQuantData(json.quant_lab || null);
      if (fetchedData.length > 0 && fetchedData[0].timestamp) {
        const lastTime = new Date(fetchedData[0].timestamp).getTime();
        setIsIdle((new Date().getTime() - lastTime) > 43200000);
      }
      setCountdown(60);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
      const data = await res.json();
      if (data && Array.isArray(data)) {
        setPrices({
          BTC: parseFloat(data.find((d: any) => d.symbol === 'BTCUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 1}),
          ETH: parseFloat(data.find((d: any) => d.symbol === 'ETHUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2}),
          SOL: parseFloat(data.find((d: any) => d.symbol === 'SOLUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2})
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchOracleData(); fetchPrices();
    const t1 = setInterval(fetchOracleData, 60000);
    const t2 = setInterval(fetchPrices, 10000);
    const t3 = setInterval(() => setCountdown(p => p > 0 ? p - 1 : 0), 1000);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); };
  }, []);

  useEffect(() => {
    const baseScore = data[0]?.analysis?.tci_score || 50;
    if (baseScore === 50) {
      const breathe = setInterval(() => {
        setDisplayScore((50 + (Math.random() * 0.4 - 0.2)).toFixed(1));
      }, 3000);
      return () => clearInterval(breathe);
    } else { setDisplayScore(baseScore); }
  }, [data]);

  if (loading) return (
    <div className="bg-[#0B0E14] text-blue-500 h-screen flex flex-col items-center justify-center font-mono text-sm tracking-widest text-center">
      <Terminal size={40} className="mb-6 animate-pulse mx-auto" />
      <div className="space-y-2 opacity-80 text-zinc-400">
        <p>{">"} INITIALIZING_QUANT_CORE...</p>
        <p>{">"} AGGREGATING_MARKET_SENTIMENT...</p>
      </div>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [] };
  const getTciStatus = (s: number) => {
    if (s < 45) return { text: "空头主导", color: "text-red-500" };
    if (s <= 55) return { text: "流动性观望", color: "text-amber-400" };
    return { text: "多头共识", color: "text-emerald-400" };
  };
  const tciStatus = getTciStatus(analysis.tci_score);

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-300 font-mono p-3 md:p-6 selection:bg-blue-500/30 pb-20">
      <div className="border-b border-zinc-800 pb-3 mb-5 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center"><Activity className="text-white" size={18} /></div>
          <div><h1 className="text-lg font-bold text-zinc-100 tracking-tighter">TCSO_TERMINAL</h1><p className="text-[9px] text-zinc-500 uppercase tracking-widest">Algorithmic Sentiment Engine v3</p></div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <div className="text-[9px] text-zinc-500 uppercase flex items-center gap-1.5"><RefreshCw size={8}/> SYNC: {countdown}s</div>
          {isIdle ? (
            <div className="text-amber-500 flex items-center gap-1 text-[9px] font-bold bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/30 animate-pulse"><AlertTriangle size={8}/> IDLE</div>
          ) : (
            <div className="text-emerald-400 flex items-center gap-1 text-[9px] font-bold bg-emerald-400/10 px-1.5 py-0.5 border border-emerald-400/20"><Shield size={8}/> LIVE</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          <div className="bg-[#0B0E14] border border-zinc-800 p-5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="flex-1">
              <h2 className="text-[10px] uppercase text-zinc-500 mb-2 tracking-widest font-semibold flex items-center gap-2"><Crosshair size={12} className="text-blue-500"/> TCI INDEX</h2>
              <div className="flex items-baseline gap-4">
                <span className={`text-6xl font-black ${tciStatus.color} tracking-tighter tabular-nums`}>{displayScore}</span>
                <span className={`uppercase font-bold text-sm ${tciStatus.color}`}>{tciStatus.text}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-[240px]">
              <div className="bg-zinc-900/50 border border-zinc-800/80 p-3"><div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Confidence</div><div className="text-sm text-zinc-300">{analysis.tci_score === 50 ? "45.0%" : "87.5%"}</div></div>
              <div className="bg-zinc-900/50 border border-zinc-800/80 p-3"><div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Volatility</div><div className="text-sm text-zinc-300">4.2%</div></div>
              <div className="col-span-2 bg-zinc-900/50 border border-zinc-800/80 p-2 flex justify-between items-center text-[10px]"><span className="text-zinc-500 uppercase">LATEST_PING:</span><span className={isIdle ? 'text-amber-400' : 'text-zinc-400'}>{latest.timestamp}</span></div>
            </div>
          </div>

          <div className="bg-[#0B0E14] border border-zinc-800 p-4 h-56">
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[...data].reverse()}>
                  <defs><linearGradient id="colorTci" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="1 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={[0, 100]} stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#0B0E14', border: '1px solid #27272a', fontSize: '11px'}} />
                  <Line type="step" dataKey={() => 50} stroke="#3f3f46" strokeDasharray="2 2" dot={false} />
                  <Area type="monotone" dataKey="analysis.tci_score" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTci)" />
                </ComposedChart>
             </ResponsiveContainer>
          </div>

          <div className="bg-[#0B0E14] border border-zinc-800 p-4 flex-1">
            <h3 className="text-[10px] uppercase text-zinc-500 flex items-center gap-2 font-bold tracking-widest border-b border-zinc-800 pb-2 mb-3"><Terminal size={12} className="text-blue-500"/> SYS_LOG</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {data.map((item, idx) => (
                <div key={idx} className="border-l-2 border-zinc-800 hover:border-blue-500 pl-3 py-2 bg-zinc-900/20 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5"><span className="text-[9px] text-zinc-600 font-mono">[{item.timestamp?.split(' ')[1] || ""}]</span><span className="text-[9px] text-blue-400 border border-blue-900 px-1 uppercase">{item.analysis?.event_type}</span></div>
                  {/* 🚀 修复点：使用转义字符渲染 > */}
                  <p className="text-xs text-zinc-300 font-mono mb-2 line-clamp-2 leading-relaxed">{">"} {item.raw_text}</p>
                  <div className="flex flex-wrap gap-x-4 text-[9px] text-zinc-500 font-mono"><span>MACRO: {item.analysis?.macro_impact}</span><span>CRYPTO: {item.analysis?.crypto_impact}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <div className="bg-[#0B0E14] border border-zinc-800 p-5">
            <h3 className="text-[10px] text-zinc-500 mb-4 flex items-center gap-2 font-bold uppercase"><TrendingUp size={12}/> Asset Matrix</h3>
            <div className="space-y-4">
              <div><div className="text-[9px] text-emerald-500 uppercase mb-2 font-bold">流入 / LONG</div>
                <div className="flex flex-wrap gap-1.5">{(analysis.bullish_assets || []).map((a: string) => <span key={a} className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 text-[9px]">{a}</span>)}</div>
              </div>
              <div className="pt-4 border-t border-zinc-800/50"><div className="text-[9px] text-red-500 uppercase mb-2 font-bold">流出 / SHORT</div>
                <div className="flex flex-wrap gap-1.5">{(analysis.bearish_assets || []).map((a: string) => <span key={a} className="bg-red-950/30 text-red-400 border border-red-900/50 px-2 py-0.5 text-[9px]">{a}</span>)}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0B0E14] border border-zinc-800 p-5">
            <h3 className="text-[10px] text-zinc-500 mb-3 uppercase font-bold tracking-widest"><BarChart2 size={12}/> Liquidity</h3>
            <div className="space-y-1">
              {['BTC', 'ETH', 'SOL'].map((coin) => (
                <div key={coin} className="flex justify-between items-center py-2 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/20 px-1">
                  <span className="text-[11px] font-bold text-zinc-400">{coin}/USDT</span>
                  <span className="text-[13px] font-mono text-zinc-200">{prices[coin as keyof typeof prices]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0B0E14] border border-purple-900/30 flex-1 flex flex-col relative group">
            <div className="p-5 border-b border-purple-900/20 bg-purple-950/5"><h3 className="text-[10px] uppercase text-purple-400 mb-1 font-bold tracking-widest"><Microscope size={12} /> QUANT_LAB</h3><div className="flex justify-between text-[9px] text-zinc-600 font-mono"><span>DEEPSEEK_V3</span><span>{quantData?.date}</span></div></div>
            <div className="p-5 flex-1 text-[11px] text-zinc-300 leading-relaxed font-mono"><span className="text-purple-500 font-bold mr-2">SYS></span>{quantData?.content}</div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/20"><a href="https://t.me/trumpMonitor1" target="_blank" className="flex items-center justify-between w-full bg-blue-600 text-white px-4 py-2.5 text-[10px] font-bold uppercase"><div className="flex items-center gap-2"><Send size={12}/> 订阅预警</div><ArrowRightCircle size={12}/></a></div>
          </div>
        </div>
      </div>
      <Analytics />
      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: #0B0E14; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }`}} />
    </div>
  );
}
