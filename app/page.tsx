"use client";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, ExternalLink, Shield } from 'lucide-react';

export default function TCSOTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 这里的 IP 换成你刚才测试通过的那个服务器 IP
  const API_URL = "https://api.cleanstems.com/oracle_data.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Network error");
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
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
  if (error || data.length === 0) return <div className="bg-black text-red-500 h-screen flex items-center justify-center font-mono p-4 text-center">OFFLINE: 无法连接至数据引擎，请检查服务器 8080 端口</div>;

  const latest = data[0] || {};
  const analysis = latest.analysis || { tci_score: 50, bullish_assets: [], bearish_assets: [] };
  const score = analysis.tci_score;

  return (
    <div className="bg-black min-h-screen text-gray-300 font-mono p-4">
      {/* 顶部状态栏 */}
      <div className="border-b border-blue-900 pb-2 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-500 tracking-tighter flex items-center gap-2">
            <Activity className="text-blue-400" /> TCSO-TERMINAL v1.0
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
              <span className={`text-6xl md:text-7xl font-bold ${score > 50 ? 'text-green-500' : 'text-red-500'}`}>
                {score}
              </span>
              <div className="flex flex-col">
                <span className={`uppercase font-bold text-sm ${score > 50 ? 'text-green-500' : 'text-red-500'}`}>
                   {score > 50 ? '多头占优 / Bullish' : '空头警报 / Bearish'}
                </span>
                <span className="text-[10px] text-gray-500">最后更新: {latest.timestamp}</span>
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
          <div className="bg-blue-950/20 border border-blue-900 p-5 rounded-sm">
            <h3 className="text-[10px] uppercase text-blue-500 mb-4 flex items-center gap-2 font-bold">
              <TrendingUp size={12}/> 资产流向矩阵
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[9px] text-green-700 uppercase mb-2 font-bold">预计流入 (BULL)</div>
                <div className="flex flex-wrap gap-2">
                  {(analysis.bullish_assets || []).map((a: string) => (
                    <span key={a} className="bg-green-900/30 text-green-500 px-2 py-1 text-[10px] border border-green-900/50">{a}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-red-700 uppercase mb-2 font-bold">预计流出 (BEAR)</div>
                <div className="flex flex-wrap gap-2">
                  {(analysis.bearish_assets || []).map((a: string) => (
                    <span key={a} className="bg-red-900/30 text-red-500 px-2 py-1 text-[10px] border border-red-900/50">{a}</span>
                  ))}
                </div>
              </div>
            </div>
            <a 
              href="https://www.binance.com/" 
              target="_blank"
              className="mt-6 block w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              在 Binance 执行策略 <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
