
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../config";
import "./Chat.css";

const API = `${API_URL}/api`;

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const socketRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Get a consistent user ID
  const getUserId = (user) => {
    if (!user) return "";
    return String(user._id || user.id || user);
  };

  const currentUserId = getUserId(currentUser);

  // Safely format message time
  const formatMessageTime = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Keep selected conversation available to socket callbacks
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!token) {
          setError("Please login to access your chats.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API}/chat`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load conversations.");
        }

        setConversations(data.conversations || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  // Connect Socket.IO
  useEffect(() => {
    if (!token) return;

    const socket = io(API_URL, {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Chat connected:", socket.id);

      const conversation = selectedConversationRef.current;

      if (conversation) {
        socket.emit("joinConversation", conversation._id);
      }
    });

    socket.on("newMessage", (message) => {
      const activeConversation = selectedConversationRef.current;

      const messageConversationId = getUserId(message.conversation);
      const activeConversationId = getUserId(activeConversation?._id);

      if (
        activeConversation &&
        messageConversationId === activeConversationId
      ) {
        setMessages((previousMessages) => {
          const alreadyExists = previousMessages.some(
            (item) => item._id === message._id
          );

          if (alreadyExists) return previousMessages;

          return [...previousMessages, message];
        });
      }

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation._id === messageConversationId
            ? {
                ...conversation,
                lastMessage: message.text,
                lastMessageAt: message.createdAt
              }
            : conversation
        )
      );
    });

    socket.on("connect_error", (error) => {
      console.error("Chat connection error:", error.message);
    });

    socket.on("chatError", (message) => {
      console.error("Chat error:", message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversation || !token) return;

    const conversationId = selectedConversation._id;

    setMessages([]);
    setError("");

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${API}/chat/${conversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load messages.");
        }

        setMessages(data.messages || []);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMessages();

    const socket = socketRef.current;

    if (socket?.connected) {
      socket.emit("joinConversation", conversationId);
    }

    return () => {
      if (socket?.connected) {
        socket.emit("leaveConversation", conversationId);
      }
    };
  }, [selectedConversation, token]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  // Get the other participant
  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find(
      (participant) =>
        getUserId(participant) !== currentUserId
    );
  };

  // Send message
  const handleSendMessage = async (event) => {
    event.preventDefault();

    const text = newMessage.trim();

    if (!text || !selectedConversation || sending) return;

    try {
      setSending(true);
      setError("");

      const response = await fetch(
        `${API}/chat/${selectedConversation._id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ text })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Message could not be sent.");
      }

      const sentMessage = data.message;

      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (message) => message._id === sentMessage._id
        );

        if (alreadyExists) return previousMessages;

        return [...previousMessages, sentMessage];
      });

      setNewMessage("");

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation._id === selectedConversation._id
            ? {
                ...conversation,
                lastMessage: sentMessage.text,
                lastMessageAt: sentMessage.createdAt
              }
            : conversation
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="chat-loading">Loading chats...</div>;
  }

  return (
    <div className="chat-page">
      <div className="chat-container">

        {/* Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>My Connections</h2>
            <p>Your CampusLoop conversations</p>
          </div>

          <div className="conversation-list">
            {conversations.length === 0 ? (
              <div className="chat-empty">
                <h3>No conversations yet</h3>
                <p>
                  Once a purchase or swap is accepted,
                  your chat will appear here.
                </p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const participant = getOtherParticipant(conversation);

                return (
                  <button
                    key={conversation._id}
                    className={`conversation-item ${
                      selectedConversation?._id === conversation._id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="conversation-avatar">
                      {participant?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="conversation-info">
                      <h4>{participant?.name || "CampusLoop User"}</h4>
                      <p>{conversation.lastMessage || "Start chatting"}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat window */}
        <main className="chat-main">
          {!selectedConversation ? (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">💬</div>
              <h2>Welcome to CampusLoop Chat</h2>
              <p>
                Select a conversation to start messaging.
              </p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="conversation-avatar">
                  {getOtherParticipant(selectedConversation)
                    ?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <div>
                  <h3>
                    {getOtherParticipant(selectedConversation)?.name ||
                      "CampusLoop User"}
                  </h3>
                  <p>
                    {selectedConversation.type} conversation
                  </p>
                </div>
              </div>

              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    No messages yet. Say hello! 👋
                  </div>
                ) : (
                  messages.map((message) => {
                    const senderId = getUserId(message.sender);
                    const isMine = senderId === currentUserId;

                    return (
                      <div
                        key={message._id}
                        className={`message-row ${
                          isMine ? "my-message" : "other-message"
                        }`}
                      >
                        <div className="message-bubble">
                          <p>{message.text}</p>
                          <span>
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                className="chat-input-area"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  maxLength={2000}
                />

                <button type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </main>
      </div>

      {error && <div className="chat-error">{error}</div>}
    </div>
  );
}

export default Chat;
