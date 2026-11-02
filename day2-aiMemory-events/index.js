import dotenv from 'dotenv'
import { ChatGroq } from '@langchain/groq'
import rl from 'readline/promises'
import { tool, createAgent} from 'langchain'
import * as z from 'zod'

dotenv.config()

const messages = []

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY
})

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

const events = []

const createTask = tool(
    async function({date, title, description}) {
        console.log("creating event:", {date, title, description})

        events.push({
            date, title,description
        })
        return "event created"
    },
    {
        name: "createEvent",
        description: "Create a new event with a date, title, and description",
        schema: z.object({
            date: z.string(),
            title: z.string(),
            description: z.string()
        })
    }
)

const getEventTool = tool(
        async function ({ }) {
        console.log("Retrieving events:", events)
        return events
    },
    {
        name: "getEvents",
        description: "Retrieves all events",
        schema: z.object({})
        
    })
    // return "event created"

    const agent = createAgent({
        model: llm,
        tools:[createTask, getEventTool]
    })



while(true){
    const userInp = await readline.question("enter your input:")
    messages.push(userInp)

    const stream = await agent.stream({
        messages: [
            {
                role: 'user',
                content: userInp
            }
        ]    
    }, { streamMode: "messages" })

    // let aiMessage = '';

    for await (const [chunk] of stream){
        // aiMessage += chunk.content;
        process.stdout.write(chunk.content)
    }

    // messages.push({
    //     role: "assistant",
    //     content: aiMessage
    // })

    process.stdout.write("\n")
}



