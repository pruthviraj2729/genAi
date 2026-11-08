import fs from 'fs/promises'
import { HOME_DIR, CONFIG_DIR } from './constant.js'
import path from 'path'
import axios from 'axios'

/**
 * Return the content of the settings file (create if it doesn't exist)
 */
export async function getSettingsFile() {
    // Ensure the config directory exists
    try {
        await fs.access(CONFIG_DIR)
    } catch (error) {
        await fs.mkdir(CONFIG_DIR, {recursive: true})

    }

    const settingsFilePath = path.join(CONFIG_DIR, "settings.json")

    try {
        await fs.access(settingsFilePath)
        const content = await fs.readFile(settingsFilePath, "utf-8")
        return JSON.parse(content)
    } catch (error) {
        await fs.writeFile(settingsFilePath, JSON.stringify({}))
        return {}
    }

}

export async function saveApiKey(apiKey){
    const settingsFilePath = path.join(CONFIG_DIR, 'settings.json')

    const settingsFileContent = getSettingsFile()

    await fs.writeFile(settingsFilePath, JSON.stringify({
        ...settingsFileContent,
        apiKey
    }))
}

export async function getApiKey(){
    const settings = await getSettingsFile()
    const apiKey = settings.apiKey

    if(!apiKey){
        return{
            error: "API key not found in settings file"
        }
    }

    try {
        const response = await axios.get("https://api.groq.com/openai/v1/models", {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }

        })
        return {
            apiKey
        }
    } catch (error) {
        return {
            error: "Invalid api key"
        }
    }
}