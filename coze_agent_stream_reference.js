/**
 * 豆包(Coze) AI Agent 流式调用参考实现
 * 
 * 使用说明：
 * 1. 需要在微信小程序项目配置中设置 urlCheck: false
 * 2. 需要在 project.config.json 中启用 ES6 支持
 * 3. 需要将 api.coze.cn 添加到小程序的 request 合法域名中
 */

// 1. 基础配置
const COZE_CONFIG = {
  BOT_ID: "your_bot_id", // 在Coze平台获取
  API_KEY: "your_api_key", // 在Coze平台生成
  API_URL: "https://api.coze.cn/v3/chat"
}

// 2. 初始化解码器（用于处理流式响应）
const decoder = new TextDecoder();

// 3. 核心API调用方法
function callCozeAPI(message, onUpdate) {
  return new Promise((resolve, reject) => {
    // 创建请求任务
    const requestTask = wx.request({
      url: COZE_CONFIG.API_URL,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${COZE_CONFIG.API_KEY}`,
        'content-type': 'application/json',
        'Accept': 'text/event-stream'
      },
      data: {
        bot_id: COZE_CONFIG.BOT_ID,
        user_id: "user_id", // 可以是固定值或动态生成
        stream: true,
        additional_messages: [{
          role: "user",
          content: message,
          content_type: "text"
        }]
      },
      enableChunked: true, // 启用分块传输
      success: () => console.log('请求已发送'),
      fail: reject
    });

    // 处理流式响应
    let buffer = '';
    let followUpQuestions = [];
    let fullContent = '';
    
    requestTask.onChunkReceived((response) => {
      try {
        // 解码数据块
        const chunk = decoder.decode(new Uint8Array(response.data));
        buffer += chunk;
        
        // 分割事件
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        
        // 处理每个事件
        for (const event of events) {
          if (!event.trim()) continue;
          
          const lines = event.split('\n');
          if (lines.length < 2) continue;
          
          const eventType = lines[0].replace('event:', '').trim();
          const dataStr = lines[1].replace('data:', '').trim();
          
          try {
            const data = JSON.parse(dataStr);
            
            // 处理不同类型的事件
            switch (eventType) {
              case 'conversation.message.delta':
                // 处理增量内容
                if (data.role === 'assistant' && data.type === 'answer') {
                  fullContent += data.content;
                  onUpdate(data.content);
                }
                break;
                
              case 'conversation.message.completed':
                // 处理完整消息
                if (data.role === 'assistant') {
                  if (data.type === 'answer') {
                    // 确保内容完整
                    if (data.content !== fullContent) {
                      const finalContent = data.content.slice(fullContent.length);
                      if (finalContent) onUpdate(finalContent);
                    }
                  } else if (data.type === 'follow_up') {
                    // 收集跟进问题
                    followUpQuestions.push(data.content);
                  }
                }
                break;
                
              case 'done':
                // 响应结束
                resolve({
                  content: fullContent,
                  followUpQuestions
                });
                break;
            }
          } catch (e) {
            console.error('JSON解析失败:', e);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * 使用示例：
 * 
 * // 1. 定义更新UI的函数
 * const updateUI = (content) => {
 *   // 在这里更新UI显示
 *   console.log('收到内容:', content);
 * };
 * 
 * // 2. 调用API
 * callCozeAPI("你的消息", updateUI)
 *   .then(result => {
 *     console.log('完整响应:', result.content);
 *     console.log('跟进问题:', result.followUpQuestions);
 *   })
 *   .catch(error => {
 *     console.error('调用失败:', error);
 *   });
 * 
 * 注意事项：
 * 1. 建议实现节流控制，避免UI更新过于频繁
 * 2. 建议添加错误重试机制
 * 3. 建议添加超时处理
 * 4. 生产环境中API密钥应该放在服务器端
 */ 