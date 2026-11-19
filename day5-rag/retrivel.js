import {ChatCohere, CohereEmbeddings} from '@langchain/cohere'
import dotenv from 'dotenv'
import  {Pinecone} from '@pinecone-database/pinecone'
import { HumanMessage, AIMessage, ToolMessage } from 'langchain'

dotenv.config();

const userInput = "How was the Arav's first job experience ?"

const embeddings = new CohereEmbeddings({
    model:"embed-v5.0-fast",
    apiKey: process.env.COHERE_API_KEY
})

const vector = await embeddings.embedQuery(userInput);

const pc = new Pinecone({apiKey: process.env.PINECONE_API_KEY})

const index = pc.Index({
    name: "cohort-rag",
    host: "https://cohort-rag-1tx35fi.svc.aped-4627-b74a.pinecone.io"
})

const result = await index.documents.search({
    topK: 3,
    scoreBy: [
        {
            type: 'dense_vector',
            fields: [ "embeding" ],
            values: vector
        }
    ],
    includeFields: ['content']
})
console.log(result)


const model = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: process.env.COHERE_API_KEY
})

const messages = []

messages.push(new HumanMessage(userInput))

messages.push(new ToolMessage ({
    content: JSON.stringify(result)
}))

const aiResponse = await model.stream(messages)

for await (const chunk of aiResponse) {
    process.stdout.write(chunk.text)
}
// const res = await model.invoke(userInput)
// // console.log(res.content)