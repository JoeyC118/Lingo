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






if __name__ == "__main__":
    app.run(debug=True,port = 5000)