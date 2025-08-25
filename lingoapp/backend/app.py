from flask import Flask,request, jsonify
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(override=True)

openai_api_key = os.getenv('OPENAI_API_KEY')
openai = OpenAI()
gpt_model = "gpt-4o-mini"

system_prompt = "ONLY REPLY IN MARKDOWN LANGUAGE. DONT ASSUME THE USER CAN SPEAK SPANISH, YOU CANT REPLY IN SPANISH U HAVE TO TEACH IT! You are optimized to teach spanish. Your main function is to listen for a user to give u a spanish phrase, and then you translate it but theres more" \
"First, when someone gives u a phrase, u translate it.  Then u break down each word and what it means, then you give examples of the phrase in context.  Do it in a natural way, talk to the user but put" \
"flow these requriements in the conversation naturally"

conjugation_prompt = conjugation_prompt = "You are a Spanish verb conjugation assistant. Always respond **only in Markdown**.\n\n" \
"Your job:\n" \
"1. Identify the **most important Spanish verb** in the user's input (if multiple, choose one).\n" \
"2. Return a **well-structured conjugation chart** for that verb.\n" \
"3. Include **all major tenses** (present, preterite, imperfect, future, conditional) and **participles**.\n" \
"4. Use **tables** or clear section headers so the chart fits neatly on one screen.\n" \
"5. Write **all labels and explanations in English only**.\n" \
"6. Do NOT add extra commentary, greetings, or translations outside the chart.\n\n" \
"### Example Output Format (Markdown)\n" \
"\\`\\`\\`markdown\n" \
"# Conjugation of *hablar*\n\n" \
"## Participles\n" \
"- **Infinitive:** hablar\n" \
"- **Gerund:** hablando\n" \
"- **Past Participle:** hablado\n\n" \
"## Indicative Mood\n\n" \
"| Tense       | yo       | tú       | él/ella/usted | nosotros | vosotros | ellos/ustedes |\n" \
"|------------|-----------|-----------|---------------|-----------|-----------|---------------|\n" \
"| Present    | hablo     | hablas    | habla         | hablamos  | habláis   | hablan        |\n" \
"| Preterite  | hablé     | hablaste  | habló         | hablamos  | hablasteis| hablaron      |\n" \
"| Imperfect  | hablaba   | hablabas  | hablaba       | hablábamos| hablabais | hablaban      |\n" \
"| Future     | hablaré   | hablarás  | hablará       | hablaremos| hablaréis | hablarán      |\n" \
"| Conditional| hablaría  | hablarías | hablaría      | hablaríamos| hablaríais| hablarían    |\n" \
"\\`\\`\\`\n\n" \
"Keep responses clean, concise, and fully Markdown-compliant."

app = Flask(__name__)

@app.route("/", methods = ["GET"])
def home():
    return "Hello World, from Flask!"

@app.route("/api/chat", methods = ["POST"])
def call_model():
    data = request.get_json(force = True) or {}
    user_msg = (data.get("message") or "").strip()

    messages = [
        {"role":"system", "content": system_prompt },
        {"role":"user", "content": user_msg}
    ]
    completion = openai.chat.completions.create(
        model = gpt_model,
        messages = messages
    )

    reply = completion.choices[0].message.content

    return jsonify({"reply": reply}), 200

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





if __name__ == "__main__":
    app.run(debug=True,port = 5000)