import { createAnthropic } from "@ai-sdk/anthropic";

const anthropic = createAnthropic({
    apiKey: process.env.LLM_KEY
})

export default anthropic