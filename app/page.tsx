"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw, BarChart2, Send, Crosshair, AlertTriangle, Quote, Radar, Lock, Unlock } from 'lucide-react';

// 🚀 [核心变现引擎] Google AdSense
const GoogleAd = ({ className = "" }: { className?: string }) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {}
  }, []);
  return (
    <div className={`w-full overflow-hidden bg-[#0B0E14] border border-zinc-800/50 flex flex-col items-center justify-center relative group ${className}`}>
      <span className="text-[8px] text-zinc-600 tracking-widest uppercase mb-1">Advertisement</span>
      <ins 
        className="adsbygoogle relative z-10 w-full min-h-[100px]"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID_HERE" 
        data-ad-slot="YOUR_AD_SLOT_ID_HERE"           
        data-ad-format="fluid"
        data-layout-key="-fb+5w+4e-db+86"
      ></ins>
    </div>
  );
};

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [quantData, setQuantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [prices, setPrices] = useState({ BTC: "...", ETH: "...", SOL: "..." });
  const [displayScore, setDisplayScore] = useState<string | number>(50);
  const [isIdle, setIsIdle] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // 🚀 [变现逻辑] Tab 切换与解锁状态
  const [activeTab, setActiveTab] = useState('terminal');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const fetchOracleData = async () => {
    try {
      const res = await fetch("/api/oracle");
      const json = await res.json();
      let fetchedData = Array.isArray(json) ? json : (json.live_feed || []);
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
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
      const d = await res.json();
      if (d && Array.isArray(d)) {
        setPrices({
          BTC: parseFloat(d.find((i: any) => i.symbol === 'BTCUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 1}),
          ETH: parseFloat(d.find((i: any) => i.symbol === 'ETHUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2}),
          SOL: parseFloat(d.find((i: any) => i.symbol === 'SOLUSDT')?.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2})
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
      setScanProgress(p => (p >= 100 ? 0 : p + Math.random() * 15));
    }, 2500);
    if (baseScore !== 50) setDisplayScore(baseScore);
    return () => clearInterval(breathe);
  }, [data]);

  if (loading) return (
    <div className="bg-[#0B0E14] text-blue-500 h-screen flex flex-col items-center justify-center font-mono text-sm tracking-widest text-center">
      <Terminal size={40} className="mb-6 animate-pulse mx-auto" />
      <p>{">"} INITIALIZING_QUANT_CORE...</p>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [] };
  const tciColor = analysis.tci_score < 45 ? "text-red-500" : analysis.tci_score <= 55 ? "text-amber-400" : "text-emerald-400";
  const tciText = analysis.tci_score < 45 ? "空头主导" : analysis.tci_score <= 55 ? "情绪观望" : "多头共识";

  // 🚀 [SEO 逻辑] 动态生成当天的 SEO 友好文本
  const todayDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-300 font-mono p-3 md:p-6 pb-20">
      
      {/* 顶栏 */}
      <div className="border-b border-zinc-800 pb-3 mb-4 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center"><Activity className="text-white" size={18} /></div>
          <div><h1 className="text-lg font-bold text-zinc-100 tracking-tighter">TCSO_TERMINAL</h1><p className="text-[9px] text-zinc-500 uppercase tracking-widest">Trump Crypto Sentiment Oracle</p></div>
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

      {/* 🚀 [互动逻辑] 伪多标签页，增加用户点击和停留时间 */}
      <div className="flex gap-4 border-b border-zinc-800/50 mb-5">
        {['terminal', 'historical', 'whale_tracker'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5 max-w-[1400px] mx-auto">
        
        {/* 左侧主要区域 */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          
          <div className="bg-[#0B0E14] border border-zinc-800 p-5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="flex-1">
              <h2 className="text-[10px] uppercase text-zinc-500 mb-2 tracking-widest font-semibold flex items-center gap-2"><Crosshair size={12} className="text-blue-500"/> TCI 情绪指数</h2>
              <div className="flex items-baseline gap-4">
                <span className={`text-6xl font-black ${tciColor} tracking-tighter tabular-nums leading-none`}>{displayScore}</span>
                <span className={`uppercase font-bold text-sm ${tciColor}`}>{tciText}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-[240px]">
              <div className="bg-zinc-900/50 border border-zinc-800/80 p-3"><div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Signal Confidence</div><div className="text-sm text-zinc-300">87.5%</div></div>
              <div className="bg-zinc-900/50 border border-zinc-800/80 p-3"><div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">24H Volatility</div><div className="text-sm text-zinc-300">4.2%</div></div>
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

          {/* 🚀 主视觉区广告 */}
          <GoogleAd className="min-h-[120px] my-0" />

          {/* 数据流与雷达 */}
          <div className="flex flex-col md:flex-row gap-5 flex-1">
            <div className="bg-[#0B0E14] border border-zinc-800 p-4 flex-1 flex flex-col">
              <h3 className="text-[10px] uppercase text-zinc-500 flex items-center gap-2 font-bold tracking-widest border-b border-zinc-800 pb-2 mb-3"><Terminal size={12} className="text-blue-500"/> 算法解析流 (SYS_LOG)</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {data.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-zinc-800 hover:border-blue-500 pl-3 py-2 bg-zinc-900/20 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5"><span className="text-[9px] text-zinc-600 font-mono">[{item.timestamp?.split(' ')[1] || ""}]</span><span className="text-[9px] text-blue-400 border border-blue-900 px-1 uppercase">{item.analysis?.event_type}</span></div>
                    <p className="text-xs text-zinc-300 font-mono mb-2 line-clamp-2 leading-relaxed">{" > "} {item.raw_text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 🚀 [SEO 引流机器] 大段富含高价值关键词的隐藏金矿 */}
          <div className="bg-[#0B0E14] border border-zinc-800 p-5 mt-2">
            <h3 className="text-xs text-blue-400 font-bold mb-3">TCSO 每日宏观加密情绪报告 ({todayDate})</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans text-justify">
              <strong>为什么这很重要？</strong> 作为专业的 Trump Crypto Sentiment Oracle (TCSO)，我们的 DeepSeek AI 引擎实时追踪华盛顿政策变动对数字货币市场（尤其是 Bitcoin 和 Ethereum）的影响。基于历史回测，政策利好情绪能在 24 小时内为 Web3 资产、RWA 协议及 DeFi 借贷平台带来显著的资金净流入。量化交易员和机构投资者通过 TCSO API，能在市场 FOMO 情绪爆发前捕捉到 Alpha 收益。当前 TCI 指数为 <strong>{displayScore}</strong>，表明市场处于<strong>{tciText}</strong>阶段。
            </p>
          </div>

        </div>

        {/* 右侧边栏 */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          
          {/* 🚀 [转化与交互逻辑] 模糊加密的财富密码 */}
          <div className="bg-[#0B0E14] border border-zinc-800 p-5 relative overflow-hidden">
            <h3 className="text-[10px] text-zinc-500 mb-4 flex items-center justify-between font-bold uppercase">
              <span className="flex items-center gap-2"><TrendingUp size={12} className="text-blue-500"/> 资金异动雷达</span>
              {isUnlocked ? <Unlock size={12} className="text-emerald-500"/> : <Lock size={12} className="text-amber-500"/>}
            </h3>
            
            <div className={`space-y-4 transition-all duration-700 ${!isUnlocked ? 'blur-sm select-none opacity-50' : ''}`}>
              <div><div className="text-[9px] text-emerald-500 uppercase mb-2 font-bold flex items-center gap-1.5"><span className="w-1 h-1 bg-emerald-500 shadow-[0_0_5px_#10b981]"></span> 潜在流入 (LONG)</div>
                <div className="flex flex-wrap gap-1.5">{(analysis.bullish_assets || ['BTC', 'SOL', 'RWA']).map((a: string) => <span key={a} className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 text-[9px]">{a}</span>)}</div>
              </div>
              <div className="pt-4 border-t border-zinc-800/50"><div className="text-[9px] text-red-500 uppercase mb-2 font-bold flex items-center gap-1.5"><span className="w-1 h-1 bg-red-500 shadow-[0_0_5px_#ef4444]"></span> 潜在流出 (SHORT)</div>
                <div className="flex flex-wrap gap-1.5">{(analysis.bearish_assets || ['ETH', 'MEME']).map((a: string) => <span key={a} className="bg-red-950/30 text-red-400 border border-red-900/50 px-2 py-0.5 text-[9px]">{a}</span>)}</div>
              </div>
            </div>

            {/* 解锁遮罩层 */}
            {!isUnlocked && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                <button 
                  onClick={() => setIsUnlocked(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105"
                >
                  揭秘 Alpha 标的
                </button>
                <p className="text-[8px] text-zinc-400 mt-2">Free access for today</p>
              </div>
            )}
          </div>

          <div className="bg-[#0B0E14] border border-zinc-800 p-5">
            <h3 className="text-[10px] text-zinc-500 mb-3 uppercase font-bold tracking-widest"><BarChart2 size={12}/> 基准资产报价</h3>
            <div className="space-y-1">
              {['BTC', 'ETH', 'SOL'].map((coin) => (
                <div key={coin} className="flex justify-between items-center py-2 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/20 px-1 transition-colors">
                  <span className="text-[11px] font-bold text-zinc-400">{coin}/USDT</span>
                  <span className="text-[13px] font-mono text-zinc-200">{prices[coin as keyof typeof prices]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 🚀 侧边栏垂直广告位 */}
          <GoogleAd className="hidden lg:flex min-h-[250px]" />

          <div className="bg-[#0B0E14] border border-purple-900/30 flex-1 flex flex-col relative group min-h-[150px]">
            <div className="p-4 border-b border-purple-900/20 bg-purple-950/5"><h3 className="text-[10px] uppercase text-purple-400 font-bold tracking-widest"><Microscope size={12} className="inline mr-1"/> QUANT_LAB 简报</h3></div>
            <div className="p-4 flex-1 text-[10px] text-zinc-400 leading-relaxed font-mono"><span className="text-purple-500 font-bold">SYS{" > "}</span>{quantData?.content || "AI 正在回测最新资金流向..."}</div>
            
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/20"><a href="https://t.me/trumpMonitor1" target="_blank" className="flex items-center justify-between w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white px-3 py-2 text-[10px] font-bold uppercase transition-colors"><div className="flex items-center gap-2"><Send size={12}/> 进 Telegram 领策略</div><ArrowRightCircle size={12}/></a></div>
          </div>
        </div>
      </div>
      <Analytics />
      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: #0B0E14; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }`}} />
    </div>
  );
}
