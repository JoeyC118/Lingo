from langchain_chroma import Chroma
import numpy as np
from langchain_core.embeddings import Embeddings

# --- Dummy embeddings (same as indexer) ---
class DummyEmbeddings(Embeddings):
    def embed_documents(self, texts):
        return [np.random.rand(384).tolist() for _ in texts]
    def embed_query(self, text):
        return np.random.rand(384).tolist()

PERSIST_DIR = "./chroma_es"
COLLECTION = "spanish_kb"

# Load the DB
vs = Chroma(
    collection_name=COLLECTION,
    embedding_function=DummyEmbeddings(),
    persist_directory=PERSIST_DIR
)

print("✅ Loaded Chroma collection")

# Run a test search
results = vs.similarity_search("Andorra", k=3)
for r in results:
    print("----")
    print(r.page_content[:200], "...")
    print("metadata:", r.metadata)
