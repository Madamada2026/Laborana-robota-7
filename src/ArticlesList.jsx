import { useState, useEffect } from 'react';

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h3>Завантаження статей...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
        <h3>Помилка завантаження: {error}</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Список статей</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {articles.map((article) => (
          <div
            key={article.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ marginTop: 0, color: '#333' }}>{article.title}</h3>
            <p style={{ color: '#555', marginBottom: 0 }}>{article.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticlesList;
