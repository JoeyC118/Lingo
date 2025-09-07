# index_eswiki_text_batched.py
import os, re, math, time
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_openai import OpenAIEmbeddings

load_dotenv(override=True)

TEXT_PATH   = r"eswiki-20181001-corpus.xml"  # large Spanish Wikipedia dump
PERSIST_DIR = "./chroma_es"
COLLECTION  = "spanish_kb"

# ~50M words ≈ 250M characters
MAX_CHARS = 250_000_000   

# Batching params
CHUNK_SIZE = 1000      # size of chunks for splitting
CHUNK_OVERLAP = 200    # overlap between chunks
BATCH_SIZE = 500       # how many chunks to embed per batch before writing to DB

def clean_text(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text)        # remove XML/HTML-like tags
    text = re.sub(r"\[\[.*?\]\]", " ", text)    # remove wiki-style links
    text = re.sub(r"\{\{.*?\}\}", " ", text)    # remove wiki templates
    text = re.sub(r"<ref.*?>.*?</ref>", " ", text, flags=re.DOTALL)
    text = re.sub(r"={2,}.*?={2,}", " ", text)  # section headings
    text = re.sub(r"https?://\S+", " ", text)   # URLs
    text = re.sub(r"\s+", " ", text)            # collapse whitespace
    return text.strip()

def main():
    if not os.path.exists(TEXT_PATH):
        print(f"❌ File not found at: {TEXT_PATH}")
        return

    # ✅ Read up to MAX_CHARS characters
    with open(TEXT_PATH, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read(MAX_CHARS)

    print(f"📖 Loaded {len(text):,} characters from {TEXT_PATH}")

    text = clean_text(text)
    print("🧹 Cleaned text")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
    )
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vs = Chroma(
        collection_name=COLLECTION,
        embedding_function=embeddings,
        persist_directory=PERSIST_DIR
    )

    doc = Document(page_content=text, metadata={"source": "eswiki_full"})
    chunks = splitter.split_documents([doc])

    total_chunks = len(chunks)
    print(f"✂️ Split into {total_chunks:,} chunks")

    start_time = time.time()

    # Process in batches
    for i in range(0, total_chunks, BATCH_SIZE):
        batch = chunks[i : i + BATCH_SIZE]

        vs.add_texts(
            texts=[c.page_content for c in batch],
            metadatas=[c.metadata for c in batch],
            ids=[f"eswiki_full::{i+j}" for j in range(len(batch))]
        )

        elapsed = time.time() - start_time
        pct = (i + len(batch)) / total_chunks * 100
        print(
            f"✅ Added batch {i//BATCH_SIZE + 1} "
            f"({i+len(batch):,}/{total_chunks:,} chunks, {pct:.2f}% done) "
            f"⏱ {elapsed:.1f}s elapsed"
        )

    print(f"🎉 Finished indexing {total_chunks:,} chunks")
    print(f"⏱ Total time: {time.time() - start_time:.1f}s")
    print(f"📂 Saved to: {PERSIST_DIR}")

if __name__ == "__main__":
    main()
