import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

// 1. 字体配置：采用最稳健的变量命名
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });

// 2. 元数据配置：避开所有对象嵌套，直接使用字符串路径和数组
export const metadata: Metadata = {
  title: "TCSO Terminal | AI 驱动的情绪量化预言机",
  description: "基于 DeepSeek-V3 的加密货币情绪实时监控与量化回测终端",
  
  // 核心修复：直接引用 public 目录下的路径，不传对象
  icons: "/icon.svg", 
  
  openGraph: {
    title: "TCSO 量化终端 | AI Sentiment Oracle",
    description: "实时捕获宏观政策与加密资产波动，AI 驱动的链上情绪回测引擎。",
    url: "https://tcso-terminal.vercel.app",
    siteName: "TCSO Terminal",
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

// 3. 布局输出：移除 Readonly，使用标准的 ReactNode 定义
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans bg-[#0B0E14] text-zinc-300 antialiased">
        {children}
      </body>
    </html>
  );
}
