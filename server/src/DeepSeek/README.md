# 本地化部署 Deep Seek AI 模型
<!-- https://juejin.cn/post/7469001751493623844?searchId=20250220093928983FCAB55D2356920813#heading-17 -->

```sh
npm install ollama
```

```sh
ollama run deepseek-r1
```

<!-- 配置环境变量  path -->

```ts
import ollama from "ollama";

const response = await ollama.chat({
  model: "<MODEL>",
  messages: [
    {
      role: "user",
      content: "List 5 foods from Italy. Explain their origins"
    }
  ]
});

console.log(response.message.content);

// OR

import { Ollama } from 'ollama'

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
const response = await ollama.chat({
  model: 'llama3.1',
  messages: [{ role: 'user', content: 'Why is the sky blue?' }],
})
```

<!-- 需要转化成 VBA 宏代码 才能给 luckysheet 执行 -->
