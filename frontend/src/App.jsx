import { useState } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadSuccess = () => {
    setMessages(prev => [...prev, { 
      sender: 'bot', 
      text: 'Document analyzed successfully! I\'m ready to answer your questions.' 
    }]);
  };

const handleSendMessage = async (text) => {
    const userMsg = { sender: 'user', text };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); 
    setIsLoading(true);

    const historyPayload = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: text,
          history: historyPayload 
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: data.answer, 
        sources: data.sources 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Network Error' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Header />
      
      <main className="main-content">
        <div className="top-bar">
          <FileUploader onUploadSuccess={handleUploadSuccess} />
        </div>

        <div className="chat-container">
          <MessageList messages={messages} isLoading={isLoading} />
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
}

export default App;