// chat through invoke
// import dotenv from 'dotenv'
// import { ChatGroq } from '@langchain/groq'

// dotenv.config()

// const llm = new ChatGroq({
//   model: 'openai/gpt-oss-120b',
//   apiKey: process.env.GROQ_API_KEY
// })

// const res = await llm.invoke("how are u my buddy?");

// console.log(res.content)




// chat without stream
// import dotenv from 'dotenv'
// import { ChatGroq } from '@langchain/groq'
// import rl from 'readline/promises'
// import { stdin } from 'process';

// dotenv.config();

// const llm = new ChatGroq({
//   model: 'openai/gpt-oss-120b',
//   apiKey: process.env.ChatGroq
// })

// const readline = rl.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

// while(true) {
//   const userInp = await readline.question("Enter your input:");

//   const res = await llm.invoke(userInp)

//   process.stdout.write(res.content)

//   process.stdout.write('\n')

  
// }


// chat using stream effect
import dotenv from 'dotenv'
import { ChatGroq } from '@langchain/groq'
import rl from 'readline/promises'

dotenv.config();

const llm = new ChatGroq({
  model: 'openai/gpt-oss-120b',
  apiKey: process.env.GROQ_API_KEY
})

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout
})

while(true){
  const userInp = await readline.question("Enter your input:");

  const stream = await llm.stream([
    {
      role: "user",
      content: userInp
    }
  ])

  for await (const chunk of stream){
    process.stdout.write(chunk.content)
  }

  process.stdout.write("\n")


}
