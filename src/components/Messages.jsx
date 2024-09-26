import React, { useState, useEffect } from "react";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages from the server
    const fetchMessages = async () => {
      const response = await fetch("/api/messages");
      const data = await response.json();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      <ul className="space-y-4">
        {messages.map((message) => (
          <li key={message.id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{message.subject}</h3>
            <p>{message.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
