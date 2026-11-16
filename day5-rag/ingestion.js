import {PDFParse} from 'pdf-parse'
import fs from 'fs/promises'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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

