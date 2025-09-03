from flask import Flask,request, jsonify
import os
from dotenv import load_dotenv
from openai import OpenAI
from pymongo import MongoClient
import spacy 
load_dotenv(override=True)

openai_api_key = os.getenv('OPENAI_API_KEY')
mongodb = os.getenv('MONGODB_URI')
openai = OpenAI()
gpt_model = "gpt-4o-mini"

system_prompt = "ONLY REPLY IN MARKDOWN LANGUAGE. DONT ASSUME THE USER CAN SPEAK SPANISH, YOU CANT REPLY IN SPANISH U HAVE TO TEACH IT! You are optimized to teach spanish. Your main function is to listen for a user to give u a spanish phrase, and then you translate it but theres more" \
"First, when someone gives u a phrase, u translate it.  Then u break down each word and what it means, then you give examples of the phrase in context.  Do it in a natural way, talk to the user but put" \
"flow these requriements in the conversation naturally"

conjugation_prompt = "You are a Spanish verb conjugation assistant. Always respond **only in Markdown**.\n\n" \
"Goals:\n" \
"1) Identify the most important Spanish verb in the user's input (if multiple, choose one).\n" \
"2) Create **two clean Markdown tables with identical column counts** so divider lines are perfectly aligned.\n" \
"3) Top table: Present, Preterite, Imperfect, Future.\n" \
"4) Bottom table: Subjunctive (Present) and Conditional, with two extra columns kept blank to ensure exact alignment.\n" \
"5) Use these person abbreviations: 1s (yo), 2s (tú), 3s (él/ella/ud.), 1p (nos.), 3p (ellos/uds.). Omit vosotros.\n" \
"6) Do not add commentary, translations, or text outside the chart.\n\n" \
"### Example Output (Markdown)\n" \
"\\`\\`\\`markdown\n" \
"# Conjugation of *hablar*\n\n" \
"## Participles\n" \
"- **Infinitive:** hablar\n" \
"- **Gerund:** hablando\n" \
"- **Past Participle:** hablado\n\n" \
"## Core Tenses\n" \
"| Person | Present | Preterite | Imperfect | Future |\n" \
"|--------|---------|-----------|-----------|--------|\n" \
"| 1s | hablo | hablé | hablaba | hablaré |\n" \
"| 2s | hablas | hablaste | hablabas | hablarás |\n" \
"| 3s | habla | habló | hablaba | hablará |\n" \
"| 1p | hablamos | hablamos | hablábamos | hablaremos |\n" \
"| 3p | hablan | hablaron | hablaban | hablarán |\n\n" \
"## Subjunctive & Conditional\n" \
"| Person | Subjunctive (Present) | Conditional |   |   |\n" \
"|--------|----------------------|-------------|---|---|\n" \
"| 1s | hable | hablaría |   |   |\n" \
"| 2s | hables | hablarías |   |   |\n" \
"| 3s | hable | hablaría |   |   |\n" \
"| 1p | hablemos | hablaríamos |   |   |\n" \
"| 3p | hablen | hablarían |   |   |\n" \
"\\`\\`\\`\n\n" \

app = Flask(__name__)

client = MongoClient(mongodb)
db = client["lingo_app"]                       # Database name
users = db["users"]                            # Collection name

nlp = spacy.load("es_core_news_sm")


try:
    # Run a simple command to verify connection
    client.admin.command("ping")
    print("✅ Successfully connected to MongoDB Atlas!")
except Exception as e:
    print("❌ Connection failed:", e)

@app.route("/", methods = ["GET"])
def home():
    return "Hello World, from Flask!"

def extract_keywords(sentence: str, max_keywords: int = 5):
    doc = nlp(sentence)
    keywords = []

    for token in doc:
        # Include AUX verbs too
        if token.pos_ in ["NOUN", "VERB", "ADJ", "AUX"]:
            keywords.append(token.text)  # original form
            if token.lemma_ != token.text:
                keywords.append(token.lemma_)  # lemma form

    # Print for debugging
    print("Extracted keywords:", keywords)

    return keywords[:max_keywords]

def get_or_create_user():
    user = users.find_one({"username": "test_user"})
    if not user:
        users.insert_one({"username": "test_user", "words": []})
        user = users.find_one({"username": "test_user"})
    return user



@app.route("/api/chat", methods = ["POST"])
def call_model():
    data = request.get_json(force = True) or {}
    user_msg = (data.get("message") or "").strip()

    keywords = extract_keywords(user_msg)

    messages = [
        {"role":"system", "content": system_prompt },
        {"role":"user", "content": user_msg}
    ]
    completion = openai.chat.completions.create(
        model = gpt_model,
        messages = messages
    )

    reply = completion.choices[0].message.content

    return jsonify({"reply": reply,
                    "keywords":keywords}), 200

@app.route("/api/chart", methods = ["POST"])
def call_conjugation():
    data = request.get_json(force = True) or {}
    user_msg = (data.get("message") or "").strip()

    messages = [
        {"role": "system", "content" : conjugation_prompt},
        {"role": "user", "content": user_msg}
    ]

    completion = openai.chat.completions.create(
        model = gpt_model,
        messages = messages
    )

    reply = completion.choices[0].message.content
    print("returning chart")

    return jsonify({"reply":reply}), 200

def get_or_create_user():
    user = users.find_one({"username": "test_user"})
    if not user:
        users.insert_one({"username": "test_user", "words": []})
        user = users.find_one({"username": "test_user"})
    return user

@app.route("/api/words/add", methods=["POST"])
def add_word():
    data = request.get_json(force=True)
    word = data.get("word")

    if not word:
        return jsonify({"error": "No word provided"}), 400

    # Get or create the test user
    user = get_or_create_user()

    # Add the word to the user's list
    users.update_one(
        {"_id": user["_id"]},
        {"$push": {"words": word}}
    )

    return jsonify({"message": f"'{word}' added"}), 200



if __name__ == "__main__":
    app.run(debug=True,port = 5000)