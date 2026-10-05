import { useState } from 'react';
import { useApi } from './hooks/useApi';

function CrudDemo() {
  const [requestConfig, setRequestConfig] = useState({
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'GET',
    body: null,
  });

  const { data, loading, error, refetch } = useApi(
    requestConfig.url,
    requestConfig.method,
    requestConfig.body
  );

  const handleGet = () => {
    setRequestConfig({
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'GET',
      body: null,
    });
  };

  const handlePost = () => {
    setRequestConfig({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'POST',
      body: {
        title: 'Новий пост (useApi)',
        body: 'Вміст створеного поста за допомогою кастомного хука',
        userId: 1,
      },
    });
  };

  const handlePut = () => {
    setRequestConfig({
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'PUT',
      body: {
        id: 1,
        title: 'Оновлений заголовок поста',
        body: 'Оновлений вміст поста',
        userId: 1,
      },
    });
  };

  const handleDelete = () => {
    setRequestConfig({
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'DELETE',
      body: null,
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
    

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={handleGet} style={btnStyle('#3b82f6')}>GET (Отримати #1)</button>
        <button onClick={handlePost} style={btnStyle('#10b981')}>POST (Створити)</button>
        <button onClick={handlePut} style={btnStyle('#f59e0b')}>PUT (Оновити #1)</button>
        <button onClick={handleDelete} style={btnStyle('#ef4444')}>DELETE (Видалити #1)</button>
        <button onClick={refetch} style={btnStyle('#6b7280')}>Refetch (Повторити)</button>
      </div>

      <div style={{ padding: '10px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '15px' }}>
        <strong>Поточний запит:</strong> <code>{requestConfig.method}</code> — {requestConfig.url}
      </div>

      {loading && (
        <div style={{ padding: '15px', textAlign: 'center', color: '#2563eb', fontWeight: 'bold' }}>
          Завантаження даних через useApi ({requestConfig.method})...
        </div>
      )}

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '6px' }}>
          <strong>Помилка:</strong> {error}
        </div>
      )}

      {!loading && !error && data && (
        <div style={{ marginTop: '15px' }}>
          <h3>Відповідь API:</h3>
          <pre
            style={{
              backgroundColor: '#0f172a',
              color: '#38bdf8',
              padding: '15px',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '14px'
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

const btnStyle = (bgColor) => ({
  padding: '8px 16px',
  backgroundColor: bgColor,
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
});

export default CrudDemo;