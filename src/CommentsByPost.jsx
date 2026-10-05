import { useState, useEffect } from 'react';

function CommentsByPost({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Перевірка: якщо postId не визначений або null, скидаємо стан і не робимо запит
    if (!postId) {
      setComments([]);
      setLoading(false);
      setError(null);
      return;
    }

    // 2. Створення AbortController для скасування запиту при зміні postId або демонтажі
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    // 3. Динамічний запит за postId
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`, { signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        // Якщо запит скасовано через AbortController — ігноруємо помилку
        if (err.name === 'AbortError') {
          console.log(`Запит для postId=${postId} скасовано`);
          return;
        }
        setError(err.message);
        setLoading(false);
      });

    // 4. Cleanup функція для AbortController
    return () => {
      controller.abort();
    };
  }, [postId]); // Залежність postId забезпечує повторний виклик при зміні props

  // Відображення, якщо postId не передано
  if (!postId) {
    return (
      <div style={{ padding: '15px', color: '#666', fontStyle: 'italic' }}>
        Оберіть або вкажіть ID поста для перегляду коментарів.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '15px', fontWeight: 'bold' }}>
        Завантаження коментарів до поста #{postId}...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '15px', color: 'red' }}>
        Помилка завантаження коментарів: {error}
      </div>
    );
  }

  // Повідомлення про відсутність коментарів (якщо масив порожній)
  if (comments.length === 0) {
    return (
      <div style={{ padding: '15px', color: '#888' }}>
        До поста #{postId} коментарі відсутні.
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '15px' }}>
      <h3>Коментарі до поста #{postId} ({comments.length}):</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: '10px 15px',
              backgroundColor: '#f1f5f9',
              borderRadius: '6px',
              borderLeft: '4px solid #3b82f6'
            }}
          >
            <strong style={{ display: 'block', fontSize: '0.9em', color: '#1e293b' }}>
              {comment.name} ({comment.email})
            </strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.95em', color: '#334155' }}>
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentsByPost;
