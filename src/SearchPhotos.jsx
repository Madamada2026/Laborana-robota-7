import { useState, useEffect } from 'react';

function SearchPhotos() {
  const [albumId, setAlbumId] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Обробка порожнього вводу: не робимо запит і очищаємо результати
    if (!albumId.trim()) {
      setPhotos([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // 2. Встановлюємо таймер Debounce на 500 мс
    const timerId = setTimeout(() => {
      fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId.trim()}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP помилка! Статус: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setPhotos(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, 500);

    // 3. Cleanup функція: очищає таймер, якщо користувач продовжує вводити текст
    return () => {
      clearTimeout(timerId);
    };
  }, [albumId]); // Залежність від albumId забезпечує відстеження введення

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Пошук фотографій за ID альбому</h2>
      
      {/* Поле введення */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="number"
          placeholder="Введіть ID альбому (наприклад, 1, 2, 3)..."
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          style={{
            padding: '10px 15px',
            width: '300px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* Індикатор завантаження */}
      {loading && (
        <div style={{ textAlign: 'center', margin: '20px 0', fontWeight: 'bold', color: '#2563eb' }}>
          Завантаження фотографій (debounce 500мс)...
        </div>
      )}

      {/* Повідомлення про помилку */}
      {error && (
        <div style={{ textAlign: 'center', color: 'red', margin: '20px 0' }}>
          Помилка: {error}
        </div>
      )}

      {/* Повідомлення про відсутність результатів */}
      {!loading && !error && albumId.trim() !== '' && photos.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', margin: '20px 0' }}>
          За ID альбому "{albumId}" фотографій не знайдено.
        </div>
      )}

      {/* Сітка результатів (Grid галерея) */}
      {!loading && photos.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '15px',
            marginTop: '20px'
          }}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: '#fff',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                style={{ width: '100%', borderRadius: '4px', height: '150px', objectFit: 'cover' }}
              />
              <p
                style={{
                  fontSize: '12px',
                  margin: '8px 0 0 0',
                  color: '#475569',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={photo.title}
              >
                {photo.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPhotos;
