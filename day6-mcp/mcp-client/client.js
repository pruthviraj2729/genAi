import { MCPAdapter } from "@langchain/mcp-adapters"
import {createAgent} from "langchain"
import { ChatMistralAI } from "@langchain/mistralai";

const adapter = new MCPAdapter({
  servers: {
    // Local server: adapter spawns it as a child process (stdio)
    calender: {
      command: "node",
      args: "../mcp-server/server.js"
    },
    // Remote server: Streamable HTTP is the default for a url
    docs: {
      url: "https://docs.langchain.com/mcp",
    }, 
  }
})

const tools = await adapter.listTools()
console.log("Available tools:", tools)
await adapter.close()

// try {
//     const tools = await adapter.listTools();
//     console.log(tools.map((t) => t.name))

//     const agent = createAgent({
//         model: new ChatMistralAI({model: "mistral-large-latest"}),
//         tools,

//     });

//     const result = await agent.invoke({
//         message: [
//             {
//                 role: "user",
//                 content: "Am I free on 2026-10-17 at 4pm IST? If yes, book 'Doubt session' for 30 minutes.",
//             }
//         ]
//     })
//     console.log(result.content)
// } finally {
//     await adapter.close();
// }

