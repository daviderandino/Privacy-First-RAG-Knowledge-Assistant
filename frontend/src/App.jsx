import { useState, useEffect } from 'react'; // Aggiungi useEffect
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar'; // <--- NUOVO IMPORT
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [activePage, setActivePage] = useState(1);
  
  // NUOVO STATO: Lista documenti
  const [documents, setDocuments] = useState([]);

  // 1. Carica documenti all'avvio
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://localhost:8000/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Errore fetch documenti:", error);
    }
  };

  const handleUploadSuccess = () => {
    setMessages(prev => [...prev, { 
      sender: 'bot', 
      text: 'Documento aggiunto alla memoria! Ora so più cose.' 
    }]);
    // Aggiorna la lista nella sidebar
    fetchDocuments();
  };

  // Quando clicchi un doc nella sidebar, lo apri nel viewer
  const handleSelectDoc = (filename) => {
    setPdfUrl(`http://localhost:8000/static/${filename}`);
  };

  // ... handleSendMessage e handleSourceClick RESTANO UGUALI ...
  // ... Copiali dal tuo codice precedente ...
  const handleSourceClick = (sourceString) => {
      const match = sourceString.match(/Pagina (\d+)/);
      if (match && match[1]) setActivePage(parseInt(match[1]));
  };

  const handleSendMessage = async (text) => {
      // ... (Logica chat invariata) ...
      // Assicurati di incollare la versione con la history che avevamo fatto prima!
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
        setMessages(prev => [...prev, { sender: 'bot', text: 'Errore server.' }]);
      } finally {
        setIsLoading(false);
      }
  };


  return (
    <div className="app-layout">
      <Header />
      
      <main className="main-content split-view">
        
        {/* 1. SIDEBAR (Nuova Colonna Sinistra) */}
        <div className="sidebar-column">
          <Sidebar documents={documents} onSelectDoc={handleSelectDoc} />
        </div>

        {/* 2. CHAT (Colonna Centrale) */}
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

        {/* 3. PDF (Colonna Destra) */}
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