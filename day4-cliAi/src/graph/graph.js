import { StateGraph, START, END} from '@langchain/langgraph'
import * as z from 'zod'
import { LLMNODE } from './node.js'
import rl from '../../src/utils/readline.js'
import {HumanMessage} from 'langchain'

const stateFormat = z.object({
    message: z.array(z.any())
})

const graph = new StateGraph(stateFormat)
    .addNode("LLMNode", LLMNODE)
    .addEdge(START, "LLMNode")
    .addEdge("LLMNode", END)
    .compile()

let messages = []    

export default async function initGraph() {
    while(true) {
        const userInput = await rl.question("[User]: ")

        // messages.push(new HumanMessage(userInput))

        const response = await graph.invoke({
            message: [
                new HumanMessage(userInput)
            ]
        })

        console.log("[AI]:",response)

    }   
    
}