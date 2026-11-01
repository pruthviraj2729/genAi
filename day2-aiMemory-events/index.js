import dotenv from 'dotenv'
import { ChatGroq } from '@langchain/groq'
import rl from 'readline/promises'


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


while(true){
    const userInp = await readline.question("enter your input:")
    messages.push(userInp)

    const stream = await llm.stream([
        {
            role: 'user',
            content: userInp
        }
    ])

    let aiMessage = '';

    for await (const chunk of stream){
        aiMessage += chunk.content;
        process.stdout.write(chunk.content)
    }

    messages.push({
        role: "assistant",
        content: aiMessage
    })

    process.stdout.write("\n")
}



