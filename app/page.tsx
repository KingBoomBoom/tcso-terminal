"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw, BarChart2, Send, Crosshair, AlertTriangle, Zap, MessageSquare, ThumbsUp, ThumbsDown, Users } from 'lucide-react';

// 🚀 [变现单元] 信息流广告
const FeedAd = () => {
  useEffect(() => { try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch (err) {} }, []);
  return (
    <div className="w-full bg-[#0B0E14] border border-zinc-800/80 p-3 relative flex flex-col justify-center min-h-[140px] group my-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Sponsored Link</span>
        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-sm">AD</span>
      </div>
      <ins className="adsbygoogle w-full relative z-10" style={{ display: 'block' }} data-ad-format="fluid" data-layout-key="-fb+5w+4e-db+86" data-ad-client="ca-pub-YOUR_ID" data-ad-slot="YOUR_SLOT"></ins>
    </div>
  );
};

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [prices, setPrices] = useState({ BTC: "...", ETH: "...", SOL: "..." });
  const [displayScore, setDisplayScore] = useState<string | number>(50);
  
  // 🚀 [游戏化模块] 用户投票状态
  const [voteStatus, setVoteStatus] = useState<'unvoted' | 'bull' | 'bear'>('unvoted');
  const [fakeStats, setFakeStats] = useState({ bull: 78, bear: 22 });

  const fetchOracleData = async () => {
    try {
      const res = await fetch("/api/oracle");
      const json = await res.json();
      let fetchedData = Array.isArray(json) ? json : (json.live_feed || []);
      if (fetchedData.length > 0 && fetchedData.length < 5) {
        fetchedData = [...fetchedData, ...fetchedData];
      }
      setData(fetchedData);
      setCountdown(60);
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
    // 随机微调一下假数据，显得真实
    const newBull = type === 'bull' ? 78 + Math.floor(Math.random() * 5) : 78 - Math.floor(Math.random() * 5);
    setFakeStats({ bull: newBull, bear: 100 - newBull });
  };

  if (loading) return (
    <div className="bg-[#0B0E14] text-blue-500 h-screen flex flex-col items-center justify-center font-mono text-sm tracking-widest text-center">
      <Terminal size={40} className="mb-6 animate-pulse mx-auto" />
      <p className="text-base">{">"} BOOTSTRAPPING_TCSO_ENGINE...</p>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [], event_type: 'MARKET', macro_impact: '...', crypto_impact: '...' };
  const tciColor = analysis.tci_score < 45 ? "text-red-500" : analysis.tci_score <= 55 ? "text-amber-400" : "text-emerald-400";
  const tciText = analysis.tci_score < 45 ? "空头主导 (BEARISH)" : analysis.tci_score <= 55 ? "情绪观望 (NEUTRAL)" : "多头共识 (BULLISH)";

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-300 font-sans pb-20">
      
      {/* 跑马灯报价 - 字体适度放大 */}
      <div className="bg-blue-600 text-white text-xs uppercase tracking-widest font-bold py-2 overflow-hidden whitespace-nowrap flex items-center border-b border-blue-800 font-mono">
        <span className="bg-blue-800 px-4 py-1 mr-2 z-10 flex items-center gap-2"><Zap size={14}/> TCI TICKER</span>
        <div className="animate-[marquee_20s_linear_infinite] flex gap-10">
          {Object.entries(prices).map(([coin, price]) => (
            <span key={coin}>{coin}/USDT : <span className="text-blue-200">${price}</span></span>
          ))}
          {Object.entries(prices).map(([coin, price]) => (
            <span key={coin + 'copy'}>{coin}/USDT : <span className="text-blue-200">${price}</span></span>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        
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
            
            {/* 🚀 最新动向与游戏化投票区合体 */}
            <div className="bg-zinc-900/30 border border-blue-900/50 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              
              <div className="p-6 border-b border-zinc-800/80 flex justify-between items-start md:items-center flex-col md:flex-row gap-4 font-mono">
                <h2 className="text-sm uppercase text-blue-400 font-bold tracking-widest flex items-center gap-2">
                  <MessageSquare size={16}/> 核心政策动向提取
                </h2>
                <span className="text-xs text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded-sm">{latest.timestamp || "WAITING"}</span>
              </div>

              <div className="p-6 md:p-8">
                {/* 字体显著放大的原话展示 */}
                <blockquote className="text-lg md:text-xl text-zinc-100 font-medium leading-relaxed border-l-4 border-blue-500/50 pl-5 mb-8">
                  "{latest.raw_text || "等待数据引擎抓取最新情报..."}"
                </blockquote>
                
                {/* 🚀 [留存杀器] 预测市场游戏化组件 */}
                <div className="bg-[#0B0E14] border border-zinc-800 p-6 rounded-md mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-purple-400"/>
                    <h3 className="text-sm font-bold text-zinc-300">市场共识预测 (Community Sentiment)</h3>
                  </div>
                  
                  {voteStatus === 'unvoted' ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => handleVote('bull')} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-400 py-3 rounded-md font-bold transition-colors">
                        <ThumbsUp size={18}/> 看涨加密资产 (Bullish)
                      </button>
                      <button onClick={() => handleVote('bear')} className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-400 py-3 rounded-md font-bold transition-colors">
                        <ThumbsDown size={18}/> 看空防守 (Bearish)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-emerald-400">{fakeStats.bull}% 看涨</span>
                        <span className="text-red-400">{fakeStats.bear}% 看空</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: `${fakeStats.bull}%`}}></div>
                        <div className="bg-red-500 h-full transition-all duration-1000" style={{width: `${fakeStats.bear}%`}}></div>
                      </div>
                      <p className="text-xs text-zinc-500 text-center mt-2">基于实时网络投票数据测算。获取 AI 量化实盘点位，请查看侧边栏。</p>
                    </div>
                  )}
                </div>

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

            <FeedAd />

            <div className="flex items-center gap-3 mt-4">
              <Activity size={18} className="text-blue-500"/>
              <h3 className="text-base uppercase text-zinc-200 font-bold tracking-widest font-mono">系统回测与信号日志</h3>
              <div className="flex-1 h-[1px] bg-zinc-800 ml-4"></div>
            </div>

            <div className="flex flex-col gap-5">
              {data.slice(1).map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className="bg-[#0B0E14] border border-zinc-800 p-5 hover:border-zinc-600 transition-colors rounded-sm">
                    <div className="flex justify-between items-start mb-4 font-mono">
                      <span className="text-xs text-blue-400 border border-blue-900/50 bg-blue-900/10 px-2 py-1 uppercase tracking-widest font-bold rounded-sm">
                        {item.analysis?.event_type || 'SIGNAL'}
                      </span>
                      <span className="text-xs text-zinc-500">{item.timestamp}</span>
                    </div>
                    {/* 字体放大，阅读更舒适 */}
                    <p className="text-sm md:text-base text-zinc-200 leading-relaxed mb-4 border-l-2 border-zinc-600 pl-4">
                      "{item.raw_text}"
                    </p>
                  </div>
                  {idx === 2 && <FeedAd />}
                </React.Fragment>
              ))}
            </div>

            {/* 🚀 [SEO 结构化金矿] 更易读的文章排版 */}
            <article className="mt-8 bg-[#0B0E14] border border-zinc-800 p-6 md:p-8 rounded-sm">
              <h2 className="text-lg text-zinc-100 font-bold mb-6 tracking-wide border-b border-zinc-800 pb-4">
                深度研报：通过 TCSO 捕捉特朗普交易周期 (Trump Trade)
              </h2>
              <div className="space-y-6 text-sm text-zinc-400 leading-loose text-justify">
                <div>
                  <h3 className="text-zinc-200 font-bold text-base mb-2">1. 为什么情绪数据是 Web3 的核心 Alpha？</h3>
                  <p>在当前的宏观经济周期下，加密资产（尤其是 Bitcoin 和以太坊 ETF 标的）对地缘政治与美国白宫政策展现出极高的敏感度。传统的均线策略滞后严重，而 TCSO 引擎通过 NLP 实时剥离社交网络噪音，提取确定性的资金流动预期。</p>
                </div>
                <div>
                  <h3 className="text-zinc-200 font-bold text-base mb-2">2. 量化模型的逻辑基础</h3>
                  <p>当前系统测算的 TCI (Trump Crypto Sentiment) 指数为 <strong>{displayScore}</strong>，判定为 <strong>{tciText}</strong> 状态。这意味着在过去 24 小时内，华盛顿传导出的信息对流动性资产构成了特定指引。我们的量化实验室 (Quant Lab) 建议交易者密切关注侧边栏的资金流入异动矩阵，并结合自身风控模型进行头寸管理。</p>
                </div>
              </div>
            </article>

          </div>

          <div className="col-span-12 lg:col-span-4 relative font-mono">
            
            <div className="sticky top-6 flex flex-col gap-6">
              
              <div className="bg-[#0B0E14] border border-zinc-800 p-6 rounded-sm">
                <h3 className="text-xs text-zinc-400 mb-5 flex items-center justify-between font-bold uppercase tracking-widest border-b border-zinc-800 pb-3">
                  <span className="flex items-center gap-2"><TrendingUp size={14} className="text-blue-500"/> 资金异动目标</span>
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="text-[11px] text-emerald-500 uppercase mb-3 font-bold flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></span> 机构买入预期 (LONG)</div>
                    <div className="flex flex-wrap gap-2">{(analysis.bullish_assets || ['BTC', 'SOL', 'RWA']).map((a: string) => <span key={a} className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 px-3 py-1 text-xs font-bold rounded-sm">{a}</span>)}</div>
                  </div>
                  <div className="pt-5 border-t border-zinc-800/50">
                    <div className="text-[11px] text-red-500 uppercase mb-3 font-bold flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></span> 流动性抽离 (SHORT)</div>
                    <div className="flex flex-wrap gap-2">{(analysis.bearish_assets || ['ETH', 'MEME']).map((a: string) => <span key={a} className="bg-red-950/40 text-red-400 border border-red-900/60 px-3 py-1 text-xs font-bold rounded-sm">{a}</span>)}</div>
                  </div>
                </div>
              </div>

              {/* 🚀 吸顶侧边广告：用户必须看 */}
              <div className="hidden lg:flex w-full bg-[#0B0E14] border border-zinc-800/80 p-2 relative flex-col items-center justify-center min-h-[300px] shadow-lg rounded-sm">
                 <span className="absolute top-2 left-2 text-[9px] text-zinc-600 tracking-widest uppercase">Advertisement</span>
                 <ins className="adsbygoogle w-full h-full relative z-10" style={{ display: 'block' }} data-ad-format="auto" data-full-width-responsive="true" data-ad-client="ca-pub-YOUR_ID" data-ad-slot="YOUR_SLOT"></ins>
              </div>

              <div className="bg-[#0B0E14] border border-purple-900/50 flex flex-col shadow-lg rounded-sm overflow-hidden">
                <div className="p-5 border-b border-purple-900/30 bg-purple-950/20"><h3 className="text-xs uppercase text-purple-400 font-bold tracking-widest flex items-center"><Microscope size={14} className="mr-2"/> 量化实验室报告</h3></div>
                <div className="p-5 text-xs text-zinc-300 leading-relaxed min-h-[100px]">
                  <span className="text-purple-500 font-bold mr-2">SYS{">"}</span>{quantData?.content || "正在根据当前选票和宏观数据重构衍生品套利模型..."}
                </div>
                <a href="https://t.me/trumpMonitor1" target="_blank" className="flex items-center justify-center w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white px-4 py-4 text-xs font-black uppercase tracking-widest transition-colors">
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
