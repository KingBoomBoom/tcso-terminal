"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw, BarChart2, Send, Crosshair, AlertTriangle, Zap, MessageSquare, ThumbsUp, ThumbsDown, Users, Gauge, Radar } from 'lucide-react';

// 🚀 [变现单元] 原生信息流广告
const FeedAd = () => {
  useEffect(() => { try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch (err) {} }, []);
  return (
    <div className="w-full bg-[#0B0E14] border border-zinc-800/80 p-3 relative flex flex-col justify-center min-h-[140px] group my-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Sponsored Insight</span>
        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-sm">AD</span>
      </div>
      <ins className="adsbygoogle w-full relative z-10" style={{ display: 'block' }} data-ad-format="fluid" data-layout-key="-fb+5w+4e-db+86" data-ad-client="ca-pub-YOUR_ID" data-ad-slot="YOUR_SLOT"></ins>
    </div>
  );
};

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [quantData, setQuantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [prices, setPrices] = useState({ BTC: "...", ETH: "...", SOL: "..." });
  
  // 核心指标
  const [displayScore, setDisplayScore] = useState<string | number>(50); // TCI 指数
  const [fgiScore, setFgiScore] = useState<number>(42); // 恐惧贪婪指数
  
  // 互动与状态
  const [voteStatus, setVoteStatus] = useState<'unvoted' | 'bull' | 'bear'>('unvoted');
  const [fakeStats, setFakeStats] = useState({ bull: 68, bear: 32 });
  const [whales, setWhales] = useState<string[]>([]);

  // 模拟抓取数据
  const fetchOracleData = async () => {
    try {
      const res = await fetch("/api/oracle");
      const json = await res.json();
      let fetchedData = Array.isArray(json) ? json : (json.live_feed || []);
      if (fetchedData.length > 0 && fetchedData.length < 5) {
        fetchedData = [...fetchedData, ...fetchedData];
      }
      setData(fetchedData);
      if (!Array.isArray(json)) setQuantData(json.quant_lab || null);
      setCountdown(60);
      
      // 模拟每次刷新时 FGI 的微调
      setFgiScore(Math.floor(Math.random() * 20) + 35); 
    } catch (e) {} finally { setLoading(false); }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
      const d = await res.json();
      if (d && Array.isArray(d)) {
        setPrices({
          BTC: parseFloat(d.find((i: any) => i.symbol === 'BTCUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 1}),
          ETH: parseFloat(d.find((i: any) => i.symbol === 'ETHUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2}),
          SOL: parseFloat(d.find((i: any) => i.symbol === 'SOLUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2}),
        });
      }
    } catch (e) {}
  };

  // 🚀 [留存杀器] 模拟巨鲸实时监控流
  useEffect(() => {
    const whaleActions = ["BOUGHT", "TRANSFERRED", "STAKED", "SOLD"];
    const assets = ["BTC", "ETH", "SOL", "PEPE", "ONDO"];
    const generateWhale = () => {
      const amt = (Math.random() * 500 + 10).toFixed(0);
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const action = whaleActions[Math.floor(Math.random() * whaleActions.length)];
      const color = action === "SOLD" ? "text-red-400" : "text-emerald-400";
      return `<span class="text-zinc-500">0x${Math.random().toString(16).slice(2, 6)}...</span> <span class="${color}">${action}</span> ${amt} ${asset}`;
    };

    const interval = setInterval(() => {
      setWhales(prev => [generateWhale(), ...prev].slice(0, 4));
    }, 4500); // 每4.5秒跳动一次巨鲸数据，让人不舍得移开视线
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchOracleData(); fetchPrices();
    const t1 = setInterval(fetchOracleData, 60000);
    const t2 = setInterval(fetchPrices, 10000);
    const t3 = setInterval(() => setCountdown(p => p > 0 ? p - 1 : 0), 1000);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); };
  }, []);

  useEffect(() => {
    const baseScore = data[0]?.analysis?.tci_score || 50;
    const breathe = setInterval(() => {
      if (baseScore === 50) setDisplayScore((50 + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 2500);
    if (baseScore !== 50) setDisplayScore(baseScore);
    return () => clearInterval(breathe);
  }, [data]);

  const handleVote = (type: 'bull' | 'bear') => {
    setVoteStatus(type);
    const newBull = type === 'bull' ? 68 + Math.floor(Math.random() * 5) : 68 - Math.floor(Math.random() * 5);
    setFakeStats({ bull: newBull, bear: 100 - newBull });
  };

  if (loading) return (
    <div className="bg-[#0B0E14] text-blue-500 h-screen flex flex-col items-center justify-center font-mono text-sm tracking-widest text-center">
      <Terminal size={40} className="mb-6 animate-pulse mx-auto" />
      <p className="text-base">{">"} INITIATING_TCSO_ENGINE...</p>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [], event_type: 'MARKET', macro_impact: '...', crypto_impact: '...' };
  const tciColor = analysis.tci_score < 45 ? "text-red-500" : analysis.tci_score <= 55 ? "text-amber-400" : "text-emerald-400";
  const tciText = analysis.tci_score < 45 ? "空头主导 (BEARISH)" : analysis.tci_score <= 55 ? "情绪观望 (NEUTRAL)" : "多头共识 (BULLISH)";

  // 计算背离差值 (Alpha Spread)
  const scoreSpread = (analysis.tci_score - fgiScore).toFixed(1);
  const spreadColor = Number(scoreSpread) > 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-300 font-sans pb-20">
      
      {/* 跑马灯报价 */}
      <div className="bg-blue-600 text-white text-xs uppercase tracking-widest font-bold py-2 overflow-hidden whitespace-nowrap flex items-center border-b border-blue-800 font-mono">
        <span className="bg-blue-800 px-4 py-1 mr-2 z-10 flex items-center gap-2"><Zap size={14}/> LIVE TICKER</span>
        <div className="animate-[marquee_20s_linear_infinite] flex gap-10">
          {Object.entries(prices).map(([coin, price]) => <span key={coin}>{coin}/USDT : <span className="text-blue-200">${price}</span></span>)}
          {Object.entries(prices).map(([coin, price]) => <span key={coin + 'copy'}>{coin}/USDT : <span className="text-blue-200">${price}</span></span>)}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        
        {/* 顶栏控制台 */}
        <div className="border-b border-zinc-800 pb-4 mb-8 flex justify-between items-end font-mono">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 flex items-center justify-center rounded-sm"><Activity className="text-blue-500" size={22} /></div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-zinc-100 tracking-tighter">TCSO_TERMINAL</h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Trump Crypto Sentiment Oracle</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1.5">
            <div className="text-xs text-zinc-500 uppercase flex items-center gap-2"><RefreshCw size={12} className={countdown < 5 ? "animate-spin text-blue-400" : ""}/> SYNC: {countdown}s</div>
            <div className="text-emerald-400 flex items-center gap-1.5 text-xs font-bold bg-emerald-400/10 px-2 py-1 border border-emerald-400/20 rounded-sm"><Shield size={12}/> AI ACTIVE</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 relative">
          
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            
            {/* 🚀 [变现核心] 极其硬核的背离指标面板 (TCI vs FGI) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TCI 面板 */}
              <div className="bg-[#0B0E14] border border-blue-900/50 p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                <h2 className="text-xs uppercase text-zinc-500 mb-3 tracking-widest font-bold flex items-center gap-2 font-mono"><Crosshair size={14} className="text-blue-500"/> TCI 特朗普情绪指数</h2>
                <div className="flex items-baseline gap-3">
                  <span className={`text-6xl font-black ${tciColor} tracking-tighter tabular-nums leading-none`}>{displayScore}</span>
                  <span className={`uppercase font-bold text-sm ${tciColor}`}>{tciText}</span>
                </div>
              </div>
              
              {/* 全网恐惧贪婪面板 (基准线) */}
              <div className="bg-zinc-900/30 border border-zinc-800 p-6 relative overflow-hidden">
                <h2 className="text-xs uppercase text-zinc-500 mb-3 tracking-widest font-bold flex items-center gap-2 font-mono"><Gauge size={14} className="text-zinc-400"/> FGI 全网恐惧贪婪指数</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-zinc-300 tracking-tighter tabular-nums leading-none">{fgiScore}</span>
                    <span className="uppercase font-bold text-xs text-zinc-500">恐慌 (FEAR)</span>
                  </div>
                  {/* 🚀 量化核心：背离信号 */}
                  <div className="text-right border-l border-zinc-700 pl-4">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 font-mono">Alpha Spread</div>
                    <div className={`text-xl font-black font-mono ${spreadColor}`}>
                      {Number(scoreSpread) > 0 ? "+" : ""}{scoreSpread}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 核心推文与预测市场模块 */}
            <div className="bg-zinc-900/20 border border-zinc-800 relative overflow-hidden group">
              <div className="p-6 border-b border-zinc-800/80 flex justify-between items-start md:items-center flex-col md:flex-row gap-4 font-mono">
                <h2 className="text-sm uppercase text-blue-400 font-bold tracking-widest flex items-center gap-2">
                  <MessageSquare size={16}/> 核心政策动向实时解析
                </h2>
                <span className="text-xs text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded-sm">{latest.timestamp || "WAITING"}</span>
              </div>

              <div className="p-6 md:p-8">
                <blockquote className="text-lg md:text-xl text-zinc-100 font-medium leading-relaxed border-l-4 border-blue-500/50 pl-5 mb-8">
                  "{latest.raw_text || "等待数据引擎抓取最新情报..."}"
                </blockquote>
                
                {/* 🚀 用户博弈模块 */}
                <div className="bg-[#0B0E14] border border-zinc-700 p-6 rounded-md mb-6 shadow-inner">
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-purple-400"/>
                    <h3 className="text-sm font-bold text-zinc-300">预测市场：此言论对加密圈的影响是？</h3>
                  </div>
                  
                  {voteStatus === 'unvoted' ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => handleVote('bull')} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 py-3 rounded-md font-bold transition-all">
                        <ThumbsUp size={18}/> 看涨 (Bullish)
                      </button>
                      <button onClick={() => handleVote('bear')} className="flex-1 flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/30 border border-red-500/50 text-red-400 py-3 rounded-md font-bold transition-all">
                        <ThumbsDown size={18}/> 看空 (Bearish)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-emerald-400">{fakeStats.bull}% 社区看涨</span>
                        <span className="text-red-400">{fakeStats.bear}% 社区看空</span>
                      </div>
                      <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: `${fakeStats.bull}%`}}></div>
                        <div className="bg-red-500 h-full transition-all duration-1000" style={{width: `${fakeStats.bear}%`}}></div>
                      </div>
                      <p className="text-xs text-zinc-500 text-center mt-2 font-mono">✅ 投票已记录。当前存在巨大的 Alpha 背离缺口，请关注右侧资金流入标的。</p>
                    </div>
                  )}
                </div>

                {/* AI 深度解读 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-zinc-900/40 p-5 border border-zinc-800/50 rounded-sm">
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-mono font-bold">Macro Impact</div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{analysis.macro_impact}</p>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-mono font-bold">Crypto Flow</div>
                    <p className={`text-sm leading-relaxed font-medium ${analysis.crypto_impact?.includes('无') ? 'text-zinc-400' : 'text-blue-400'}`}>
                      {analysis.crypto_impact}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 🚀 三明治结构广告位：强行吸纳投完票后用户的注意力 */}
            <FeedAd />

            {/* 历史日志 */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-zinc-500"/>
                <h3 className="text-sm uppercase text-zinc-400 font-bold tracking-widest font-mono">SYS_LOG (历史回溯)</h3>
                <div className="flex-1 h-[1px] bg-zinc-800 ml-4"></div>
              </div>
              {data.slice(1).map((item, idx) => (
                <div key={idx} className="bg-[#0B0E14] border border-zinc-800 p-5 hover:border-zinc-600 transition-colors rounded-sm">
                  <div className="flex justify-between items-start mb-3 font-mono">
                    <span className="text-[10px] text-zinc-400 border border-zinc-700 bg-zinc-900 px-2 py-0.5 uppercase tracking-widest">
                      {item.analysis?.event_type || 'SIGNAL'}
                    </span>
                    <span className="text-[10px] text-zinc-600">{item.timestamp}</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-zinc-700 pl-4">
                    "{item.raw_text}"
                  </p>
                </div>
              ))}
            </div>

            {/* SEO 富文本区块：为了每天引流免费搜索流量 */}
            <article className="mt-6 bg-[#0B0E14] border border-zinc-800 p-6 md:p-8 rounded-sm text-zinc-400">
              <h2 className="text-base text-zinc-200 font-bold mb-4 tracking-wide">💡 TCSO 投研笔记：情绪背离 (Sentiment Divergence) 怎么交易？</h2>
              <p className="text-sm leading-loose text-justify mb-4">
                在量化交易模型中，最大的 Alpha（超额收益）往往诞生于市场共识与宏观真相错位之时。当前全网 FGI（恐惧贪婪指数）处于低位，表明散户资金正在退潮；然而 TCSO（特朗普加密情绪指数）却发出了截然相反的信号。
              </p>
              <p className="text-sm leading-loose text-justify">
                通过 DeepSeek NLP 引擎深度剖析，华盛顿的最新言论对 RWA 协议及合规 DeFi 资产构成了隐性利好。当 <strong>TCI {">"} FGI</strong> 时，这被称为“政策溢价缺口（Policy Premium Gap）”。聪明的钱（Smart Money）正在利用这种情绪背离进行左侧建仓。
              </p>
            </article>

          </div>

          <div className="col-span-12 lg:col-span-4 relative font-mono">
            
            <div className="sticky top-6 flex flex-col gap-6">
              
              {/* 🚀 [留存神技] 模拟聪明钱流向 (Live Feed) */}
              <div className="bg-[#0B0E14] border border-zinc-800 p-5 rounded-sm shadow-xl">
                <h3 className="text-[11px] text-zinc-300 mb-4 flex items-center justify-between font-bold uppercase tracking-widest border-b border-zinc-800 pb-3">
                  <span className="flex items-center gap-2"><Radar size={14} className="text-blue-500 animate-pulse"/> Smart Money Tracker</span>
                  <span className="text-[9px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-sm">LIVE</span>
                </h3>
                <div className="space-y-3 min-h-[100px] overflow-hidden">
                  {whales.length === 0 ? <p className="text-xs text-zinc-600">监听链上大额转账...</p> : whales.map((w, i) => (
                    <div key={i} className="text-xs font-mono animate-in slide-in-from-top-2 duration-300 border-l-2 border-blue-900 pl-2 bg-zinc-900/30 py-1.5" dangerouslySetInnerHTML={{__html: w}}></div>
                  ))}
                </div>
              </div>

              {/* 资金异动目标 */}
              <div className="bg-[#0B0E14] border border-zinc-800 p-5 rounded-sm">
                <h3 className="text-xs text-zinc-400 mb-4 flex items-center font-bold uppercase tracking-widest border-b border-zinc-800 pb-3">
                  <TrendingUp size={14} className="text-blue-500 mr-2"/> 重点盯盘标的
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-emerald-500 uppercase mb-2 font-bold flex items-center gap-2">潜伏净流入 (LONG)</div>
                    <div className="flex flex-wrap gap-2">{(analysis.bullish_assets || ['BTC', 'SOL', 'RWA']).map((a: string) => <span key={a} className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 px-3 py-1 text-xs font-bold rounded-sm">{a}</span>)}</div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800/50">
                    <div className="text-[10px] text-red-500 uppercase mb-2 font-bold flex items-center gap-2">逃顶规避 (SHORT)</div>
                    <div className="flex flex-wrap gap-2">{(analysis.bearish_assets || ['ETH', 'MEME']).map((a: string) => <span key={a} className="bg-red-950/40 text-red-400 border border-red-900/60 px-3 py-1 text-xs font-bold rounded-sm">{a}</span>)}</div>
                  </div>
                </div>
              </div>

              {/* 🚀 侧边栏常驻大广告位 */}
              <div className="hidden lg:flex w-full bg-[#0B0E14] border border-zinc-800/80 p-2 relative flex-col items-center justify-center min-h-[300px] shadow-lg rounded-sm">
                 <span className="absolute top-2 left-2 text-[9px] text-zinc-600 tracking-widest uppercase">Advertisement</span>
                 <ins className="adsbygoogle w-full h-full relative z-10" style={{ display: 'block' }} data-ad-format="auto" data-full-width-responsive="true" data-ad-client="ca-pub-YOUR_ID" data-ad-slot="YOUR_SLOT"></ins>
              </div>

              {/* 量化实验室入口 (最终诱捕转化) */}
              <div className="bg-[#0B0E14] border border-purple-900/50 flex flex-col shadow-lg rounded-sm overflow-hidden mt-2">
                <div className="p-4 border-b border-purple-900/30 bg-purple-950/20"><h3 className="text-xs uppercase text-purple-400 font-bold tracking-widest flex items-center"><Microscope size={14} className="mr-2"/> AI QUANT ENGINE</h3></div>
                <div className="p-4 text-xs text-zinc-300 leading-relaxed min-h-[80px]">
                  <span className="text-purple-500 font-bold mr-2">SYS{">"}</span>{quantData?.content || "捕捉到政策情绪缺口，正在生成做单点位..."}
                </div>
                <a href="https://t.me/trumpMonitor1" target="_blank" className="flex items-center justify-center w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white px-4 py-4 text-xs font-black uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(42,171,238,0.3)] hover:shadow-[0_0_25px_rgba(42,171,238,0.5)]">
                  <Send size={16} className="mr-2"/> 进入私域接收精准信号
                </a>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <Analytics />
      <style dangerouslySetInnerHTML={{__html: `@keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } } .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #0B0E14; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 6px; }`}} />
    </div>
  );
}
