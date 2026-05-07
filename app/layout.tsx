import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });

export const metadata: Metadata = {
  title: "TCSO Terminal | AI 驱动的情绪量化预言机",
  description: "基于 DeepSeek-V3 的加密货币情绪实时监控与量化回测终端",
  // 核心修复：直接使用字符串路径引用 public 目录下的图标
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
    images: ["https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop"],
  },
};

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
