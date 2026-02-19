import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sentence_transformers import SentenceTransformer
from db.supabase_client import supabase_admin
from dotenv import load_dotenv

load_dotenv()

# Free local embedding model — no API key needed
model = SentenceTransformer("all-MiniLM-L6-v2")  # downloads once, ~90MB

documents = [
    "Lighting agent turns ON lights when room is occupied and light state is Dark.",
    "Climate agent activates AC when temperature state is High and room is occupied.",
    "Security agent monitors all rooms at night when motion is detected.",
    "Energy agent turns off all devices in unoccupied rooms after 10 minutes.",
    "Orchestrator resolves conflicts by giving Security alerts the highest priority.",
    "State compression converts raw temperature to Low/Normal/High thresholds.",
    "The system uses event-driven messaging — no continuous data streaming.",
    "Anti-fluctuation logic prevents rapid ON/OFF switching of devices.",
]

for doc in documents:
    embedding = model.encode(doc).tolist()  # produces 384-dim vector

    supabase_admin.table("rag_documents").insert({
        "content": doc,
        "metadata": {"source": "system_rules"},
        "embedding": embedding
    }).execute()
    print(f"Seeded: {doc[:60]}...")

print("Done!")