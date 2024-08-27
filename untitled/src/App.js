import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
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
              {user && <Route path="/profile" element={<UserProfile user={user} />} />}
              <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
