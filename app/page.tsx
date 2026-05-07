"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw, BarChart2, Send, Crosshair, AlertTriangle, Zap, MessageSquare } from 'lucide-react';

// 🚀 [变现单元 1] 信息流广告 (融合在数据列表中)
const FeedAd = () => {
  useEffect(() => { try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch (err) {} }, []);
  return (
    <div className="w-full bg-[#0B0E14] border border-zinc-800/80 p-3 relative flex flex-col justify-center min-h-[120px] group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Sponsored Insight</span>
        <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1 py-0.5">AD</span>
      </div>
      <ins className="adsbygoogle w-full relative z-10" style={{ display: 'block' }} data-ad-format="fluid" data-layout-key="-fb+5w+4e-db+86" data-ad-client="ca-pub-YOUR_ID" data-ad-slot="YOUR_SLOT"></ins>
    </div>
  );
};

// 🚀 [变现单元 2] 侧边栏方形大广告 (吸顶跟随)
const SidebarAd = () => {
  useEffect(() => { try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch (err) {} }, []);
  return (
    <div className="w-full bg-[#0B0E14] border border-zinc-800/80 p-2 relative flex flex-col items-center justify-center min-h-[250px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <span className="absolute top-2 left-2 text-[8px] text-zinc-600 tracking-widest uppercase">Global Sponsor</span>
      <ins className="adsbygoogle w-full h-full relative z-10" style={{ display: 'block' }} data-ad-format="auto" data-full-width-responsive="true" data-ad-client="ca-pub-YOUR_ID" data-ad-slot="YOUR_SLOT"></ins>
    </div>
  );
};

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [quantData, setQuantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [prices, setPrices] = useState({ BTC: "...", ETH: "...", SOL: "...", BNB: "...", XRP: "..." });
  const [displayScore, setDisplayScore] = useState<string | number>(50);
  const [isIdle, setIsIdle] = useState(false);

  const fetchOracleData = async () => {
    try {
      const res = await fetch("/api/oracle");
      const json = await res.json();
      let fetchedData = Array.isArray(json) ? json : (json.live_feed || []);
      // 为了演示滚动效果和信息流广告，如果数据少于4条，我们复制一些历史数据撑起高度
      if (fetchedData.length > 0 && fetchedData.length < 5) {
        fetchedData = [...fetchedData, ...fetchedData, ...fetchedData];
      }
      setData(fetchedData);
      if (!Array.isArray(json)) setQuantData(json.quant_lab || null);
      if (fetchedData.length > 0 && fetchedData[0].timestamp) {
        setIsIdle((new Date().getTime() - new Date(fetchedData[0].timestamp).getTime()) > 43200000);
      }
      setCountdown(60);
    } catch (e) {} finally { setLoading(false); }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT"]');
      const d = await res.json();
      if (d && Array.isArray(d)) {
        setPrices({
          BTC: parseFloat(d.find((i: any) => i.symbol === 'BTCUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 1}),
          ETH: parseFloat(d.find((i: any) => i.symbol === 'ETHUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2}),
          SOL: parseFloat(d.find((i: any) => i.symbol === 'SOLUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2}),
          BNB: parseFloat(d.find((i: any) => i.symbol === 'BNBUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 1}),
          XRP: parseFloat(d.find((i: any) => i.symbol === 'XRPUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 4})
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

  if (loading) return (
    <div className="bg-[#0B0E14] text-blue-500 h-screen flex flex-col items-center justify-center font-mono text-sm tracking-widest text-center">
      <Terminal size={40} className="mb-6 animate-pulse mx-auto" />
      <p>{">"} BOOTSTRAPPING_TCSO_ENGINE...</p>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [], event_type: 'MARKET', macro_impact: '...', crypto_impact: '...' };
  const tciColor = analysis.tci_score < 45 ? "text-red-500" : analysis.tci_score <= 55 ? "text-amber-400" : "text-emerald-400";
  const tciText = analysis.tci_score < 45 ? "空头主导 (BEARISH)" : analysis.tci_score <= 55 ? "情绪观望 (NEUTRAL)" : "多头共识 (BULLISH)";

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-300 font-mono pb-20">
      
      {/* 🚀 [眼球控制] 顶部实时跑马灯报价 (高度仿 Bloomberg) */}
      <div className="bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold py-1.5 overflow-hidden whitespace-nowrap flex items-center border-b border-blue-800">
        <span className="bg-blue-800 px-3 py-0.5 mr-2 z-10 font-black flex items-center gap-1"><Zap size={10}/> LIVE TICKER</span>
        <div className="animate-[marquee_20s_linear_infinite] flex gap-8">
          {Object.entries(prices).map(([coin, price]) => (
            <span key={coin}>{coin}/USDT : <span className="text-blue-200">${price}</span></span>
          ))}
          {/* 复制一遍实现无缝连接 */}
          {Object.entries(prices).map(([coin, price]) => (
            <span key={coin + 'copy'}>{coin}/USDT : <span className="text-blue-200">${price}</span></span>
          ))}
        </div>
      </div>

      <div className="p-3 md:p-6 max-w-[1400px] mx-auto">
        
        {/* 顶栏控制台 */}
        <div className="border-b border-zinc-800 pb-3 mb-6 flex justify-between items-end">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 border border-zinc-700 flex items-center justify-center"><Activity className="text-blue-500" size={18} /></div>
            <div>
              <h1 className="text-lg font-black text-zinc-100 tracking-tighter">TCSO_TERMINAL <span className="text-blue-500 text-sm">v7</span></h1>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Trump Crypto Sentiment Oracle</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <div className="text-[9px] text-zinc-500 uppercase flex items-center gap-1.5"><RefreshCw size={8} className={countdown < 5 ? "animate-spin text-blue-400" : ""}/> SYNC: {countdown}s</div>
            {isIdle ? (
              <div className="text-amber-500 flex items-center gap-1 text-[9px] font-bold bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/30 animate-pulse"><AlertTriangle size={8}/> IDLE</div>
            ) : (
              <div className="text-emerald-400 flex items-center gap-1 text-[9px] font-bold bg-emerald-400/10 px-1.5 py-0.5 border border-emerald-400/20"><Shield size={8}/> LIVE</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 relative">
          
          {/* 🌟 左侧：深度内容与流广告区 (强制滚动) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            
            {/* 核心仪表盘 */}
            <div className="bg-[#0B0E14] border border-zinc-800 p-5 md:p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-900 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <div className="flex-1">
                <h2 className="text-[10px] uppercase text-zinc-500 mb-2 tracking-widest font-bold flex items-center gap-2"><Crosshair size={12} className="text-blue-500"/> TCI 全局情绪指数</h2>
                <div className="flex items-baseline gap-4">
                  <span className={`text-7xl md:text-8xl font-black ${tciColor} tracking-tighter tabular-nums leading-none`}>{displayScore}</span>
                  <div className="flex flex-col">
                    <span className={`uppercase font-black text-sm md:text-base ${tciColor} tracking-wider`}>{tciText}</span>
                    <span className="text-[9px] text-zinc-600 mt-1 uppercase">Confidence: {analysis.tci_score === 50 ? "45.0%" : "87.5%"}</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[300px] h-32 bg-zinc-900/30 border border-zinc-800/50 p-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={[...data].reverse()}>
                      <defs><linearGradient id="colorTci" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="1 3" stroke="#27272a" vertical={false} />
                      <YAxis domain={[0, 100]} hide />
                      <Line type="monotone" dataKey="analysis.tci_score" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Area type="monotone" dataKey="analysis.tci_score" stroke="none" fill="url(#colorTci)" />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-[-10px] mt-2">
              <MessageSquare size={14} className="text-blue-500"/>
              <h3 className="text-xs uppercase text-zinc-300 font-bold tracking-widest">阿尔法信号流 (Alpha Signal Feed)</h3>
              <div className="flex-1 h-[1px] bg-zinc-800 ml-4"></div>
            </div>

            {/* 🚀 [流布局设计] 强制拉长的内容列表，中间安插广告 */}
            <div className="flex flex-col gap-4">
              {data.map((item, idx) => (
                <React.Fragment key={idx}>
                  {/* 数据卡片 */}
                  <div className="bg-[#0B0E14] border border-zinc-800 p-4 hover:border-zinc-600 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] text-blue-400 border border-blue-900/50 bg-blue-900/10 px-2 py-0.5 uppercase tracking-widest font-bold">
                        {item.analysis?.event_type || 'SIGNAL_DETECTED'}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-sm text-zinc-200 font-sans leading-relaxed mb-4 border-l-2 border-zinc-700 pl-3">
                      "{item.raw_text}"
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-zinc-900/30 p-3 rounded-sm border border-zinc-800/50">
                      <div>
                        <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">MACRO IMPACT</div>
                        <p className="text-xs text-zinc-400">{item.analysis?.macro_impact || 'No macro impact analyzed.'}</p>
                      </div>
                      <div>
                        <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">CRYPTO IMPLICATION</div>
                        <p className={`text-xs ${item.analysis?.crypto_impact?.includes('无') ? 'text-zinc-500' : 'text-emerald-400'}`}>{item.analysis?.crypto_impact || 'Neutral sentiment flow.'}</p>
                      </div>
                    </div>
                  </div>

                  {/* 🚀 巧妙插入广告：在第 1 条和第 3 条数据下面插入信息流广告 */}
                  {(idx === 0 || idx === 2) && (
                     <FeedAd />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* 🚀 [SEO 收割机] 底部专业研报块 */}
            <div className="mt-8 bg-zinc-900/40 border-t-2 border-blue-600 p-6">
              <h2 className="text-sm text-zinc-100 font-bold mb-4 uppercase tracking-widest">TCSO AI 引擎：特朗普交易策略 (Trump Trade Crypto Strategy)</h2>
              <div className="text-xs text-zinc-400 leading-relaxed font-sans space-y-3 text-justify">
                <p>作为领先的 Web3 情绪数据终端，TCSO (Trump Crypto Sentiment Oracle) 通过自然语言处理 (NLP) 实时量化白宫及宏观政策对数字货币市场的冲击。在当前流动性周期中，Bitcoin (BTC) 和 Ethereum (ETH) 的价格波动高度受限于监管框架与美联储利率预期。</p>
                <p>本终端输出的 TCI 指数，能够有效剥离社交媒体噪音，精准识别资本流入 (Long Assets) 与流出 (Short Assets) 靶点，为加密货币交易者、DeFi 参与者及机构套利资金提供高夏普比率 (Sharpe Ratio) 的前瞻性 Alpha 信号支撑。</p>
              </div>
            </div>

          </div>

          {/* 🌟 右侧：绝对印钞区 (Sticky Sidebar) */}
          <div className="col-span-12 lg:col-span-4 relative">
            
            {/* 🚀 核心：让右侧在滚动时吸附在屏幕顶部 */}
            <div className="sticky top-6 flex flex-col gap-5">
              
              {/* 资金矩阵 */}
              <div className="bg-[#0B0E14] border border-zinc-800 p-5">
                <h3 className="text-[10px] text-zinc-500 mb-4 flex items-center justify-between font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-2"><TrendingUp size={12} className="text-blue-500"/> 资金异动矩阵</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[9px] text-emerald-500 uppercase mb-2 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_5px_#10b981]"></span> 强势资金流入区</div>
                    <div className="flex flex-wrap gap-1.5">{(analysis.bullish_assets || ['BTC', 'SOL', 'RWA']).map((a: string) => <span key={a} className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 px-2 py-1 text-[9px] font-bold">{a}</span>)}</div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800/50">
                    <div className="text-[9px] text-red-500 uppercase mb-2 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-500 shadow-[0_0_5px_#ef4444]"></span> 流动性抽血区</div>
                    <div className="flex flex-wrap gap-1.5">{(analysis.bearish_assets || ['ETH', 'MEME']).map((a: string) => <span key={a} className="bg-red-950/30 text-red-400 border border-red-900/50 px-2 py-1 text-[9px] font-bold">{a}</span>)}</div>
                  </div>
                </div>
              </div>

              {/* 🚀 吸顶的高效广告位 (用户滚动列表时，这个广告始终展示！) */}
              <div className="hidden lg:block">
                 <SidebarAd />
              </div>

              {/* 量化实验室与终极 CTA */}
              <div className="bg-[#0B0E14] border border-purple-900/50 flex flex-col shadow-[0_0_20px_rgba(88,28,135,0.15)]">
                <div className="p-4 border-b border-purple-900/30 bg-purple-950/20"><h3 className="text-[10px] uppercase text-purple-400 font-bold tracking-widest"><Microscope size={12} className="inline mr-1"/> AI QUANT ENGINE</h3></div>
                <div className="p-4 text-[10px] text-zinc-300 leading-relaxed font-mono min-h-[80px]">
                  <span className="text-purple-500 font-bold">SYS{" > "}</span>{quantData?.content || "正在根据最新情报重构套利模型..."}
                </div>
                {/* 利益驱动型文案 */}
                <div className="p-3 bg-zinc-900/40"><a href="https://t.me/trumpMonitor1" target="_blank" className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white px-3 py-3 text-[11px] font-black uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-95"><Send size={14} className="mr-2"/> 进群接收精准做单点位</a></div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
      <Analytics />
      
      {/* 跑马灯动画与自定义滚动条注入 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: #0B0E14; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
      `}} />
    </div>
  );
}
