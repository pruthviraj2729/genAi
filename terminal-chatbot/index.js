// import dotenv from 'dotenv'
// import { ChatGroq } from '@langchain/groq'

// dotenv.config()

// const llm = new ChatGroq({
//   model: 'openai/gpt-oss-120b',
//   apiKey: process.env.GROQ_API_KEY
// })

// const response = await llm.invoke("hi how are u?")


// console.log(response.content)

// import dotenv from 'dotenv'
// import { ChatGroq } from '@langchain/groq'
// import rl from 'readline/promises'

// dotenv.config()

// const llm = new ChatGroq({
//   model: 'openai/gpt-oss-120b',
//   apiKey: process.env.GROQ_API_KEY
// })

// const response = await llm.invoke("hi how are u?")

// const readline = rl.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

// while(true) {
//     const userInpt = await readline.question("Enter your input:");

//     const res = await llm.invoke(userInpt)

//     process.stdout.write(res.content)

//     process.stdout.write("\n")

// }



import dotenv from 'dotenv'
import { ChatGroq } from '@langchain/groq'
import rl from 'readline/promises'

dotenv.config()

const llm = new ChatGroq({
  model: 'openai/gpt-oss-120b',
  apiKey: process.env.GROQ_API_KEY
})

const response = await llm.invoke("hi how are u?")

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

while(true) {
    const userInpt = await readline.question("Enter your input:");

    const stream = await llm.stream([
        
           {
             role: "user",
             content: userInpt
           }
        
    ])

    for await (const chunk of stream){
        process.stdout.write(chunk.content)
    }

    process.stdout.write("\n")

}

// console.log(response.content)