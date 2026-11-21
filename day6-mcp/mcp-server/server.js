import { McpServer} from "@modelcontextprotocol/server";
import * as z from 'zod'
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio"

const EVENTS = [];
const server = new McpServer({ name: "calendar-server", version: "1.0.0"})

server.registerTool(
    "create-event",
    {
        description: "List calendar events on one date. Call this before booking to check for clashes.",
        inputSchema: z.object({
            start: z.string().describe("Date in YYYY-MM-DD format, eg. 2005-12-27"),
            title: z.string().describe("title of the event"),
            end: z.string().describe("end of the event")
        })
    },
    async({start, title, end}) => {
        const event = {start, title, end};
        EVENTS.push(event);

        return {
            content: [
                {
                    type: "text",
                    text: `Event created: ${title} from ${start} to ${end}`
                }
            ]
        }

    }
)

const transPort = await StdioServerTransport();

await server.connect(transPort);