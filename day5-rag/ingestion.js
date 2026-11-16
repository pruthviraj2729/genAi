import {PDFParse} from 'pdf-parse'
import fs from 'fs/promises'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {CohereEmbeddings} from '@langchain/cohere'
import dotenv from 'dotenv'
import { Pinecone } from '@pinecone-database/pinecone';

dotenv.config()

const parser = new PDFParse({
    data: await fs.readFile("./story.pdf")
})

// –––––––––––––––––––––––––– Extract all the text from pdf file –––––––––––––––––––––––––
const text = (await (parser.getText())).text

// console.log(result)

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100
})

// –––––––––––––––––––––––––– Split the text into chunks –––––––––––––––––––––––––
const chunks = await textSplitter.splitText(text);

// console.log(chunks)


// –––––––––––––––––––––––––– Initialize embeddings [embedding model] –––––––––––––––––––––––––
const embeddings = new CohereEmbeddings({
    model: "embed-v5.0-fast",
    apiKey: process.env.COHERE_API_KEY
})

// –––––––––––––––––––––––––– Embed the text chunks into vectors –––––––––––––––––––––––––
const vectors = await embeddings.embedDocuments(chunks)
console.log(vectors)

// –––––––––––––––––––––––––– Initialize Pinecone client –––––––––––––––––––––––––
const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
})

const index = pc.Index({
    name: "cohort-rag",
    host: "https://cohort-rag-1tx35fi.svc.aped-4627-b74a.pinecone.io"
})

await index.documents.upsert({
    documents: vectors.map((vector, index) => {
        return {
            _id: `chunk-${index}`,
            embedding: vector,
            content: chunks[index]
        }
    })
})
