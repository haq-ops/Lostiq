import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiSend, FiArrowLeft } from 'react-icons/fi';

const socket = io('http://localhost:5000');

const Chat = () => {
  const { itemId, userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const messagesEndRef = useRef(null);
  const roomId = [itemId, user?._id, userId].sort().join('-');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Join socket room
    socket.emit('join', user._id);
    socket.emit('joinRoom', roomId);

    // Fetch messages & item details
    fetchData();

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchData = async () => {
    try {
      const [messagesRes, itemRes] = await Promise.all([
        API.get(`/messages/${itemId}/${userId}`),
        API.get(`/items/${itemId}`)
      ]);
      setMessages(messagesRes.data);
      setItem(itemRes.data);

      // Set receiver info
      const receiverData = itemRes.data.postedBy._id === user._id
        ? { _id: userId, name: 'User' }
        : itemRes.data.postedBy;
      setReceiver(receiverData);
    } catch (error) {
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await API.post('/messages', {
        receiver: userId,
        item: itemId,
        message: newMessage
      });

      // Emit to socket room
      socket.emit('sendMessage', {
        roomId,
        message: data
      });

      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">💬</div>
      <p className="text-gray-500">Loading chat...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[80vh]">

        {/* Chat Header */}
        <div className="bg-primary text-white p-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:text-secondary transition">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold">{item?.title}</h2>
            <p className="text-gray-300 text-sm">
              {item?.type === 'lost' ? '🔴 Lost' : '🟢 Found'} • {item?.location?.city}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">👋</div>
              <p className="text-gray-500">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.sender._id === user._id || msg.sender === user._id;
              return (
                <div
                  key={index}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isMe
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-gray-300' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition flex items-center gap-2"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;