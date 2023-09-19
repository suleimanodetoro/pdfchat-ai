import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";

export const getPineconeClient = async () =>{
    const pinecone =  new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!,
      });
      const index = pinecone.index("pdfchat-ai");

      return pinecone;
}



export async function loadS3IntoPinecone(fileKey: string) {
    // 1. Obtain the PDF -> Download and read from the PDF
    console.log('Donwloading s3 file to file system');
    const file_name = await downloadFromS3(fileKey);

    // 2. Get text from PDF. We will use langchain for this
    

    
    


}


