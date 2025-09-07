# test.py
import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

# Load .env if present (make sure it has OPENAI_API_KEY=sk-...)
load_dotenv(override=True)

PERSIST_DIR = "./chroma_es"
COLLECTION  = "spanish_kb"

# Initialize embeddings with your OpenAI key
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Connect to Chroma collection
vs = Chroma(
    collection_name=COLLECTION,
    persist_directory=PERSIST_DIR,
    embedding_function=embeddings,
)

print("✅ Loaded Chroma collection")

# Count stored vectors
count = vs._collection.count()
print(f"Total vectors stored: {count:,}")

# Run a test query
query = "te puedo dar un regalo"
print(f"\n🔎 Query: {query}")
results = vs.similarity_search(query, k=3)

for i, r in enumerate(results, 1):
    print(f"\n---- Result {i} ----")
    print(r.page_content[:250], "...")
    print("metadata:", r.metadata)
