import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

// 引入现代化无衬线字体和极客等宽字体
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

// 🚀 核心产品优化：SEO 与社交媒体卡片配置
export const metadata: Metadata = {
  title: "TCSO Terminal | AI 驱动的情绪量化预言机",
  description: "基于 DeepSeek-V3 的加密货币情绪实时监控与量化回测终端",
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: "TCSO 量化终端 | AI Sentiment Oracle",
    description: "实时捕获宏观政策与加密资产波动，AI 驱动的链上情绪回测引擎。",
    url: "https://tcso-terminal.vercel.app",
    siteName: "TCSO Terminal",
    images: [
      {
        // 这是一张我为你挑选的极具科技感的终端数据背景图，发链接时会自动显示
        url: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop", 
        width: 1200,
        height: 630,
        alt: "TCSO Terminal Dashboard",
      },
    ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      {/* 注入极黑底色，确保加载瞬间不会出现白屏刺眼 */}
      <body className={`${inter.variable} ${firaCode.variable} font-sans bg-[#0B0E14] text-zinc-300 antialiased`}>
        {children}
      </body>
    </html>
  );
}
