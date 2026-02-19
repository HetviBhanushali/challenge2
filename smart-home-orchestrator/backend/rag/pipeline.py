from sentence_transformers import SentenceTransformer
from google import genai
from db.supabase_client import supabase
from dotenv import load_dotenv
import os

load_dotenv()

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_embedding(text: str) -> list:
    return embedding_model.encode(text).tolist()

def retrieve_context(query: str, top_k: int = 5) -> list:
    query_embedding = get_embedding(query)
    result = supabase.rpc("match_documents", {
        "query_embedding": query_embedding,
        "match_threshold": 0.3,
        "match_count": top_k
    }).execute()
    return result.data or []

def answer_query(query: str, user_id: str) -> str:
    context_chunks = retrieve_context(query)
    context_text = "\n\n".join([c["content"] for c in context_chunks])

    prompt = f"""You are a smart home AI assistant. Use the context below to answer the user's question.

Context:
{context_text}

Question: {query}

Answer:"""

    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    answer = response.text

    supabase.table("user_queries").insert({
        "user_id": user_id,
        "query": query,
        "response": answer
    }).execute()

    return answer