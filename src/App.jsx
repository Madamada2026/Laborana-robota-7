import { useState } from 'react';
import ArticlesList from './ArticlesList';
import CommentsByPost from './CommentsByPost';

function App() {
  const [selectedPostId, setSelectedPostId] = useState(1);

  return (
    <div style={{ padding: '20px' }}>
      
      
      {/* Тестове перемикання ID поста */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#e2e8f0', borderRadius: '8px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Оберіть ID поста:
        </label>
        <button onClick={() => setSelectedPostId(1)}>Пост 1</button>{' '}
        <button onClick={() => setSelectedPostId(2)}>Пост 2</button>{' '}
        <button onClick={() => setSelectedPostId(999)}>Пост 999 (Порожній)</button>{' '}
        <button onClick={() => setSelectedPostId(null)}>Скинути (null)</button>
      </div>

      <CommentsByPost postId={selectedPostId} />

      <hr style={{ margin: '30px 0' }} />

      <ArticlesList />
    </div>
  );
}

export default App;