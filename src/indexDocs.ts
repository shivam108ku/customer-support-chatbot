import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';
import { ChatDeepSeek } from "@langchain/deepseek";

const embeddings = new HuggingFaceTransformersEmbeddings({
    model: 'Xenova/all-MiniLM-L6-v2',  // 384 dimensions
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
});

export async function indexTheDocument(filePath: string) {
    const loader = new PDFLoader(filePath, { splitPages: false });

    const [firstDoc] = await loader.load();

  
    if (!firstDoc) throw new Error('PDF empty or failed to load');

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const documents = await textSplitter.createDocuments(
        [firstDoc.pageContent],
        [firstDoc.metadata]
    );

    await vectorStore.addDocuments(documents);
    console.log('Done ✅');
}
indexTheDocument('./cg-knowledge-base.pdf')

export const model = new ChatDeepSeek({
    model: "deepseek-chat",
    temperature: 0,
});