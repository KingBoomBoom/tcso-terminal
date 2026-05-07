import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

// 1. 字体配置：保留极客感必备的 Inter 和 Fira Code
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });

// 2. 核心元数据：仅保留最基础的文本定义，避开所有路径和对象冲突
export const metadata: Metadata = {
  title: "TCSO Terminal | AI 驱动的情绪量化预言机",
  description: "基于 DeepSeek-V3 的加密货币情绪实时监控与量化回测终端",
};

// 3. 标准布局：移除 Readonly 和复杂图标引用
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
