import { ChatGroq } from '@langchain/groq'
import { getApiKey } from '../utils/file.utils.js'
import {AIMessage} from 'langchain'

export async function LLMNODE(state, context) {
    console.log(context)

    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        apiKey: (await getApiKey()).apiKey,
    })

    const stream = await model.stream(state.messages)

    process.stdout.write("[AI]: ")

    let aiMesages = ""

    for await(const chunk of stream){
        process.stdout.write(chunk.text)
        aiMesages += chunk.text
    }

    process.stdout.write("\n")
    
    return {
        messages: [
            ...state.messages,
            new AIMessage(aiMesages)
        ]
    }
}