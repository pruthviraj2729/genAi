import { ChatGroq } from '@langchain/groq'
import  {getApiKey}  from '../../utils/file.utils.js'
import { upsertFiles } from '../tools/files.tools.js'
import {AIMessage} from 'langchain'
import * as fileTools from "../tools/files.tools.js"

export async function LLMNODE(state, context) {

    // console.log(context)

    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        apiKey: (await getApiKey()).apiKey, 
    })

    const modelWithTools = model.bindTools([upsertFiles])

    const stream = await modelWithTools.stream(state.messages)

    process.stdout.write("[AI]: ")

    let aiMessages;

    for await(const chunk of stream){
        process.stdout.write(chunk.text)
        // console.log(chunk)
        aiMessages = aiMessages ? aiMessages.concat(chunk) : chunk;
        // aiMessages += chunk.text
    }
    console.log(aiMessages)

    process.stdout.write("\n")

    return{
        messages: [
            ...state.messages,
             new AIMessage(aiMessages)
        ]
    }


}

export async function ToolNode(state, config){
    const messages = state.messages;
    const lastMessages = state.messages[state.messages.length-1]
    const toolCalls = lastMessages.tool_calls

    const toolResult = []

    for(const toolCall of toolCalls){
        const result = await fileTools[toolCall.name].invoke(toolCall) 
        toolResult.push(result)
    }

    return {
        messages:[
            ...state.messages,
            ...toolResult
        ]
    }
}

