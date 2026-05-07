/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用代理转发逻辑
  async rewrites() {
    return [
      {
        // 匹配前端发起的 /api/oracle 请求
        source: '/api/oracle',
        // 转发至部署在 Racknerd 的 Python 后端
        destination: 'http://107.174.253.71:8080',
      },
    ];
  },
};

export default nextConfig;
