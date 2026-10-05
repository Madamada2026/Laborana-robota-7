import { useState, useEffect } from 'react';

function UserProfileComplete({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Якщо userId не передано або він невалідний
    if (!userId) {
      setUserData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    // Масив з трьох паралельних запитів
    const fetchUser = fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, { signal }).then((res) => {
      if (!res.ok) throw new Error(`Помилка завантаження профілю (${res.status})`);
      return res.json();
    });

    const fetchPosts = fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`, { signal }).then((res) => {
      if (!res.ok) throw new Error(`Помилка завантаження постів (${res.status})`);
      return res.json();
    });

    const fetchAlbums = fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`, { signal }).then((res) => {
      if (!res.ok) throw new Error(`Помилка завантаження альбомів (${res.status})`);
      return res.json();
    });

    // Одночасне виконання всіх запитів через Promise.all
    Promise.all([fetchUser, fetchPosts, fetchAlbums])
      .then(([user, posts, albums]) => {
        setUserData({
          user,
          postsCount: posts.length,
          albumsCount: albums.length,
        });
        setLoading(false);
      })
      .catch((err) => {
        // Ігноруємо скасовані через AbortController запити
        if (err.name === 'AbortError') return;

        // При помилці хоча б одного запиту часткові дані НЕ зберігаються
        setError(err.message || 'Сталася помилка при завантаженні даних');
        setUserData(null);
        setLoading(false);
      });

    // Cleanup функція для скасування всіх трьох запитів при розмонтуванні або зміні userId
    return () => {
      controller.abort();
    };
  }, [userId]);

  if (!userId) {
    return <div style={{ padding: '15px', color: '#666' }}>Оберіть ID користувача для перегляду профілю.</div>;
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontWeight: 'bold', color: '#2563eb' }}>
        Завантаження повного профілю користувача #{userId} (паралельні запити Promise.all)...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '15px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626' }}>
        <strong>Загальна помилка завантаження:</strong> {error}
      </div>
    );
  }

  if (!userData) return null;

  const { user, postsCount, albumsCount } = userData;

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <h2 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>
        {user.name} (@{user.username})
      </h2>

      <div style={{ marginBottom: '20px', lineHeight: '1.6', color: '#334155' }}>
        <p style={{ margin: '4px 0' }}><strong>Email:</strong> {user.email}</p>
        <p style={{ margin: '4px 0' }}><strong>Телефон:</strong> {user.phone}</p>
        <p style={{ margin: '4px 0' }}><strong>Вебсайт:</strong> {user.website}</p>
        <p style={{ margin: '4px 0' }}><strong>Компанія:</strong> {user.company?.name}</p>
        <p style={{ margin: '4px 0' }}><strong>Місто:</strong> {user.address?.city}</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          textAlign: 'center'
        }}
      >
        <div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8' }}>{postsCount}</div>
          <div style={{ fontSize: '14px', color: '#1e40af' }}>Опублікованих постів</div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>{albumsCount}</div>
          <div style={{ fontSize: '14px', color: '#166534' }}>Створених альбомів</div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileComplete;
