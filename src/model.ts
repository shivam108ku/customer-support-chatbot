import { ChatDeepSeek } from "@langchain/deepseek";
 

const tools: any = [ "", ""];

export const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
}).bindTools(tools);