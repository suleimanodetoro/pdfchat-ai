import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter/";
import { downloadFromS3 } from "./s3-server";
// This pdf loader will be able to read from the file system and give us text ->
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export const getPineconeClient = () => {
  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. Obtain the PDF -> Download and read from the PDF
  console.log("Downloading s3 file to file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("Could now download file form s3");
  }

  // 2. Get text from PDF. We will use langchain for this
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 3. Split and segment the pages into smaller documents for better vectorization
  //   For each page(using map) we will call prepareDocument helper function
  const documents = await Promise.all(
    pages.map((page) => prepareDocument(page))
  );

  //  4.  Vectorize and embed individual documents. This will will return an array of vectors
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 5. Upload vectors to pinecone
  const client = await getPineconeClient();
  //   get pinecone index which is the name of the database. check your profile
  const pineconeIndex = client.Index("pdfchat-ai");
  console.log("inserting vectors into pinecone");
  //   when creating namespaces, at least as of today, you apparently need to ASCII
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  return documents[0];
}
// function to embed documents. We will use open ai to get the embeddings of a single string (see: lib/embeddings.ts).
async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    // get hash of the pagecontent to help us id the vector within pinecone with md5 library
    const hash = md5(doc.pageContent);

    // return a vector
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {
    console.log("Error embedding document", error);
    throw error;
  }
}

// because texts might be too long for pinecone to vectorize, we will use a helper function
export const truncateStringByBytes = (string: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(string).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  // This will take in a single page
  // You will need to install @pinecone-database/doc-splitter

  // destructure from page passed in
  let { pageContent, metadata } = page;
  // regex to replace all new line with space ie " "
  pageContent = pageContent.replace(/\n/g, " ");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}
