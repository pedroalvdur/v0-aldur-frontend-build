// SERVER-ONLY: Temporary secrets for quick testing in V0 preview.
// WARNING: Do not keep secrets in source control for production use.

export const serverSecrets = {
  pineconeApiKey:
    process.env.PINECONE_API_KEY ||
    "pcsk_SUhgw_HZxuXuqAaBB1t1HvCTwJKR3RwQs2Q9hzTHmHAG5iz6i1Wjck2e18JAw2s5Q3DPK",
  pineconeAssistantName: process.env.PINECONE_ASSISTANT_NAME || "aldur",
}
