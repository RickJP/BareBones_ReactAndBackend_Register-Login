import React, {useState, useContext} from 'react';
import axios from '../../axios';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {setUserData} = useContext(UserContext);
  const history = useHistory();

  const handleLoginEmail = (e) => setEmail(e.target.value);
  const handleLoginPassword = (e) => setPassword(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    const loginUser = {email, password};
    const loginRes = await axios.post('/users/login', loginUser);

    setUserData({
      token: loginRes.data.token,
      user: loginRes.data.user,
    });
    localStorage.setItem('auth-token', loginRes.data.token);
    history.push('/');
  };


  return (
    <div className='page'>
      <h2>Login</h2>
      <form className='form' onSubmit={onSubmit}>
        <label htmlFor='login-email'>Email</label>
        <input
          type='email'
          id='login-email'
          onChange={handleLoginEmail}
        />
        <label htmlFor='login-password'>Password</label>
        <input
          type='password'
          id='login-password'
          onChange={handleLoginPassword}
        />

        <button type='submit' value='login'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
