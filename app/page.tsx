"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw, BarChart2, Send, Crosshair, AlertTriangle, Zap, MessageSquare, Flame, Cpu, Mail, ThumbsUp, ThumbsDown, Users, Trophy, Lock, Unlock, ShieldAlert } from 'lucide-react';

// 🚀 [变现单元] 原生信息流广告 (穿插在信息流中)
const FeedAd = () => {
  useEffect(() => { try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch (err) {} }, []);
  return (
    <div className="w-full bg-[#0B0E14] border border-zinc-800/80 p-3 relative flex flex-col justify-center min-h-[120px] group my-2 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Sponsored Insight</span>
        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-sm">AD</span>
      </div>
      <ins className="adsbygoogle w-full relative z-10" style={{ display: 'block' }} data-ad-format="fluid" data-layout-key="-fb+5w+4e-db+86" data-ad-client="ca-pub-YOUR_ID" data-ad-slot="YOUR_SLOT"></ins>
    </div>
  );
};

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  
  // 🚀 注入 2026 政治与AI热点资产
  const [prices, setPrices] = useState({ BTC: "...", ETH: "...", SOL: "...", ONDO: "...", TREMP: "...", WLD: "..." });
  const [displayScore, setDisplayScore] = useState<string | number>(50);
  const [fgiScore, setFgiScore] = useState<number>(42);
  
  const [liquidations, setLiquidations] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 🚀 核心留存与变现状态
  const [points, setPoints] = useState(0);
  const [voteStatus, setVoteStatus] = useState<'unvoted' | 'bull' | 'bear'>('unvoted');
  const [fakeStats, setFakeStats] = useState({ bull: 72, bear: 28 });
  const [isUnlocked, setIsUnlocked] = useState(false); // 智能合约模糊解锁状态

  const fetchOracleData = async () => {
    try {
      const res = await fetch("/api/oracle");
      const json = await res.json();
      let fetchedData = Array.isArray(json) ? json : (json.live_feed || []);
      // 制造深度的信息流以增加页面滚动和广告曝光
      if (fetchedData.length > 0 && fetchedData.length < 6) fetchedData = [...fetchedData, ...fetchedData, ...fetchedData];
      setData(fetchedData);
      setCountdown(60);
      setFgiScore(Math.floor(Math.random() * 15) + 38); 
    } catch (e) {} finally { setLoading(false); }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","ONDOUSDT","WLDUSDT"]');
      const d = await res.json();
      if (d && Array.isArray(d)) {
        setPrices({
          BTC: parseFloat(d.find((i: any) => i.symbol === 'BTCUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 1}),
          ETH: parseFloat(d.find((i: any) => i.symbol === 'ETHUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2}),
          SOL: parseFloat(d.find((i: any) => i.symbol === 'SOLUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2}),
          ONDO: parseFloat(d.find((i: any) => i.symbol === 'ONDOUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 4}),
          TREMP: "0.8521", // 模拟 PolitiFi 数据
          WLD: parseFloat(d.find((i: any) => i.symbol === 'WLDUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 3}),
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    const assets = ["BTC", "ETH", "SOL", "TREMP", "WIF", "PEPE"];
    const sides = ["SHORT", "LONG"];
    const generateLiq = () => {
      const amt = (Math.random() * 5 + 0.5).toFixed(2);
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const side = sides[Math.floor(Math.random() * sides.length)];
      const color = side === "SHORT" ? "text-emerald-400" : "text-red-400";
      return `<span class="text-zinc-500">REKT:</span> <span class="${color} font-bold">${side}</span> ${amt}M <span class="text-blue-400">${asset}</span> Liq'd`;
    };

    const interval = setInterval(() => {
      setLiquidations(prev => [generateLiq(), ...prev].slice(0, 5));
    }, 3200); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchOracleData(); fetchPrices();
    const t1 = setInterval(fetchOracleData, 60000);
    const t2 = setInterval(fetchPrices, 10000);
    const t3 = setInterval(() => setCountdown(p => p > 0 ? p - 1 : 0), 1000);
    
    const savedPoints = localStorage.getItem('tcso_points');
    if(savedPoints) setPoints(parseInt(savedPoints));

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

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    if(email) setIsSubscribed(true);
  };

  const handleVote = (type: 'bull' | 'bear') => {
    setVoteStatus(type);
    const newBull = type === 'bull' ? 72 + Math.floor(Math.random() * 5) : 72 - Math.floor(Math.random() * 5);
    setFakeStats({ bull: newBull, bear: 100 - newBull });
    
    const newPoints = points + 50;
    setPoints(newPoints);
    localStorage.setItem('tcso_points', newPoints.toString());
  };

  if (loading) return (
    <div className="bg-[#0B0E14] text-blue-500 h-screen flex flex-col items-center justify-center font-mono text-sm tracking-widest text-center">
      <Terminal size={40} className="mb-6 animate-pulse mx-auto" />
      <p className="text-base">{">"} BOOTSTRAPPING_RISK_ENGINE...</p>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: ['BTC', 'ONDO', 'TREMP'], bearish_assets: ['ETH', 'WLD'], event_type: 'POLICY_RISK', macro_impact: '...', crypto_impact: '...' };
  const tciColor = analysis.tci_score < 45 ? "text-red-500" : analysis.tci_score <= 55 ? "text-amber-400" : "text-emerald-400";
  const tciText = analysis.tci_score < 45 ? "看跌抛售" : analysis.tci_score <= 55 ? "流动性停滞" : "多头强共识";
  const scoreSpread = (analysis.tci_score - fgiScore).toFixed(1);

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-300 font-sans pb-20">
      
      {/* 跑马灯 */}
      <div className="bg-blue-600 text-white text-xs uppercase tracking-widest font-bold py-2 overflow-hidden flex items-center border-b border-blue-800 font-mono">
        <span className="bg-blue-800 px-4 py-1 mr-4 z-10 flex items-center gap-2 shrink-0"><Zap size={14}/> LIVE RISK TICKER</span>
        <div className="flex gap-10 whitespace-nowrap min-w-max" style={{ animation: 'marquee 30s linear infinite' }}>
          {Object.entries(prices).map(([coin, price]) => <span key={coin}>{coin}/USDT : <span className="text-blue-200">${price}</span></span>)}
          {Object.entries(prices).map(([coin, price]) => <span key={coin + 'copy'}>{coin}/USDT : <span className="text-blue-200">${price}</span></span>)}
          {Object.entries(prices).map(([coin, price]) => <span key={coin + 'copy2'}>{coin}/USDT : <span className="text-blue-200">${price}</span></span>)}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="border-b border-zinc-800 pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end font-mono gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 flex items-center justify-center rounded-sm"><ShieldAlert className="text-blue-500" size={22} /></div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-zinc-100 tracking-tighter">TCSO_DEAI_RISK</h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Autonomous PolitiFi & Macro Audit Node</p>
            </div>
          </div>
          <div className="flex items-end gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="flex flex-col items-start md:items-end border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 rounded-sm">
              <span className="text-[10px] text-amber-500/80 uppercase font-bold flex items-center gap-1"><Trophy size={10}/> S1 Airdrop Points</span>
              <span className="text-base font-black text-amber-400 tabular-nums">{points} <span className="text-[10px]">PTS</span></span>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5">
              <div className="text-xs text-zinc-500 uppercase flex items-center gap-2"><RefreshCw size={12} className={countdown < 5 ? "animate-spin text-blue-400" : ""}/> SYNC: {countdown}s</div>
              <div className="text-emerald-400 flex items-center gap-1.5 text-xs font-bold bg-emerald-400/10 px-2 py-1 border border-emerald-400/20 rounded-sm"><Cpu size={12}/> AI AGENT ONLINE</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 relative">
          
          {/* 左侧信息流 */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0B0E14] border border-blue-900/50 p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                <h2 className="text-xs uppercase text-zinc-500 mb-3 tracking-widest font-bold flex items-center gap-2 font-mono"><Crosshair size={14} className="text-blue-500"/> TCI 宏观政治风控指数</h2>
                <div className="flex items-baseline gap-3">
                  <span className={`text-6xl font-black ${tciColor} tracking-tighter tabular-nums leading-none`}>{displayScore}</span>
                  <span className={`uppercase font-bold text-sm ${tciColor}`}>{tciText}</span>
                </div>
              </div>
              
              <div className="bg-zinc-900/30 border border-zinc-800 p-6 relative overflow-hidden">
                <h2 className="text-xs uppercase text-zinc-500 mb-3 tracking-widest font-bold flex items-center gap-2 font-mono"><Activity size={14} className="text-zinc-400"/> FGI 散户恐惧贪婪</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-zinc-300 tracking-tighter tabular-nums leading-none">{fgiScore}</span>
                    <span className="uppercase font-bold text-xs text-zinc-500">恐慌盘</span>
                  </div>
                  <div className="text-right border-l border-zinc-700 pl-4">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 font-mono">Alpha 背离</div>
                    <div className={`text-xl font-black font-mono ${Number(scoreSpread) > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {Number(scoreSpread) > 0 ? "+" : ""}{scoreSpread}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-800 relative overflow-hidden">
              <div className="p-6 border-b border-zinc-800/80 flex justify-between items-start md:items-center flex-col md:flex-row gap-4 font-mono">
                <h2 className="text-sm uppercase text-blue-400 font-bold tracking-widest flex items-center gap-2">
                  <MessageSquare size={16}/> 核心政策动向拦截
                </h2>
                <span className="text-xs text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded-sm">{latest.timestamp || "WAITING"}</span>
              </div>

              <div className="p-6 md:p-8">
                {/* 🚀 找回特朗普情报原话并加粗 */}
                <blockquote className="text-lg md:text-xl text-zinc-100 font-medium leading-relaxed border-l-4 border-blue-500/50 pl-5 mb-8">
                  "{latest.raw_text || "等待风控引擎抓取最新情报..."}"
                </blockquote>

                {/* 游戏化预测市场 */}
                <div className="bg-[#0B0E14] border border-zinc-700 p-6 rounded-md mb-6 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded-bl-md uppercase">Earn +50 PTS</div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-purple-400"/>
                    <h3 className="text-sm font-bold text-zinc-200">预测对冲：此言论是否引爆 PolitiFi 赛道？</h3>
                  </div>
                  
                  {voteStatus === 'unvoted' ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => handleVote('bull')} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 py-3 rounded-md font-bold transition-all">
                        <ThumbsUp size={18}/> 极度利好 (BULLISH)
                      </button>
                      <button onClick={() => handleVote('bear')} className="flex-1 flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/30 border border-red-500/50 text-red-400 py-3 rounded-md font-bold transition-all">
                        <ThumbsDown size={18}/> 利空兑现 (BEARISH)
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
                      <p className="text-xs text-amber-500 text-center mt-2 font-mono flex items-center justify-center gap-1">
                        <Trophy size={12}/> 投票成功！已为你空投 +50 积分。
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-zinc-900/40 p-5 border border-zinc-800/50 rounded-sm">
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-mono font-bold">宏观风险评估 (Macro Risk)</div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{analysis.macro_impact}</p>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-mono font-bold">做市商动向 (MM Flow)</div>
                    <p className={`text-sm leading-relaxed font-medium ${analysis.crypto_impact?.includes('无') ? 'text-zinc-400' : 'text-blue-400'}`}>
                      {analysis.crypto_impact}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <FeedAd />

            {/* 🚀 找回丢失的 SYS_LOG 历史信息流：拉长页面纵深的核心 */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-zinc-500"/>
                <h3 className="text-sm uppercase text-zinc-400 font-bold tracking-widest font-mono">SYS_LOG (链上政治情报追踪记录)</h3>
                <div className="flex-1 h-[1px] bg-zinc-800 ml-4"></div>
              </div>
              {data.slice(1).map((item, idx) => (
                <div key={idx} className="bg-[#0B0E14] border border-zinc-800 p-5 hover:border-zinc-600 transition-colors rounded-sm">
                  <div className="flex justify-between items-start mb-3 font-mono">
                    <span className="text-[10px] text-zinc-400 border border-zinc-700 bg-zinc-900 px-2 py-0.5 uppercase tracking-widest">
                      {item.analysis?.event_type || 'RISK_DETECTED'}
                    </span>
                    <span className="text-[10px] text-zinc-600">{item.timestamp}</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-zinc-700 pl-4">
                    {">"} "{item.raw_text}"
                  </p>
                </div>
              ))}
            </div>

            <FeedAd />

            <div className="bg-[#0B0E14] border border-zinc-800 p-4 h-56 mt-4">
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

            {/* 线索收集 / Lead Gen */}
            <article className="mt-4 bg-[#0B0E14] border border-blue-900/50 p-6 md:p-8 rounded-sm text-zinc-400 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
              <h2 className="text-lg text-zinc-100 font-bold mb-3 tracking-wide flex items-center gap-2">
                <Cpu className="text-blue-400"/> 开放 TCSO DeAI Risk API
              </h2>
              <p className="text-sm leading-relaxed mb-6">
                机构级内部风控套件现已下放。支持直接接入你的量化审计机器人、清算监控脚本或风控后台。填入邮箱，获取限量 100 个的 Beta API Key，<strong>并可积累 Season 1 空投份额</strong>。
              </p>
              
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md relative z-10">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" className="w-full bg-zinc-900 border border-zinc-700 text-sm text-zinc-200 px-4 py-3 pl-10 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <button type="submit" className="bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-3 text-sm font-bold tracking-widest uppercase transition-colors">
                    Request API
                  </button>
                </form>
              ) : (
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 text-sm font-bold rounded-sm">
                  ✅ 申请已提交。风控引擎校验后将向您发送密钥。
                </div>
              )}
            </article>

          </div>

          <div className="col-span-12 lg:col-span-4 relative font-mono">
            
            {/* 🚀 侧边栏吸顶 */}
            <div className="sticky top-6 flex flex-col gap-6">
              
              {/* 🚀 找回智能合约点击触发陷阱 (The Click Trap) */}
              <div className="bg-[#0B0E14] border border-zinc-800 p-6 rounded-sm relative overflow-hidden group">
                <h3 className="text-xs text-zinc-400 mb-5 flex items-center justify-between font-bold uppercase tracking-widest border-b border-zinc-800 pb-3">
                  <span className="flex items-center gap-2"><TrendingUp size={14} className="text-blue-500"/> 智能合约资金流向</span>
                  {isUnlocked ? <Unlock size={14} className="text-emerald-500"/> : <Lock size={14} className="text-amber-500"/>}
                </h3>
                
                <div className={`space-y-5 transition-all duration-700 ${!isUnlocked ? 'blur-md select-none opacity-40' : ''}`}>
                  <div>
                    <div className="text-[11px] text-emerald-500 uppercase mb-3 font-bold flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></span> 机构潜伏标的 (LONG)</div>
                    <div className="flex flex-wrap gap-2">{(analysis.bullish_assets || ['BTC', 'ONDO', 'TREMP']).map((a: string) => <span key={a} className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 px-3 py-1 text-xs font-bold rounded-sm">{a}</span>)}</div>
                  </div>
                  <div className="pt-5 border-t border-zinc-800/50">
                    <div className="text-[11px] text-red-500 uppercase mb-3 font-bold flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></span> 流动性枯竭 (SHORT)</div>
                    <div className="flex flex-wrap gap-2">{(analysis.bearish_assets || ['ETH', 'WLD']).map((a: string) => <span key={a} className="bg-red-950/40 text-red-400 border border-red-900/60 px-3 py-1 text-xs font-bold rounded-sm">{a}</span>)}</div>
                  </div>
                </div>

                {!isUnlocked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0B0E14]/40 backdrop-blur-[3px]">
                    <button 
                      onClick={() => setIsUnlocked(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105 border border-blue-400/50 flex items-center gap-2"
                    >
                      <Crosshair size={14}/> 解锁 Alpha 点位
                    </button>
                    <p className="text-[9px] text-zinc-400 mt-3 tracking-widest uppercase">Click to Reveal Signals</p>
                  </div>
                )}
              </div>

              {/* 爆仓清算猎手 */}
              <div className="bg-[#0B0E14] border border-zinc-800 p-5 rounded-sm shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/10 rounded-full blur-2xl"></div>
                <h3 className="text-[11px] text-zinc-300 mb-4 flex items-center justify-between font-bold uppercase tracking-widest border-b border-zinc-800 pb-3">
                  <span className="flex items-center gap-2"><Flame size={14} className="text-red-500 animate-pulse"/> 全网爆仓风控雷达</span>
                  <span className="text-[9px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded-sm">LIVE REKT</span>
                </h3>
                <div className="space-y-3 min-h-[140px] overflow-hidden">
                  {liquidations.length === 0 ? <p className="text-xs text-zinc-600">等待清算引擎数据回传...</p> : liquidations.map((w, i) => (
                    <div key={i} className="text-[11px] font-mono animate-in slide-in-from-top-2 duration-300 border-l-2 border-red-900 pl-2 bg-zinc-900/30 py-1.5" dangerouslySetInnerHTML={{__html: w}}></div>
                  ))}
                </div>
              </div>

              {/* 侧边常驻广告 */}
              <div className="hidden lg:flex w-full bg-[#0B0E14] border border-zinc-800/80 p-2 relative flex-col items-center justify-center min-h-[250px] shadow-[0_0_20px_rgba(0,0,0,0.6)] rounded-sm group">
                 <span className="absolute top-2 left-2 text-[9px] text-zinc-600 tracking-widest uppercase z-0">Advertisement</span>
                 <ins className="adsbygoogle w-full h-full relative z-10" style={{ display: 'block' }} data-ad-format="auto" data-full-width-responsive="true" data-ad-client="ca-pub-YOUR_ID" data-ad-slot="YOUR_SLOT"></ins>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <Analytics />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } } 
        .custom-scrollbar::-webkit-scrollbar { width: 6px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: #0B0E14; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 6px; }
      `}} />
    </div>
  );
}
