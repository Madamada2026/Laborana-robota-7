import { useState, useEffect } from 'react';

function PaginatedPosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([1]); // Історія відвіданих сторінок

  const limit = 10; // Кількість постів на сторінку

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`, {
      signal: controller.signal,
    })
      .then((res) => {
        // Отримуємо загальну кількість елементів із заголовка 'x-total-count'
        const totalCount = res.headers.get('x-total-count');
        if (totalCount) {
          setTotalPages(Math.ceil(Number(totalCount) / limit));
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Помилка завантаження:', err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [page]);

  // Перехід на нову сторінку з фіксацією в історії
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      setHistory((prev) => [...prev, newPage]);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      

      {/* Панель навігації */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
        <button onClick={() => goToPage(1)} disabled={page === 1 || loading}>
          « Перша
        </button>
        <button onClick={() => goToPage(page - 1)} disabled={page === 1 || loading}>
          ‹ Попередня
        </button>

        <span style={{ fontWeight: 'bold', margin: '0 10px' }}>
          Сторінка {page} з {totalPages}
        </span>

        <button onClick={() => goToPage(page + 1)} disabled={page === totalPages || loading}>
          Наступна ›
        </button>
        <button onClick={() => goToPage(totalPages)} disabled={page === totalPages || loading}>
          Остання »
        </button>
      </div>

      {/* Індикатор завантаження */}
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#2563eb', fontWeight: 'bold' }}>
          Завантаження сторінки #{page}...
        </div>
      ) : (
        /* Список постів */
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                marginBottom: '8px',
                backgroundColor: '#f8fafc',
              }}
            >
              <strong style={{ textTransform: 'capitalize' }}>
                #{post.id} {post.title}
              </strong>
              <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '14px' }}>{post.body}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Відображення історії відвіданих сторінок */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '13px' }}>
        <strong>Історія відвіданих сторінок:</strong> {history.join(' → ')}
      </div>
    </div>
  );
}

export default PaginatedPosts;