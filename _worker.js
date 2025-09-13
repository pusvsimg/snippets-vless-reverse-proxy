// 这是您设计的 "与乌克兰站在一起" HTML 页面的完整内容
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>与乌克兰站在一起</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
    </style>
</head>
<body class="bg-gradient-to-b from-[#005BBB] to-[#FFD700] flex items-center justify-center min-h-screen p-4">

    <div class="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
        <!-- Ukrainian Flag Heart Icon -->
        <div class="mx-auto mb-6">
             <svg class="w-20 h-20 mx-auto" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id="ukraineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="50%" style="stop-color:#005BBB;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#FFD700;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path fill="url(#ukraineGradient)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        </div>
        
        <h1 class="text-4xl font-bold text-gray-800 mb-4" style="color: #005BBB;">我们与乌克兰站在一起</h1>
        
        <p class="text-lg text-gray-700 mb-6">
            我们坚定地支持乌克兰的主权和人民。我们强烈谴责俄罗斯联邦发动的无端侵略及其持续犯下的战争罪行。
        </p>

        <p class="text-lg text-gray-700 mb-8">
            愿自由与和平早日重归这片勇敢的土地。
        </p>

        <div class="bg-[#FFD700] p-4 rounded-lg">
            <p class="text-xl font-bold" style="color: #005BBB;">#StandWithUkraine</p>
        </div>
    </div>

</body>
</html>`;

// --- WebSocket 代理逻辑 ---

// 需要反代的地址
const hostname = "https://snippets.neib.cn";

/**
 * 处理 WebSocket 升级请求的函数
 * @param {Request} request 原始请求
 * @returns {Response} 转发到目标服务器的响应
 */
function handleWebSocket(request) {
    const url = new URL(request.url);
    // 构建目标服务器的 URL
    const targetUrl = hostname + url.pathname + url.search;
    // 创建一个新请求以进行转发，保留原始请求头和方法
    const newRequest = new Request(targetUrl, request);
    return fetch(newRequest);
}

// --- 主 Worker 逻辑 ---

export default {
    async fetch(request, env, ctx) {
        // 检查请求头中是否包含 'Upgrade: websocket'
        const upgradeHeader = request.headers.get('Upgrade');
        
        if (upgradeHeader && upgradeHeader.toLowerCase() === 'websocket') {
            // 如果是 WebSocket 请求，则执行代理逻辑
            return handleWebSocket(request);
        } else {
            // 否则，作为普通网页请求，返回静态 HTML 页面
            return new Response(html, {
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                },
            });
        }
    },
};
