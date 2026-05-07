"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw, BarChart2 } from 'lucide-react';

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [quantData, setQuantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  // 新增：用于存储实时币价状态
  const [prices, setPrices] = useState({ BTC: "...", ETH: "...", SOL: "..." });

  const API_URL = "/api/oracle";

  const fetchOracleData = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();
      
      if (Array.isArray(json)) {
        setData(json); 
      } else {
        setData(json.live_feed || []); 
        setQuantData(json.quant_lab || null); 
      }
      setCountdown(60); 
    } catch (e) {
      console.error("数据抓取失败", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 新增：独立的函数，每隔5秒从币安公共接口拉取一次核心币价
  const fetchPrices = async () => {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
      const data = await res.json();
      if (data && Array.isArray(data)) {
        setPrices({
          BTC: parseFloat(data.find((d: any) => d.symbol === 'BTCUSDT')?.price || 0).toFixed(1),
          ETH: parseFloat(data.find((d: any) => d.symbol === 'ETHUSDT')?.price || 0).toFixed(2),
          SOL: parseFloat(data.find((d: any) => d.symbol === 'SOLUSDT')?.price || 0).toFixed(2)
        });
      }
    } catch (e) {
      console.log("币价拉取失败", e);
    }
  };

  useEffect(() => {
    fetchOracleData();
    fetchPrices(); // 初始化时拉取一次币价
    
    const dataTimer = setInterval(fetchOracleData, 60000);
    const priceTimer = setInterval(fetchPrices, 10000); // 每10秒更新一次价格
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(dataTimer);
      clearInterval(priceTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  if (loading) return (
    <div className="bg-[#0B0E14] text-blue-500 h-screen flex flex-col items-center justify-center font-mono text-sm tracking-widest">
      <Terminal size={40} className="mb-6 animate-pulse" />
      <div className="space-y-2 opacity-80 text-zinc-400">
        <p>{">"} INITIALIZING_CORE_SYSTEM...</p>
        <p>{">"} CONNECTING_TO_ORACLE_ENGINE...</p>
        <p className="animate-pulse text-blue-500">{">"} FETCHING_SENTIMENT_DATA...</p>
      </div>
    </div>
  );

  if (error || data.length === 0) return (
    <div className="bg-[#0B0E14] text-red-500 h-screen flex items-center justify-center font-mono p-4 text-center">
      <div className="border border-red-900/50 bg-red-950/20 p-6 rounded-md">
        <p className="font-bold mb-2">CRITICAL ERROR</p>
        <p className="text-xs text-red-400/80">OFFLINE: 数据引擎连接断开，请检查网络</p>
      </div>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [] };
  const score = analysis.tci_score;

  const getTciStatus = (currentScore: number) => {
    if (currentScore < 45) return { text: "空头警报 / BEARISH", color: "text-red-500" };
    if (currentScore <= 55) return { text: "情绪观望 / NEUTRAL", color: "text-amber-400" };
    return { text: "多头狂热 / BULLISH", color: "text-emerald-400" };
  };

  const tciStatus = getTciStatus(score);

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-300 font-mono p-4 md:p-8 selection:bg-blue-500/30">
      
      {/* 顶部状态栏 */}
      <div className="border-b border-zinc-800/80 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tighter flex items-center gap-2 md:gap-3">
            <Activity className="text-blue-500" size={22} /> TCSO-TERMINAL
          </h1>
          <p className="text-[10px] md:text-xs text-zinc-500 mt-1.5 uppercase tracking-widest">AI Sentiment Oracle Engine</p>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <div className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <RefreshCw size={10} className={countdown < 5 ? "animate-spin text-blue-400" : ""} /> 
            SYNC_IN: {countdown}s
          </div>
          <div className="text-emerald-400 flex items-center gap-1.5 text-xs font-bold bg-emerald-400/10 px-2.5 py-0.5 rounded border border-emerald-400/20">
             <Shield size={10}/> LIVE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* TCI 核心面板 */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 md:p-8 rounded-sm relative overflow-hidden">
            <h2 className="text-xs uppercase text-zinc-500 mb-6 tracking-widest font-semibold">TCI 指数 / Trump Crypto Sentiment</h2>
            <div className="flex items-center gap-6">
              <span className={`text-7xl md:text-8xl font-black ${tciStatus.color} tracking-tighter`}>
                {score}
              </span>
              <div className="flex flex-col gap-2">
                <span className={`uppercase font-bold text-base md:text-xl ${tciStatus.color} tracking-wider`}>
                   {tciStatus.text}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium bg-zinc-950 px-2 py-1 inline-block w-max border border-zinc-800/50">
                  LATEST_PING: {latest.timestamp || 'WAITING'}
                </span>
              </div>
            </div>
          </div>

          {/* 波动折线图 */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 md:p-6 rounded-sm h-64">
             <h3 className="text-[10px] uppercase text-zinc-500 mb-4 tracking-widest font-semibold">24H 趋势跟踪 (Trend Tracking)</h3>
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...data].reverse()} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={[0, 100]} stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '2px', fontSize: '12px', color: '#e4e4e7'}} 
                    itemStyle={{color: '#3b82f6'}}
                  />
                  <Line type="step" dataKey={() => 50} stroke="#3f3f46" strokeDasharray="4 4" strokeWidth={1} dot={false} activeDot={false} />
                  <Line type="monotone" dataKey="analysis.tci_score" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{r: 4, fill: '#60a5fa'}} />
                </LineChart>
             </ResponsiveContainer>
          </div>

          {/* 实时 Feed */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase text-zinc-500 flex items-center gap-2 font-bold tracking-widest border-b border-zinc-800/80 pb-3">
              <Activity size={12} className="text-blue-500"/> 实时数据流 (Live Feed)
            </h3>
            {data.map((item, idx) => (
              <div key={idx} className="bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors p-4 md:p-5 rounded-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                    [{item.analysis?.event_type || 'GENERAL'}]
                  </span>
                  <span className="text-[10px] text-zinc-600">{item.timestamp}</span>
                </div>
                <p className="text-sm md:text-base text-zinc-300 mb-5 leading-relaxed font-sans border-l-[3px] border-zinc-700 pl-3">
                  {item.raw_text}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-[#0B0E14] p-3 border border-zinc-800/50 rounded-sm">
                    <div className="text-[9px] text-zinc-500 mb-1.5 uppercase font-bold tracking-wider">宏观分析</div>
                    <div className="text-xs text-zinc-400 leading-snug">{item.analysis?.macro_impact}</div>
                  </div>
                  <div className="bg-[#0B0E14] p-3 border border-zinc-800/50 rounded-sm">
                    <div className="text-[9px] text-zinc-500 mb-1.5 uppercase font-bold tracking-wider">加密冲击</div>
                    <div className="text-xs font-medium text-blue-400/90 leading-snug">{item.analysis?.crypto_impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* 资产流向矩阵 */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 md:p-6 rounded-sm">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-5 flex items-center gap-2 font-bold tracking-widest">
              <TrendingUp size={12} className="text-blue-500"/> 链上/宏观资产流向
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-[10px] text-emerald-500/80 uppercase mb-2.5 font-bold tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 资金流入预期
                </div>
                <div className="flex flex-wrap gap-2">
                  {(analysis.bullish_assets || []).length > 0 ? (
                    analysis.bullish_assets.map((a: string) => (
                      <span key={a} className="bg-emerald-500/10 text-emerald-400 px-2 py-1 text-[10px] font-bold border border-emerald-500/20">{a}</span>
                    ))
                  ) : (
                    <span className="text-[10px] text-zinc-600 italic">暂无流入信号</span>
                  )}
                </div>
              </div>
              <div className="pt-5 border-t border-zinc-800/50">
                <div className="text-[10px] text-red-500/80 uppercase mb-2.5 font-bold tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-70"></span> 资金流出预期
                </div>
                <div className="flex flex-wrap gap-2">
                  {(analysis.bearish_assets || []).length > 0 ? (
                    analysis.bearish_assets.map((a: string) => (
                      <span key={a} className="bg-red-500/10 text-red-400 px-2 py-1 text-[10px] font-bold border border-red-500/20">{a}</span>
                    ))
                  ) : (
                    <span className="text-[10px] text-zinc-600 italic">暂无流出信号</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 新增：实时币价监控面板 */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-sm">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-4 flex items-center gap-2 font-bold tracking-widest">
              <BarChart2 size={12} className="text-blue-500"/> 核心加密资产监控
            </h3>
            <div className="space-y-3">
              {['BTC', 'ETH', 'SOL'].map((coin) => (
                <div key={coin} className="flex justify-between items-center bg-[#0B0E14] border border-zinc-800/50 p-2.5 rounded-sm">
                  <span className="text-xs font-bold text-zinc-300">{coin}/USDT</span>
                  <span className="text-sm font-mono text-emerald-400">${prices[coin as keyof typeof prices]}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[9px] text-zinc-600 text-right italic">
              Data sourced from Binance API (10s refresh)
            </div>
          </div>

          {/* 量化实验室 */}
          <div className="bg-zinc-900/40 border border-purple-500/20 p-5 md:p-6 rounded-sm relative overflow-hidden group">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-4 flex items-center gap-2 font-bold tracking-widest">
              <Microscope size={12} className="text-purple-400"/> 量化回测引擎 (QUANT LAB)
            </h3>
            
            <div className="mb-3 border-b border-zinc-800/80 pb-2 flex justify-between items-end">
              <span className="text-xs text-purple-400 font-bold tracking-wide">{quantData?.week_label || "AI 回测报告"}</span>
              <span className="text-[9px] text-zinc-600 font-mono">{quantData?.date || "SYNCING..."}</span>
            </div>
            
            <div className="text-xs text-zinc-400 leading-relaxed font-mono space-y-2 bg-[#0B0E14] p-3 border border-zinc-800/50 rounded-sm">
              <p>
                <Terminal size={10} className="inline mr-1.5 text-zinc-600 mb-0.5"/>
                {quantData?.content || "等待主引擎下发最新回测计算结果..."}
              </p>
            </div>

            <a
              href="https://t.me/YOUR_TG_LINK"
              target="_blank"
              className="mt-5 flex items-center justify-between w-full bg-[#0B0E14] hover:bg-zinc-800 text-zinc-400 px-3 py-2.5 text-[10px] font-bold border border-zinc-800/80 transition-colors group/btn"
            >
              <span>加入 Telegram 接收异动预警</span>
              <ArrowRightCircle size={12} className="text-zinc-600 group-hover/btn:text-purple-400 transition-colors" />
            </a>
          </div>

        </div>
        
        <Analytics />
      </div>
    </div>
  );
}
