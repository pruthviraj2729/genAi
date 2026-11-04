import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv"
import { tool, createAgent} from 'langchain'
import * as z from "zod"
import rl from 'readline/promises'

dotenv.config();

const events = []

const createEventTool = tool(
    async function ({date,title,description}) {
        events.push({
            date,title,description
        })

        return "event created"
    },{
        name:"createEvent",
        description:"Create a new event with a date,title, and description",
        schema: z.object({
            date: z.string(),
            title: z.string(),
            description: z.string()
        })
    }
)

const getEventsTool = tool(
    async function ({ }) {
        console.log("retreving events:", events)
      return events  
    },{
        name: "getevents",
        description: "retrives all events",
        schema: z.object({})
    }
)

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY
})

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

const agent = createAgent({
    model,
    tools:[createEventTool, getEventsTool]
})

const messages = [];

while(true){
    const userInp = await readline.question("enter your input:")

    messages.push({
        role:"user",
        content: userInp
    })

    const stram = await agent.stream({
       messages
    }, {streamMode: "messages"})

    let aiMessage = ""

    for await (const [chunks] of stram){
        aiMessage += chunks.content
        process.stdout.write(chunks.content)
    }

    messages.push({
        role: "assistant",
        content: aiMessage
    })

    process.stdout.write("\n")
}
