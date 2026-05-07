"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, ExternalLink, Shield, TrendingUp, Microscope, Terminal, ArrowRightCircle, RefreshCw } from 'lucide-react';

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [quantData, setQuantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(60); // 新增：距离下次刷新的倒计时

  const API_URL = "/api/oracle";

  const fetchData = async () => {
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
      setCountdown(60); // 抓取成功后重置倒计时
    } catch (e) {
      console.error("数据抓取失败", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 数据抓取定时器
    const dataTimer = setInterval(fetchData, 60000);
    // UI 倒计时更新器
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(dataTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  // 极客风开机动画
  if (loading) return (
    <div className="bg-slate-950 text-emerald-500 h-screen flex flex-col items-center justify-center font-mono text-sm tracking-widest">
      <Terminal size={40} className="mb-6 animate-pulse text-blue-500" />
      <div className="space-y-2 opacity-80">
        <p>{">"} INITIALIZING_CORE_SYSTEM...</p>
        <p>{">"} CONNECTING_TO_ORACLE_ENGINE...</p>
        <p className="animate-pulse text-blue-400">{">"} FETCHING_SENTIMENT_DATA_FROM_NODES...</p>
      </div>
    </div>
  );

  if (error || data.length === 0) return (
    <div className="bg-slate-950 text-red-500 h-screen flex items-center justify-center font-mono p-4 text-center">
      <div className="border border-red-900/50 bg-red-950/20 p-6 rounded-md">
        <p className="font-bold mb-2">CRITICAL ERROR</p>
        <p className="text-xs text-red-400/80">OFFLINE: 无法连接至数据引擎，请检查服务器网络或 Cloudflare 路由配置</p>
      </div>
    </div>
  );

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [] };
  const score = analysis.tci_score;

  const getTciStatus = (currentScore: number) => {
    if (currentScore < 45) return { text: "空头警报 / BEARISH", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", shadow: "drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]" };
    if (currentScore <= 55) return { text: "情绪观望 / NEUTRAL", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", shadow: "drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]" };
    return { text: "多头狂热 / BULLISH", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", shadow: "drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" };
  };

  const tciStatus = getTciStatus(score);

  // 动态生成币安交易链接 + 返佣参数
  let targetAsset = "BTC";
  if (analysis.bullish_assets && analysis.bullish_assets.length > 0) {
    const firstAsset = analysis.bullish_assets[0].toUpperCase();
    if (['BTC', 'ETH', 'SOL', 'DOGE', 'BNB'].includes(firstAsset)) {
      targetAsset = firstAsset;
    }
  }
  // PM核心点：在这里填入你的币安邀请码 (比如 ref=12345678)
  const binanceLink = `https://www.binance.com/en/trade/${targetAsset}_USDT?ref=YOUR_AFFILIATE_CODE`;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-mono p-3 md:p-8">
      
      {/* 顶部状态栏 */}
      <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-blue-400 tracking-tighter flex items-center gap-2 md:gap-3">
            <Activity className="text-blue-500" size={24} /> TCSO-TERMINAL v2.1
          </h1>
          <p className="text-[10px] md:text-sm text-slate-500 italic mt-1">基于 AI 的特朗普言论情绪量化预言机</p>
        </div>
        
        {/* 动态刷新指示器 */}
        <div className="text-right flex flex-col items-end">
          <div className="text-[9px] md:text-xs text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <RefreshCw size={10} className={countdown < 5 ? "animate-spin text-blue-400" : ""} /> 
            {countdown}s 后刷新
          </div>
          <div className="text-emerald-500 flex items-center gap-1.5 text-xs md:text-sm font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">
             <Shield size={12}/> LIVE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6 md:space-y-8">
          
          {/* 指数显示面板 */}
          <div className={`border ${tciStatus.border} ${tciStatus.bg} p-6 md:p-8 rounded-lg relative overflow-hidden backdrop-blur-sm transition-all duration-700`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl mix-blend-overlay"></div>
            <h2 className="text-xs md:text-sm uppercase text-slate-400 mb-4 md:mb-6 tracking-widest font-semibold flex items-center gap-2">
              TCI 情绪指数评估
            </h2>
            <div className="flex items-center gap-4 md:gap-6">
              <span className={`text-6xl md:text-8xl font-black ${tciStatus.color} tracking-tighter ${tciStatus.shadow} transition-colors duration-500`}>
                {score}
              </span>
              <div className="flex flex-col gap-1.5 md:gap-2">
                <span className={`uppercase font-bold text-base md:text-xl ${tciStatus.color} tracking-wide`}>
                   {tciStatus.text}
                </span>
                <span className="text-[10px] md:text-xs text-slate-500 font-medium bg-slate-950/50 px-2 py-1 rounded inline-block w-max">
                  SYS_TIME: {latest.timestamp || 'WAITING'}
                </span>
              </div>
            </div>
          </div>

          {/* 图表 */}
          <div className="bg-slate-900/50 border border-slate-800 p-4 md:p-6 rounded-lg h-60 md:h-72">
             <h3 className="text-[10px] md:text-xs uppercase text-slate-500 mb-4 md:mb-6 tracking-wider font-semibold">24H 情绪波动折线</h3>
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...data].reverse()} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', fontSize: '12px', color: '#cbd5e1'}} 
                    itemStyle={{color: '#60a5fa'}}
                  />
                  <Line type="step" dataKey={() => 50} stroke="#475569" strokeDasharray="5 5" strokeWidth={1} dot={false} activeDot={false} />
                  <Line type="monotone" dataKey="analysis.tci_score" stroke="#3b82f6" strokeWidth={3} dot={{r: 2, fill: '#3b82f6', strokeWidth: 0}} activeDot={{r: 5, fill: '#60a5fa'}} />
                </LineChart>
             </ResponsiveContainer>
          </div>

          {/* 实时流 Feed */}
          <div className="space-y-4 md:space-y-5">
            <h3 className="text-xs md:text-sm uppercase text-slate-400 flex items-center gap-2 font-bold tracking-widest border-b border-slate-800 pb-3">
              <Activity size={14} className="text-blue-500"/> 实时监控雷达
            </h3>
            {data.map((item, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/80 hover:border-blue-900/50 transition-colors p-4 md:p-5 rounded-lg shadow-sm group">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-blue-950/60 text-blue-400 text-[10px] md:text-xs px-2 py-0.5 md:px-2.5 md:py-1 rounded-sm font-bold tracking-wide border border-blue-900/30">
                    {item.analysis?.event_type || 'GENERAL'}
                  </span>
                  <span className="text-[10px] md:text-xs text-slate-500">{item.timestamp}</span>
                </div>
                <p className="text-sm md:text-base text-slate-300 mb-4 md:mb-5 leading-relaxed italic border-l-2 border-slate-700 group-hover:border-blue-500/50 transition-colors pl-3">
                  "{item.raw_text}"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-slate-950/60 p-3 rounded-md border border-slate-800/50">
                    <div className="text-[10px] md:text-xs text-slate-500 mb-1 md:mb-1.5 uppercase font-semibold">宏观传导分析</div>
                    <div className="text-xs md:text-sm text-slate-300 leading-snug">{item.analysis?.macro_impact}</div>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-md border border-slate-800/50">
                    <div className="text-[10px] md:text-xs text-slate-500 mb-1 md:mb-1.5 uppercase font-semibold">加密资产冲击</div>
                    <div className="text-xs md:text-sm font-medium text-blue-400 leading-snug">{item.analysis?.crypto_impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧边栏面板 */}
        <div className="col-span-12 lg:col-span-4 space-y-6 md:space-y-8">
          
          {/* 资产矩阵 */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-xs md:text-sm uppercase text-slate-300 mb-5 md:mb-6 flex items-center gap-2 font-bold tracking-widest">
              <TrendingUp size={14} className="text-blue-500"/> 资产流向矩阵
            </h3>
            <div className="space-y-5">
              <div>
                <div className="text-[10px] md:text-xs text-emerald-500/80 uppercase mb-2 md:mb-3 font-bold tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></span> 资金流入预期
                </div>
                <div className="flex flex-wrap gap-2 md:gap-2.5">
                  {(analysis.bullish_assets || []).length > 0 ? (
                    analysis.bullish_assets.map((a: string) => (
                      <span key={a} className="bg-emerald-950/50 text-emerald-400 px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold rounded-md border border-emerald-900/50 shadow-sm">{a}</span>
                    ))
                  ) : (
                    <span className="text-[10px] md:text-xs text-slate-600 italic">暂无明显流入信号</span>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800/50">
                <div className="text-[10px] md:text-xs text-red-500/80 uppercase mb-2 md:mb-3 font-bold tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 opacity-70"></span> 资金流出预期
                </div>
                <div className="flex flex-wrap gap-2 md:gap-2.5">
                  {(analysis.bearish_assets || []).length > 0 ? (
                    analysis.bearish_assets.map((a: string) => (
                      <span key={a} className="bg-red-950/50 text-red-400 px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold rounded-md border border-red-900/50 shadow-sm">{a}</span>
                    ))
                  ) : (
                    <span className="text-[10px] md:text-xs text-slate-600 italic">暂无明显流出信号</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Binance 引流变现按钮 */}
            <a 
              href={binanceLink} 
              target="_blank"
              className="mt-6 md:mt-8 block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-center py-3 md:py-3.5 rounded-md text-xs md:text-sm font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              前往 Binance 交易 {targetAsset} <ExternalLink size={14} />
            </a>
          </div>

          {/* Quant Lab */}
          <div className="bg-slate-900/80 border border-purple-900/30 p-5 md:p-6 rounded-lg relative overflow-hidden shadow-lg group">
            <div className="absolute -top-10 -right-10 w-24 h-24 md:w-32 md:h-32 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-700"></div>
            
            <h3 className="text-[10px] md:text-xs uppercase text-slate-300 mb-4 md:mb-5 flex items-center gap-2 font-bold tracking-widest">
              <Microscope size={14} className="text-purple-400"/> 量化实验室 (QUANT LAB)
            </h3>
            
            <div className="mb-3 md:mb-4 border-b border-slate-800 pb-2 md:pb-3 flex justify-between items-end">
              <span className="text-xs md:text-sm text-purple-400 font-bold tracking-wide">{quantData?.week_label || "AI 回测周报"}</span>
              <span className="text-[10px] md:text-xs text-slate-500 font-medium bg-slate-950/50 px-1.5 py-0.5 rounded">{quantData?.date || "待同步"}</span>
            </div>
            
            <div className="text-[11px] md:text-sm text-slate-400 leading-relaxed font-mono space-y-2 md:space-y-3 bg-slate-950/50 p-3 md:p-4 rounded-md border border-slate-800">
              <p>
                <Terminal size={12} className="inline mr-1.5 text-slate-500 mb-0.5"/>
                {quantData?.content || "正在调度大模型引擎聚合最新回测数据，请等待本周计算周期结束..."}
              </p>
            </div>

            {/* TG 社区引流 */}
            <a
              href="https://t.me/YOUR_TG_LINK"
              target="_blank"
              className="mt-4 md:mt-6 flex items-center justify-between w-full bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-2.5 md:px-4 md:py-3 rounded-md text-[10px] md:text-xs font-bold border border-slate-800 transition-colors group/btn"
            >
              <span>订阅内部 TG 获取实时推送</span>
              <ArrowRightCircle size={14} className="text-slate-500 group-hover/btn:text-purple-400 transition-colors" />
            </a>
          </div>

        </div>
        
        <Analytics />
      </div>
    </div>
  );
}
