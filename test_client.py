import socketio

# Connect to your running TalkToMe backend
sio = socketio.Client()


@sio.event
def connect():
    print("✅ Connected to TalkToMe backend!")


@sio.event
def disconnect():
    print("❌ Disconnected from server.")


@sio.on("receive_message")
def on_message(data):
    print(f"{data['username']}: {data['message']}")


# Connect as a "user" to the AI chat
sio.connect("http://127.0.0.1:5000")

# Join the AI chat category
sio.emit("join", {"username": "TestUserAI", "role": "ChatAI"})

# Send a message to the AI
while True:
    msg = input("You: ")
    sio.emit("send_message", {"message": msg})
