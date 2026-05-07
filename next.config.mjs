/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // 告诉 Vercel：只要网页请求 /api/oracle
        source: '/api/oracle',
        // Vercel 就去后台悄悄访问这个真实的 HTTPS 地址
        destination: 'https://api.cleanstems.com/oracle_data.json',
      },
    ]
  },
};

export default nextConfig;
