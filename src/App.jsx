import { useState } from 'react';
import UserProfileComplete from './UserProfileComplete';

function App() {
  const [selectedUserId, setSelectedUserId] = useState(1);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={() => setSelectedUserId(1)}>Користувач #1</button>{' '}
        <button onClick={() => setSelectedUserId(2)}>Користувач #2</button>{' '}
        <button onClick={() => setSelectedUserId(99999)}>Неіснуючий користувач (Помилка)</button>
      </div>

      <UserProfileComplete userId={selectedUserId} />
    </div>
  );
}

export default App;
