from flask import request, jsonify
import os
from flask import Flask, session
from flask_socketio import SocketIO, emit, join_room, leave_room
from dotenv import load_dotenv
from openai import OpenAI

# ------------------ SETUP ------------------
load_dotenv()
app = Flask(__name__)
app.secret_key = "hackathon_secret"
socketio = SocketIO(app, cors_allowed_origins="*")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory storage for demo
waiting_humans = []
active_pairs = {}

# ------------------ AI MODERATION ------------------


def rewrite_message_if_needed(message: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content":
                 "You are an AI moderation assistant. "
                 "When a helper sends a message in a mental health chat, "
                 "detect if the message might be dismissive, harsh, or unsafe. "
                 "If it's fine, return it as is. If not, rewrite it "
                 "to be supportive, kind, and emotionally safe."},
                {"role": "user", "content": message}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI moderation error: {e}")
        return message

# ------------------ SOCKET HANDLERS ------------------


@socketio.on("join")
def handle_join(data):
    username = data.get("username")
    category = data.get("category")  # 'AI', 'Human', 'Professional'
    session["username"] = username
    session["category"] = category
    join_room(username)

    if category == "Human":
        waiting_humans.append(username)
        emit("waiting", {"message": "Waiting for a human helper..."})
    else:
        emit("ready", {"message": f"You are connected to {category} chat."})


@socketio.on("send_message")
def handle_message(data):
    username = session.get("username")
    category = session.get("category")
    message = data.get("message", "")

    if category == "Human":
        # Send only if paired
        partner = active_pairs.get(username)
        if not partner:
            emit("error", {"message": "No partner found"})
            return
        filtered_message = rewrite_message_if_needed(message)
        emit("receive_message", {"username": username,
             "message": filtered_message}, room=username)
        emit("receive_message", {"username": username,
             "message": filtered_message}, room=partner)
    else:
        # For AI and Professional category, just echo or handle differently
        emit("receive_message", {"username": username,
             "message": message}, room=username)


@socketio.on("disconnect")
def handle_disconnect():
    username = session.get("username")
    category = session.get("category")
    if username in waiting_humans:
        waiting_humans.remove(username)
    partner = active_pairs.get(username)
    if partner:
        emit("partner_disconnected", {
             "message": "Your partner has left."}, room=partner)
        active_pairs.pop(partner, None)
        active_pairs.pop(username, None)
    leave_room(username)


@app.route("/test_ai", methods=["POST"])
def test_ai():
    from flask import request, jsonify
    data = request.get_json()
    message = data.get("message", "")
    result = rewrite_message_if_needed(message)
    return jsonify({"original": message, "filtered": result})


# ------------------ MAIN ------------------
if __name__ == "__main__":
    print("🚀 TalkToMe backend running on http://127.0.0.1:5000")
    socketio.run(app, host="0.0.0.0", port=5001,
                 debug=True, allow_unsafe_werkzeug=True)
