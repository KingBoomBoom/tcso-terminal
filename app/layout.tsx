import './globals.css'

export const metadata = {
  title: 'TCSO Terminal - 特朗普情绪预言机',
  description: 'AI 驱动的宏观情绪量化终端',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
