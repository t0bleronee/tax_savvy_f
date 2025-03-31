from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyAQAx7rRqLxq6U5XZAmX_xtU1A3kT55KTE")
client = MongoClient("mongodb://localhost:27017/")
db = client.chatbotDB
messages_collection = db.messages

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message", "").strip()
        if not user_message:
            return jsonify({"error": "Empty message"}), 400

        messages_collection.insert_one({"text": user_message, "sender": "user"})

        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(user_message)
        bot_response = response.text if response else "Sorry, I couldn't generate a response."

        messages_collection.insert_one({"text": bot_response, "sender": "bot"})

        return jsonify({"response": bot_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history", methods=["GET"])
def history():
    try:
        chat_history = list(messages_collection.find().sort("_id", -1).limit(10))
        chat_history.reverse()
        return jsonify({"chat_history": chat_history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
