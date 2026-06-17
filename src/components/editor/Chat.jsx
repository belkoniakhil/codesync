import { useEffect, useRef, useState } from "react";
import socket from "../../services/socket";
import Message from "./Message";

function Chat({ roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  // Listen for incoming messages
  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prev) => [
        ...prev,
        message,
      ]);
    };

    socket.on(
      "RECEIVE_MESSAGE",
      handleMessage
    );

    return () => {
      socket.off(
        "RECEIVE_MESSAGE",
        handleMessage
      );
    };
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      username,
      text: input,
      timestamp: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };

    socket.emit("SEND_MESSAGE", {
      roomId,
      message,
    });

    setInput("");
  };

  return (
    <div className="bg-slate-800 rounded-xl p-3 flex flex-col h-80">
      <h3 className="font-semibold mb-3">
        Chat
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            currentUser={username}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type message..."
          className="flex-1 bg-slate-700 rounded-lg px-3 py-2 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;