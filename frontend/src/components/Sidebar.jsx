import { FaBook, FaDatabase } from 'react-icons/fa';

const Sidebar = ({ documents }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <FaDatabase /> Knowledge Base
      </div>
      
      <div className="doc-list">
        {documents.length === 0 ? (
          <p className="no-docs">No documents.</p>
        ) : (
          documents.map((doc, index) => (
            <div 
              key={index} 
              className="doc-item" 
            >
              <FaBook className="doc-icon" />
              <span className="doc-name">{doc}</span>
            </div>
          ))
        )}
      </div>
      
      <div className="sidebar-footer">
        <small>{documents.length} indexed documents</small>
      </div>
    </aside>
  );
};

export default Sidebar;