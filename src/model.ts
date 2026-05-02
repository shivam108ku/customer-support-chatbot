import { ChatDeepSeek } from "@langchain/deepseek"; 

export const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
})