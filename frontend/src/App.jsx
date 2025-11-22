import { useState, useEffect } from 'react'; 
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar'; 
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [activePage, setActivePage] = useState(1);
  
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://localhost:8000/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleUploadSuccess = () => {
    setMessages(prev => [...prev, { 
      sender: 'bot', 
      text: 'Document added to memory! Now I know more things.' 
    }]);
    fetchDocuments();
  };

  const handleSelectDoc = (filename) => {
    setPdfUrl(`http://localhost:8000/static/${filename}`);
  };

  const handleSourceClick = (sourceString) => {
      const match = sourceString.match(/Pagina (\d+)/);
      if (match && match[1]) setActivePage(parseInt(match[1]));
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
          body: JSON.stringify({ question: text, history: historyPayload }),
        });
        const data = await response.json();
        setMessages(prev => [...prev, { sender: 'bot', text: data.answer, sources: data.sources }]);
      } catch (error) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Server error' }]);
      } finally {
        setIsLoading(false);
      }
  };


  return (
    <div className="app-layout">
      <Header />
      
      <main className="main-content split-view">
        
        <div className="sidebar-column">
          <Sidebar documents={documents} onSelectDoc={handleSelectDoc} />
        </div>

        <div className="chat-column">
          <div className="top-bar">
            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </div>

          <div className="chat-container">
            <MessageList 
              messages={messages} 
              isLoading={isLoading} 
              onSourceClick={handleSourceClick} 
            />
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>

        {pdfUrl && (
          <div className="pdf-column">
            <PdfViewer url={pdfUrl} targetPage={activePage} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;