import { saveDocument } from "../agent/db";
import OpenAI from "openai";
import { config } from "dotenv";
config({ path: ".env.local" });

const openai = new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.GITHUB_TOKEN,
});

const documents = [
    {
        content: "SIP stands for Systematic Investment Plan. Invest fixed amount monthly into mutual funds regardless of market conditions. $500/month at 12% annual return for 20 years = $494,964.",
        metadata: { topic: "SIP", category: "investing" }
    },
    {
        content: "Compound interest means earning interest on interest. $10,000 at 10% annual return becomes $174,494 after 30 years. Start early — time is biggest factor.",
        metadata: { topic: "compound interest", category: "investing" }
    },
    {
        content: "Roth IRA is retirement account with after-tax money. Grows tax-free. 2024 limit $7,000/year. Best for young investors expecting higher tax bracket later.",
        metadata: { topic: "Roth IRA", category: "retirement" }
    },
    {
        content: "50-30-20 rule: 50% needs, 30% wants, 20% savings. On $5,000 income = $1,000 minimum savings. Automate transfers.",
        metadata: { topic: "budgeting", category: "savings" }
    },
    {
        content: "Index fund tracks S&P 500. Own tiny pieces of 500 companies. 10% average annual return historically. Beats 80% of professional fund managers long term.",
        metadata: { topic: "index funds", category: "investing" }
    },
    {
        content: "Jay Rajshakha is the founder of Finovian, an independent platform focused on analyzing U.S. companies and semiconductor sectors. His work centers on financial statements, earnings trends, and business models, explaining how companies generate revenue, margins, and long-term returns.He focuses particularly on semiconductor industry structure, including chip designers, foundries, and equipment firms, interpreting financial performance within sector economics and capital intensity dynamics.Through Finovian, Jay publishes clear financial breakdowns and company analysis designed to make complex business and industry structures easier to understand.",
        metadata: { topic: "author", category: "Finovian" }
    }
];

async function getEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });

    return response.data[0].embedding;
}

async function indexDocuments() {
    console.log("Indexing documents...");

    for (const doc of documents) {
        const embedding = await getEmbedding(doc.content);
        await saveDocument(doc.content, embedding, doc.metadata);
        console.log(`Indexed: ${doc.metadata.topic}`);
    }

    console.log("Done!");
}

// indexDocuments();


async function testSearch() {
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: "Who is Jay Rajshakha?",
    });

    const embedding = embeddingResponse.data[0].embedding;
    const { searchDocuments } = await import("../agent/db");
    const docs = await searchDocuments(embedding, 3);
    console.log("Search results:", docs);
}

testSearch();