import { getApiKey, getSettingsFile, saveApiKey } from "./utils/file.utils.js";
import rl from "./utils/readline.js";

async function main() {
    const settings = await getSettingsFile()
    
    if(!settings.apiKey){
        const apiKey = await rl.question("Enter your pi key:")
        await saveApiKey(apiKey)
    }

    const response = await getApiKey()

    if(response.error){
        console.log("Invalid or expired api key")
        const apiKey = await rl.question("Please enter your api key:")
        await saveApiKey(apiKey)
        return main()
    }

    const apiKey = response.apiKey
    console.log(apiKey)

    rl.close()
}

export default main