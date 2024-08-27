import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Messages from './component/Messages';
import UserProfile from './component/UserProfile';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (jwtToken, profile) => {
    setUser(profile);

  };

  return (
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/messages" element={<Messages />} />
            {user && <Route path="/profile" element={<UserProfile userId={user.id} />} />}
          </Routes>
        </div>
      </Router>
  );
}

export default App;
