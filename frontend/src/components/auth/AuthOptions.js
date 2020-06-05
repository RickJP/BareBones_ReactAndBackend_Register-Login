import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';

function AuthOptions() {
  const {userData, setUserData} = useContext(UserContext);

  const history = useHistory();

  const handleRegister = () => history.push('/register');
  const handleLogin = () => history.push('/login');
  const handleLogout = () => {
    setUserData({
       token: undefined,
       user: undefined 
    });
    localStorage.setItem('auth-token', '');
  };

  return (
    <nav className='auth-options'>
      {userData.user ? (
        <button onClick={handleLogout}>Log Out</button>
      ) : (
        <>
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Log In</button>
        </>
      )}
    </nav>
  );
}

export default AuthOptions;
