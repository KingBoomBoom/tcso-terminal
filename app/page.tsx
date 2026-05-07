"use client";
import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, ExternalLink, Shield, TrendingUp, Microscope, Terminal } from 'lucide-react';

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [quantData, setQuantData] = useState<any>(null); // 新增：专门存放量化周报的数据状态
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Vercel 代理地址，完美绕过本地网络拦截
  const API_URL = "/api/oracle";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Network error");
        const json = await res.json();
        
        // 兼容性处理：判断是旧版(数组)还是新版(对象)
        if (Array.isArray(json)) {
          setData(json); // 旧版：直接存入推文数组
        } else {
          setData(json.live_feed || []); // 新版：提取实时流
          setQuantData(json.quant_lab || null); // 新版：提取周报数据
        }
      } catch (e) {
        console.error("数据抓取失败", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const timer = setInterval(fetchData, 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="bg-black text-blue-400 h-screen flex items-center justify-center font-mono text-xl animate-pulse">SYSTEM_INITIALIZING...</div>;
  if (error || data.length === 0) return <div className="bg-black text-red-500 h-screen flex items-center justify-center font-mono p-4 text-center">OFFLINE: 无法连接至数据引擎，请检查服务器网络或代理配置</div>;

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [] };
  const score = analysis.tci_score;

  // 动态计算 TCI 颜色和文案
  const getTciStatus = (currentScore: number) => {
    if (currentScore < 45) return { text: "空头警报 / BEARISH", color: "text-red-500" };
    if (currentScore <= 55) return { text: "情绪观望 / NEUTRAL", color: "text-yellow-500" };
    return { text: "多头狂热 / BULLISH", color: "text-green-500" };
  };

  const tciStatus = getTciStatus(score);

  return (
    <div className="bg-black min-h-screen text-gray-300 font-mono p-4">
      {/* 顶部状态栏 */}
      <div className="border-b border-blue-900 pb-2 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-500 tracking-tighter flex items-center gap-2">
            <Activity className="text-blue-400" /> TCSO-TERMINAL v1.1
          </h1>
          <p className="text-[10px] md:text-xs text-gray-500 italic">基于 AI 的特朗普言论情绪量化预言机</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-[10px] text-gray-500 uppercase">当前系统状态</div>
          <div className="text-green-500 flex items-center gap-1 text-xs"><Shield size={12}/> 实时监控中 (LIVE)</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* 指数显示 */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-sm relative overflow-hidden">
            <h2 className="text-xs uppercase text-gray-500 mb-4 tracking-widest font-bold">TCI 情绪指数</h2>
            <div className="flex items-baseline gap-4">
              <span className={`text-6xl md:text-7xl font-bold ${tciStatus.color}`}>
                {score}
              </span>
              <div className="flex flex-col">
                <span className={`uppercase font-bold text-sm ${tciStatus.color}`}>
                   {tciStatus.text}
                </span>
                <span className="text-[10px] text-gray-500">最后更新: {latest.timestamp || '等待数据接入'}</span>
              </div>
            </div>
          </div>

          {/* 图表 */}
          <div className="bg-gray-900 border border-gray-800 p-4 h-64">
             <h3 className="text-[10px] uppercase text-gray-500 mb-4">24H 情绪波动曲线</h3>
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...data].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={[0, 100]} stroke="#333" fontSize={10} />
                  <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', fontSize: '12px'}} />
                  <Line type="step" dataKey={() => 50} stroke="#333" strokeDasharray="5 5" strokeWidth={1} dot={false} activeDot={false} />
                  <Line type="monotone" dataKey="analysis.tci_score" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
             </ResponsiveContainer>
          </div>

          {/* 实时流 */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase text-gray-500 flex items-center gap-2">
              <Activity size={12}/> 实时监控雷达 (Live Feed)
            </h3>
            {data.map((item, idx) => (
              <div key={idx} className="bg-gray-950 border-l-2 border-blue-900 p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] text-blue-800 font-bold">[{item.analysis?.event_type || 'GENERAL'}]</span>
                  <span className="text-[10px] text-gray-600">{item.timestamp}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-400 mb-3 italic">"{item.raw_text}"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-gray-600 mb-1">宏观传导</div>
                    <div className="text-gray-300">{item.analysis?.macro_impact}</div>
                  </div>
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-gray-600 mb-1">币圈冲击</div>
                    <div className="text-gray-300 font-bold text-blue-400">{item.analysis?.crypto_impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* 资产流向矩阵 */}
          <div className="bg-blue-950/20 border border-blue-900 p-5 rounded-sm">
            <h3 className="text-[10px] uppercase text-blue-500 mb-4 flex items-center gap-2 font-bold">
              <TrendingUp size={12}/> 资产流向矩阵
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[9px] text-green-700 uppercase mb-2 font-bold">预计流入 (BULL)</div>
                <div className="flex flex-wrap gap-2">
                  {(analysis.bullish_assets || []).length > 0 ? (
                    analysis.bullish_assets.map((a: string) => (
                      <span key={a} className="bg-green-900/30 text-green-500 px-2 py-1 text-[10px] border border-green-900/50">{a}</span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-600">暂无明显流入信号</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-red-700 uppercase mb-2 font-bold">预计流出 (BEAR)</div>
                <div className="flex flex-wrap gap-2">
                  {(analysis.bearish_assets || []).length > 0 ? (
                    analysis.bearish_assets.map((a: string) => (
                      <span key={a} className="bg-red-900/30 text-red-500 px-2 py-1 text-[10px] border border-red-900/50">{a}</span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-600">暂无明显流出信号</span>
                  )}
                </div>
              </div>
            </div>
            <a 
              href="https://www.binance.com/" 
              target="_blank"
              className="mt-6 block w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              在 Binance 执行策略 <ExternalLink size={14} />
            </a>
          </div>

          {/* 情绪量化实验室 (动态渲染版) */}
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 blur-3xl"></div>
            <h3 className="text-[10px] uppercase text-gray-400 mb-4 flex items-center gap-2 font-bold tracking-widest">
              <Microscope size={12} className="text-purple-500"/> 情绪量化实验室 (QUANT LAB)
            </h3>
            
            <div className="mb-3 border-b border-gray-800 pb-2 flex justify-between items-baseline">
              <span className="text-xs text-purple-400 font-bold">{quantData?.week_label || "AI 回测周报"}</span>
              <span className="text-[9px] text-gray-500">{quantData?.date || "待同步"}</span>
            </div>
            
            <div className="text-[11px] text-gray-400 leading-relaxed font-mono space-y-2">
              <p>
                <Terminal size={10} className="inline mr-1 text-gray-500"/>
                {quantData?.content || "正在等待 AI 引擎生成最新回测数据..."}
              </p>
            </div>

            {/* 这里替换成了 TG 的真实引流逻辑，记得把 t.me 后面的链接换成你自己的 */}
            <a
              href="https://t.me/你的用户名或群组"
              target="_blank"
              className="mt-5 block w-full bg-gray-950 hover:bg-gray-800 text-gray-400 text-center py-2.5 text-[10px] font-bold border border-gray-800 transition-colors"
            >
              订阅内部 Telegram 获取实时异动推送 ↗
            </a>
          </div>

        </div>
        
        {/* Vercel 统计组件 */}
        <Analytics />
      </div>
    </div>
  );
}
