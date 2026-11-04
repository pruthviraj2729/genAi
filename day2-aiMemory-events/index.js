import dotenv from 'dotenv'
import { ChatGroq } from '@langchain/groq'
import rl from 'readline/promises'
import { tool, createAgent } from 'langchain'
import * as z from 'zod'

dotenv.config()

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY
})

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

const messages = []
const events = []

const createTask = tool(
    async function({title, date, description}) {
        console.log("event created", {title, date, description})

        events.push({title,date, description })
        return "event created"
    },
    {
        name: "creatingEvent",
        description: "create a new event with name, date and description",
        schema: z.object({
            name: z.string(),
            date: z.string(),
            description: z.string()
        })
    }
) 

const getEvents = tool(
        async function ({ }) {
        console.log("retreving events" ,events)
        return events
    },
    {
        name: "getEvents",
        description: "retrived all events",
        schema: z.object({})
    }
)

const agent = createAgent({
    model: llm,
    tools: [createTask, getEvents]
})

while(true) {
    const userInp = await readline.question("Enter your input:")
    messages.push({
        role: "user",
        content:  userInp
    })

    // const res = await llm.stream(messages)
    const stream = await agent.stream({
        messages: [
            {
                role: "user",
                content: userInp
            }
        ]
    }, {streamMode: "messages"})

    // let aiMessages = "";

    for await (const [chunk] of stream){
        // aiMessages += chunk.content;

        process.stdout.write(chunk.content)
    }

    // messages.push({
    //     role: "assistant",
    //     content: aiMessages
    // })

    process.stdout.write("\n")


}

