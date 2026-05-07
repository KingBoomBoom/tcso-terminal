import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

// 字体配置保持不变
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

// 🚀 核心优化：采用最扁平化、最兼容的元数据结构
export const metadata: Metadata = {
  title: "TCSO Terminal | AI 驱动的情绪量化预言机",
  description: "基于 DeepSeek-V3 的加密货币情绪实时监控与量化回测终端",
  
  // 修复 1: 弃用复杂的数组，直接指路图标路径（确保 icon.svg 在 public 文件夹下）
  icons: "/icon.svg", 
  
  openGraph: {
    title: "TCSO 量化终端 | AI Sentiment Oracle",
    description: "实时捕获宏观政策与加密资产波动，AI 驱动的链上情绪回测引擎。",
    url: "https://tcso-terminal.vercel.app",
    siteName: "TCSO Terminal",
    // 修复 2: 使用纯字符串数组，这是 OpenGraph 兼容性最高的写法
    images: ["https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop"],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TCSO 量化终端 | AI Sentiment Oracle",
    description: "实时捕获宏观政策与加密资产波动，AI 驱动的链上情绪回测引擎。",
    images: ["https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop"],
  },
};

// 修复 3: 使用最标准的 React 组件 Props 定义，移除可能导致冲突的 Readonly
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={`${inter.variable} ${firaCode.variable} font-sans bg-[#0B0E14] text-zinc-300 antialiased`}>
        {children}
      </body>
    </html>
  );
}
