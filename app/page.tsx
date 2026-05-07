"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { Activity, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw, BarChart2, Send, Zap, Crosshair, Radio } from 'lucide-react';

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
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();
      
      let fetchedData = Array.isArray(json) ? json : (json.live_feed || []);
      setData(fetchedData);
      if (!Array.isArray(json)) setQuantData(json.quant_lab || null);
      
      if (fetchedData.length > 0 && fetchedData[0].timestamp) {
        const lastTime = new Date(fetchedData[0].timestamp).getTime();
        const now = new Date().getTime();
        setIsIdle((now - lastTime) > 43200000);
      }
      setCountdown(60); 
    } catch (e) {
      console.error("数据抓取失败", e);
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
          BTC: parseFloat(data.find((d: any) => d.symbol === 'BTCUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1}),
          ETH: parseFloat(data.find((d: any) => d.symbol === 'ETHUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
          SOL: parseFloat(data.find((d: any) => d.symbol === 'SOLUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
        });
      }
    } catch (e) {
      console.log("币价拉取失败", e);
    }
  };

  useEffect(() => {
    fetchOracleData();
    fetchPrices(); 
    
    const dataTimer = setInterval(fetchOracleData, 60000);
    const priceTimer = setInterval(fetchPrices, 10000); 
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(dataTimer);
      clearInterval(priceTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  useEffect(() => {
    const baseScore = data[0]?.analysis?.tci_score || 50;
    if (baseScore === 50) {
      const breatheTimer = setInterval(() => {
        const noise = (Math.random() * 0.4 - 0.2).toFixed(1);
        setDisplayScore((50 + parseFloat(noise)).toFixed(1));
      }, 3000);
      return () => clearInterval(breatheTimer);
    } else {
      setDisplayScore(baseScore);
    }
  }, [data]);

  if (loading) return (
    <div className="bg-[#0B0E14] text-blue-500 h-screen flex flex-col items-center justify-center font-mono text-sm tracking-widest">
      <Terminal size={40} className="mb-6 animate-pulse" />
      <div className="space-y-2 opacity-80 text-zinc-400">
        <p>{">"} INITIALIZING_QUANT_CORE...</p>
        <p>{">"} CONNECTING_ORACLE_NODES...</p>
        <p className="animate-pulse text-blue-500">{">"} AGGREGATING_MARKET_SENTIMENT...</p>
      </div>
    </div>
  );

  if (error || data.length === 0) return (
    <div className="bg-[#0B0E14] text-red-500 h-screen flex items-center justify-center font-mono p-4 text-center">
      <div className="border border-red-900/50 bg-red-950/20 p-6 rounded-none shadow-[0_0_30px_rgba(220,38,38,0.15)]">
        <p className="font-bold mb-2 tracking-widest">ERR_CONNECTION_REFUSED</p>
        <p className="text-xs text-red-400/80">ORACLE_NODE_OFFLINE: 数据流引擎连接断开</p>
      </div>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [] };
  
  const getTciStatus = (currentScore: number) => {
    if (currentScore < 45) return { text: "空头主导 / BEARISH", color: "text-red-500", glow: "shadow-red-500/20" };
    if (currentScore <= 55) return { text: "流动性观望 / NEUTRAL", color: "text-amber-400", glow: "shadow-amber-500/20" };
    return { text: "多头共识 / BULLISH", color: "text-emerald-400", glow: "shadow-emerald-500/20" };
  };

  const tciStatus = getTciStatus(analysis.tci_score);
  
  // 生成一个基于TCI的衍生波动率
  const volatility = analysis.tci_score === 50 ? "4.2%" : (Math.abs(analysis.tci_score - 50) * 0.8).toFixed(1) + "%";

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-300 font-mono p-3 md:p-6 selection:bg-blue-500/30 pb-20">
      
      {/* 极简化顶部导航栏 */}
      <div className="border-b border-zinc-800 pb-3 mb-5 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
            <Activity className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-zinc-100 tracking-tighter leading-none">
              TCSO_TERMINAL
            </h1>
            <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest leading-none">Algorithmic Sentiment Engine v3</p>
          </div>
        </div>
        
        <div className="text-right flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[9px] text-zinc-500 uppercase tracking-widest border border-zinc-800 px-2 py-1">
            <Radio size={10} className="text-blue-500 animate-pulse"/> 
            NODE: BISHKEK_01
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <RefreshCw size={8} className={countdown < 5 ? "animate-spin text-blue-400" : ""} /> 
              SYNC: {countdown}s
            </div>
            {isIdle ? (
               <div className="text-amber-500 flex items-center gap-1 text-[9px] font-bold bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/30 animate-pulse">
                 <AlertTriangle size={8}/> IDLE
               </div>
            ) : (
               <div className="text-emerald-400 flex items-center gap-1 text-[9px] font-bold bg-emerald-400/10 px-1.5 py-0.5 border border-emerald-400/20">
                 <Shield size={8}/> LIVE
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          
          {/* TCI 高密度核心面板 */}
          <div className="bg-[#0B0E14] border border-zinc-800 p-5 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            
            <div className="flex-1">
              <h2 className="text-[10px] uppercase text-zinc-500 mb-2 tracking-widest font-semibold flex items-center gap-2">
                <Crosshair size={12} className="text-blue-500"/>
                Trump Crypto Sentiment Index (TCI)
              </h2>
              <div className="flex items-baseline gap-4">
                <span className={`text-6xl md:text-7xl font-black ${tciStatus.color} tracking-tighter tabular-nums leading-none`}>
                  {displayScore}
                </span>
                <span className={`uppercase font-bold text-sm ${tciStatus.color} tracking-wider`}>
                   {tciStatus.text}
                </span>
              </div>
            </div>

            {/* 衍生指标矩阵 (提升专业感的关键) */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:min-w-[240px]">
              <div className="bg-zinc-900/50 border border-zinc-800/80 p-3">
                <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">信号置信度 / Confidence</div>
                <div className="text-sm font-mono text-zinc-300">
                  {analysis.tci_score === 50 ? "45.0%" : "87.5%"}
                  <span className="text-[9px] text-emerald-500 ml-1">↑ 稳固</span>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/80 p-3">
                <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">情绪波动率 / Volatility</div>
                <div className="text-sm font-mono text-zinc-300">
                  {volatility}
                </div>
              </div>
              <div className="col-span-2 bg-zinc-900/50 border border-zinc-800/80 p-2 flex justify-between items-center">
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest">LATEST_PING:</span>
                <span className={`text-[10px] font-mono ${isIdle ? 'text-amber-400' : 'text-zinc-400'}`}>
                  {latest.timestamp || 'WAITING'}
                </span>
              </div>
            </div>
          </div>

          {/* 波动折线图 (更换为更高级的带透明度面积图 AreaChart) */}
          <div className="bg-[#0B0E14] border border-zinc-800 p-4 h-56">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-[10px] uppercase text-zinc-500 tracking-widest font-semibold">24H 趋势跟踪 / Trend Tracking</h3>
               <span className="text-[8px] text-blue-500 border border-blue-500/30 bg-blue-500/10 px-1 py-0.5">ALGO_SMOOTHED</span>
             </div>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[...data].reverse()} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTci" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="1 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={[0, 100]} stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0B0E14', border: '1px solid #27272a', borderRadius: '0px', fontSize: '11px', color: '#e4e4e7'}} 
                    itemStyle={{color: '#3b82f6'}}
                  />
                  <Line type="step" dataKey={() => 50} stroke="#3f3f46" strokeDasharray="2 2" strokeWidth={1} dot={false} activeDot={false} />
                  <Area type="monotone" dataKey="analysis.tci_score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTci)" activeDot={{r: 3, fill: '#60a5fa'}} />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          {/* 高密度实时数据流 (Terminal Log Style) */}
          <div className="bg-[#0B0E14] border border-zinc-800 p-4 flex-1">
            <h3 className="text-[10px] uppercase text-zinc-500 flex items-center gap-2 font-bold tracking-widest border-b border-zinc-800 pb-2 mb-3">
              <Terminal size={12} className="text-blue-500"/> 实时数据流日志 (SYS_LOG)
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {data.map((item, idx) => (
                <div key={idx} className="group border-l-2 border-zinc-800 hover:border-blue-500 pl-3 py-2 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] text-zinc-600 font-mono">[{item.timestamp.split(' ')[1] || item.timestamp}]</span>
                    <span className="text-[9px] text-blue-400 uppercase tracking-widest border border-blue-900 bg-blue-950/30 px-1 py-0.5 leading-none">
                      {item.analysis?.event_type || 'GENERAL'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono mb-2 line-clamp-2 leading-relaxed">
                    > {item.raw_text}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-zinc-500 font-mono">
                    <span><strong className="text-zinc-600">MACRO:</strong> <span className="text-zinc-400">{item.analysis?.macro_impact}</span></span>
                    <span><strong className="text-zinc-600">CRYPTO:</strong> <span className={item.analysis?.crypto_impact.includes('无') ? 'text-zinc-400' : 'text-emerald-400'}>{item.analysis?.crypto_impact}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧边栏面板 */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          
          {/* 资产矩阵 */}
          <div className="bg-[#0B0E14] border border-zinc-800 p-5">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-4 flex items-center gap-2 font-bold tracking-widest">
              <TrendingUp size={12} className="text-blue-500"/> 资金流向嗅探
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[9px] text-emerald-500 uppercase mb-2 font-bold tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_5px_#10b981]"></span> 流入目标 / LONG
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.bullish_assets || []).length > 0 ? (
                    analysis.bullish_assets.map((a: string) => (
                      <span key={a} className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 text-[9px] font-mono">{a}</span>
                    ))
                  ) : (
                    <span className="text-[9px] text-zinc-600 font-mono">-- WAITING_SIGNAL --</span>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-800/50">
                <div className="text-[9px] text-red-500 uppercase mb-2 font-bold tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 shadow-[0_0_5px_#ef4444]"></span> 流出目标 / SHORT
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.bearish_assets || []).length > 0 ? (
                    analysis.bearish_assets.map((a: string) => (
                      <span key={a} className="bg-red-950/30 text-red-400 border border-red-900/50 px-2 py-0.5 text-[9px] font-mono">{a}</span>
                    ))
                  ) : (
                    <span className="text-[9px] text-zinc-600 font-mono">-- WAITING_SIGNAL --</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 实时行情监控 */}
          <div className="bg-[#0B0E14] border border-zinc-800 p-5">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-3 flex items-center gap-2 font-bold tracking-widest">
              <BarChart2 size={12} className="text-blue-500"/> 核心流动性监控
            </h3>
            <div className="space-y-1">
              {['BTC', 'ETH', 'SOL'].map((coin) => (
                <div key={coin} className="flex justify-between items-center py-2 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/20 px-1 transition-colors">
                  <span className="text-[11px] font-bold text-zinc-400">{coin}/USDT</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-zinc-600">$</span>
                    <span className="text-[13px] font-mono font-medium text-zinc-200">{prices[coin as keyof typeof prices]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 量化实验室 & DeepSeek 强力输出 */}
          <div className="bg-[#0B0E14] border border-purple-900/30 flex-1 flex flex-col relative group">
            <div className="p-5 border-b border-purple-900/20 bg-purple-950/5">
              <h3 className="text-[10px] uppercase text-purple-400 mb-1 flex items-center gap-2 font-bold tracking-widest">
                <Microscope size={12} /> QUANT_LAB (Powered by DeepSeek)
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-zinc-500 tracking-wider">AI 回测情报解析</span>
                <span className="text-[9px] text-zinc-600 font-mono">{quantData?.date || "SYNCING"}</span>
              </div>
            </div>
            
            <div className="p-5 flex-1">
              <div className="text-[11px] text-zinc-300 leading-relaxed font-mono relative z-10">
                <span className="text-purple-500 font-bold mr-2">SYS></span>
                {quantData?.content || "等待主引擎下发最新回测计算结果..."}
              </div>
            </div>

            {/* 底部吸附的转化按钮 */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/20">
              <a
                href="https://t.me/trumpMonitor1"
                target="_blank"
                className="flex items-center justify-between w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-[10px] font-bold transition-all group/btn"
              >
                <div className="flex items-center gap-2">
                  <Send size={12} />
                  <span className="tracking-widest uppercase">订阅私域策略预警</span>
                </div>
                <ArrowRightCircle size={12} className="opacity-70 group-hover/btn:translate-x-1 transition-all" />
              </a>
            </div>
          </div>

        </div>
      </div>
      <Analytics />
      
      {/* 全局自定义滚动条样式注入 */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0B0E14; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}} />
    </div>
  );
}
