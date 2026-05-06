"use client";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, ExternalLink, Shield } from 'lucide-react';

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 这里的 IP 换成你刚刚测试通过的那个服务器 IP
  const API_URL = "http://107.174.253.71:8080/oracle_data.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("数据抓取失败", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const timer = setInterval(fetchData, 60000); // 每分钟自动刷新
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="bg-black text-blue-400 h-screen flex items-center justify-center font-mono text-2xl animate-pulse">SYSTEM INITIALIZING...</div>;

  const latestScore = data[0]?.analysis?.tci_score || 50;

  return (
    <div className="bg-black min-h-screen text-gray-300 font-mono p-4">
      {/* 顶部状态栏 */}
      <div className="border-b border-blue-900 pb-2 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-blue-500 tracking-tighter flex items-center gap-2">
            <Activity className="text-blue-400" /> TCSO-TERMINAL v1.0
          </h1>
          <p className="text-xs text-gray-500 italic">基于 AI 的特朗普言论情绪量化预言机</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase">当前系统状态</div>
          <div className="text-green-500 flex items-center gap-1 text-sm"><Shield size={14}/> 实时监控中 (SSL_SECURED)</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：主看板 */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* 核心情绪指数 */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Activity size={120} />
            </div>
            <h2 className="text-sm uppercase text-gray-500 mb-4 tracking-widest">TCI 情绪指数 (Sentiment Index)</h2>
            <div className="flex items-baseline gap-4">
              <span className={`text-7xl font-bold ${latestScore > 50 ? 'text-green-500' : 'text-red-500'}`}>
                {latestScore}
              </span>
              <div className="flex flex-col">
                <span className={`uppercase font-bold ${latestScore > 50 ? 'text-green-500' : 'text-red-500'}`}>
                   {latestScore > 50 ? '多头占优 / Bullish' : '空头警报 / Bearish'}
                </span>
                <span className="text-xs text-gray-500">更新时间: {data[0]?.timestamp}</span>
              </div>
            </div>
          </div>

          {/* 趋势图表 */}
          <div className="bg-gray-900 border border-gray-800 p-4 h-64">
             <h3 className="text-xs uppercase text-gray-500 mb-4">24H 情绪波动曲线 (Sentiment Analytics)</h3>
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...data].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={[0, 100]} stroke="#333" />
                  <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333'}} />
                  <Line type="monotone" dataKey="analysis.tci_score" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
             </ResponsiveContainer>
          </div>

          {/* 实时动态流 */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase text-gray-500 flex items-center gap-2">
              <Activity size={14}/> 实时监控雷达 (Live Feed)
            </h3>
            {data.map((item, idx) => (
              <div key={idx} className="bg-gray-950 border-l-2 border-blue-900 p-4 hover:bg-gray-900 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-blue-800 font-bold">[{item.analysis.event_type}]</span>
                  <span className="text-xs text-gray-600">{item.timestamp}</span>
                </div>
                <p className="text-sm text-gray-400 mb-3 italic">"{item.raw_text}"</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-gray-600 mb-1">宏观传导</div>
                    <div className="text-gray-300">{item.analysis.macro_impact}</div>
                  </div>
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-gray-600 mb-1">币圈冲击</div>
                    <div className="text-gray-300 font-bold text-blue-400">{item.analysis.crypto_impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：分析面板 */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* 资金矩阵 */}
          <div className="bg-blue-950/20 border border-blue-900 p-5 rounded-sm">
            <h3 className="text-xs uppercase text-blue-500 mb-4 flex items-center gap-2 font-bold">
              <TrendingUp size={14}/> 资金流向矩阵 (Asset Flow)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-green-700 uppercase mb-2">预计流入 (Bullish Targets)</div>
                <div className="flex flex-wrap gap-2">
                  {data[0]?.analysis?.bullish_assets.map((a: string) => (
                    <span key={a} className="bg-green-900/30 text-green-500 px-2 py-1 text-xs border border-green-900/50">{a}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-red-700 uppercase mb-2">预计流出 (Bearish Risk)</div>
                <div className="flex flex-wrap gap-2">
                  {data[0]?.analysis?.bearish_assets.map((a: string) => (
                    <span key={a} className="bg-red-900/30 text-red-500 px-2 py-1 text-xs border border-red-900/50">{a}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* 变现按钮 */}
            <a 
              href="https://www.binance.com/" 
              target="_blank"
              className="mt-6 block w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-3 text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              在 Binance 开启量化策略 <ExternalLink size={16} />
            </a>
          </div>

          {/* 系统公告 */}
          <div className="border border-gray-800 p-4">
            <h3 className="text-xs text-gray-500 mb-3 flex items-center gap-2"><AlertTriangle size={14}/> 风险提示</h3>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              本终端由 AI 驱动，所有情绪分值仅代表言论量化分析，不构成任何投资建议。加密货币属于高风险资产，请谨慎决策。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
