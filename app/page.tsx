"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw, BarChart2, Send, AlertTriangle } from 'lucide-react';

// 🚀 新增：安全的 Google AdSense 组件封装
const GoogleAd = () => {
  useEffect(() => {
    try {
      // 告诉 Google 脚本在这里推入广告
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense Error:", err);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-sm bg-[#0B0E14] border border-zinc-800/50 min-h-[100px] flex items-center justify-center relative group">
      {/* 广告未加载或被屏蔽时的底部提示语 */}
      <span className="absolute text-[9px] text-zinc-700 tracking-widest uppercase">Advertisement</span>
      
      <ins 
        className="adsbygoogle relative z-10 w-full"
        style={{ display: 'block' }}
        // 👇 ⚠️ 必须在这里填入你申请下来的 AdSense Publisher ID (例如: ca-pub-1234567890)
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID_HERE"
        // 👇 ⚠️ 必须在这里填入你在 AdSense 后台创建的广告单元 ID
        data-ad-slot="YOUR_AD_SLOT_ID_HERE"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

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
        <p>{">"} INITIALIZING_CORE_SYSTEM...</p>
        <p>{">"} CONNECTING_TO_ORACLE_ENGINE...</p>
        <p className="animate-pulse text-blue-500">{">"} FETCHING_SENTIMENT_DATA...</p>
      </div>
    </div>
  );

  if (error || data.length === 0) return (
    <div className="bg-[#0B0E14] text-red-500 h-screen flex items-center justify-center font-mono p-4 text-center">
      <div className="border border-red-900/50 bg-red-950/20 p-6 rounded-md shadow-[0_0_30px_rgba(220,38,38,0.15)]">
        <p className="font-bold mb-2 tracking-widest">CRITICAL ERROR</p>
        <p className="text-xs text-red-400/80">OFFLINE: 数据引擎连接断开，请检查网络</p>
      </div>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [] };
  
  const getTciStatus = (currentScore: number) => {
    if (currentScore < 45) return { text: "空头警报 / BEARISH", color: "text-red-500" };
    if (currentScore <= 55) return { text: "情绪观望 / NEUTRAL", color: "text-amber-400" };
    return { text: "多头狂热 / BULLISH", color: "text-emerald-400" };
  };

  const tciStatus = getTciStatus(analysis.tci_score);

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-300 font-mono p-4 md:p-8 selection:bg-blue-500/30 pb-20">
      
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
          {isIdle ? (
             <div className="text-amber-500 flex items-center gap-1.5 text-[10px] md:text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 animate-pulse">
               <AlertTriangle size={10}/> IDLE
             </div>
          ) : (
             <div className="text-emerald-400 flex items-center gap-1.5 text-[10px] md:text-xs font-bold bg-emerald-400/10 px-2.5 py-0.5 rounded border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
               <Shield size={10}/> LIVE
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* TCI 核心面板 */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 md:p-8 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600/30 group-hover:bg-blue-500 transition-colors"></div>
            <h2 className="text-xs uppercase text-zinc-500 mb-6 tracking-widest font-semibold flex items-center justify-between">
              <span>TCI 指数 / Trump Crypto Sentiment</span>
              <span className="text-[9px] text-zinc-600 border border-zinc-800 px-2 py-1 rounded-sm hover:text-blue-400 transition-colors cursor-pointer">
                &lt;/&gt; API ACCESS
              </span>
            </h2>
            <div className="flex items-center gap-6 md:gap-8">
              <span className={`text-7xl md:text-8xl font-black ${tciStatus.color} tracking-tighter tabular-nums transition-all duration-300`}>
                {displayScore}
              </span>
              <div className="flex flex-col gap-2.5">
                <span className={`uppercase font-bold text-base md:text-xl ${tciStatus.color} tracking-wider`}>
                   {tciStatus.text}
                </span>
                <div className={`text-[10px] font-medium px-2.5 py-1.5 inline-block w-max border rounded-sm ${isIdle ? 'bg-amber-950/50 text-amber-400 border-amber-800/50' : 'bg-zinc-950 text-zinc-500 border-zinc-800/50'}`}>
                  {isIdle ? `⚠️ MARKET_IDLE: 总统超12小时未发声` : `LATEST_PING: ${latest.timestamp || 'WAITING'}`}
                </div>
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
              <div key={idx} className="bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 transition-all p-5 md:p-6 rounded-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-blue-400 bg-blue-500/10 px-2 py-1 text-[10px] font-bold tracking-widest uppercase border border-blue-500/20">
                    [{item.analysis?.event_type || 'GENERAL'}]
                  </span>
                  <span className="text-[10px] text-zinc-600 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-sm md:text-base text-zinc-300 mb-6 leading-relaxed font-sans border-l-[3px] border-zinc-700 pl-4 py-1">
                  {item.raw_text}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0B0E14] p-3.5 border border-zinc-800/50 rounded-sm shadow-inner">
                    <div className="text-[9px] text-zinc-500 mb-2 uppercase font-bold tracking-wider">宏观分析</div>
                    <div className="text-xs text-zinc-400 leading-snug">{item.analysis?.macro_impact}</div>
                  </div>
                  <div className="bg-[#0B0E14] p-3.5 border border-zinc-800/50 rounded-sm shadow-inner">
                    <div className="text-[9px] text-zinc-500 mb-2 uppercase font-bold tracking-wider">加密冲击</div>
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
                <div className="text-[10px] text-emerald-500/80 uppercase mb-3 font-bold tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]"></span> 资金流入预期
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {(analysis.bullish_assets || []).length > 0 ? (
                    analysis.bullish_assets.map((a: string) => (
                      <span key={a} className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 text-[10px] font-bold border border-emerald-500/30 rounded-sm">{a}</span>
                    ))
                  ) : (
                    <span className="text-[10px] text-zinc-600 italic px-1">暂无明显流入信号</span>
                  )}
                </div>
              </div>
              <div className="pt-5 border-t border-zinc-800/50">
                <div className="text-[10px] text-red-500/80 uppercase mb-3 font-bold tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-70 shadow-[0_0_5px_#ef4444]"></span> 资金流出预期
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {(analysis.bearish_assets || []).length > 0 ? (
                    analysis.bearish_assets.map((a: string) => (
                      <span key={a} className="bg-red-500/10 text-red-400 px-2.5 py-1 text-[10px] font-bold border border-red-500/30 rounded-sm">{a}</span>
                    ))
                  ) : (
                    <span className="text-[10px] text-zinc-600 italic px-1">暂无明显流出信号</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 实时币价监控面板 */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-sm">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-4 flex items-center gap-2 font-bold tracking-widest">
              <BarChart2 size={12} className="text-blue-500"/> 核心加密资产监控
            </h3>
            <div className="space-y-2">
              {['BTC', 'ETH', 'SOL'].map((coin) => (
                <div key={coin} className="flex justify-between items-center bg-[#0B0E14] border border-zinc-800/50 p-3 rounded-sm hover:border-zinc-700 transition-colors">
                  <span className="text-xs font-bold text-zinc-300">{coin}/USDT</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600">$</span>
                    <span className="text-sm font-mono font-medium text-emerald-400 tracking-wide">{prices[coin as keyof typeof prices]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🎯 真实 Google AdSense 广告位 */}
          <div className="mb-6">
             <GoogleAd />
          </div>

          {/* 量化实验室 & TG 强力转化按钮 */}
          <div className="bg-zinc-900/40 border border-purple-500/30 p-5 md:p-6 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl group-hover:bg-purple-600/10 transition-colors"></div>
            
            <h3 className="text-[10px] uppercase text-zinc-500 mb-4 flex items-center gap-2 font-bold tracking-widest relative z-10">
              <Microscope size={12} className="text-purple-400"/> 量化回测引擎 (QUANT LAB)
            </h3>
            
            <div className="mb-4 border-b border-zinc-800/80 pb-3 flex justify-between items-end relative z-10">
              <span className="text-xs text-purple-400 font-bold tracking-wide">{quantData?.week_label || "AI 回测报告"}</span>
              <span className="text-[9px] text-zinc-600 font-mono">{quantData?.date || "SYNCING..."}</span>
            </div>
            
            <div className="text-xs text-zinc-400 leading-relaxed font-mono space-y-2 bg-[#0B0E14] p-4 border border-zinc-800/50 rounded-sm relative z-10 shadow-inner">
              <p>
                <Terminal size={10} className="inline mr-1.5 text-zinc-600 mb-0.5"/>
                {quantData?.content || "等待主引擎下发最新回测计算结果..."}
              </p>
            </div>

            <a
              href="https://t.me/trumpMonitor1"
              target="_blank"
              className="relative z-10 mt-6 flex items-center justify-between w-full bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 text-[#2AABEE] px-4 py-3 text-[11px] font-bold border border-[#2AABEE]/30 transition-all group/btn rounded-sm"
            >
              <div className="flex items-center gap-2">
                <Send size={14} className="opacity-80" />
                <span className="tracking-widest">加入 Telegram 接收异动预警</span>
              </div>
              <ArrowRightCircle size={14} className="opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
            </a>
          </div>

        </div>
      </div>
      <Analytics />
    </div>
  );
}
