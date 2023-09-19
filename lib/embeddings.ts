// install openai-edge (edge compatible version of openai library)
// Update July 2023: The official openai library will use fetch in v4, hopefully making openai-edge redundant. You can try it in beta now, more info here: openai/openai-node#182

import { Configuration, OpenAIApi } from "openai-edge";
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
});

const openai = new OpenAIApi(configuration);

// Helper function to convert text to vector
export async function getEmbeddings (text: string) {
    try {
        const response = await openai.createEmbedding({
            model:"text-embedding-ada-002",
            input: text.replace(/\n/g, " ")
        });
        const result = await response.json();
        // this embedding is basically a vector 
        return result.data[0].embedding as number[]
        
    } catch (error) {
        console.log('error calling open ai embedding', error);
        throw error;
        
        
    }

}