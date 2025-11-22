import { FaBook, FaDatabase } from 'react-icons/fa';

const Sidebar = ({ documents }) => {
  // Nota: ho rimosso "onSelectDoc" dalle props perché non lo usiamo più
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <FaDatabase /> Knowledge Base
      </div>
      
      <div className="doc-list">
        {documents.length === 0 ? (
          <p className="no-docs">Nessun documento.</p>
        ) : (
          documents.map((doc, index) => (
            <div 
              key={index} 
              className="doc-item" 
              // RIMOSSO: onClick={() => onSelectDoc(doc)}
            >
              <FaBook className="doc-icon" />
              <span className="doc-name">{doc}</span>
            </div>
          ))
        )}
      </div>
      
      <div className="sidebar-footer">
        <small>{documents.length} documenti indicizzati</small>
      </div>
    </aside>
  );
};

export default Sidebar;