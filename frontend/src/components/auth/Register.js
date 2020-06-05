import React, {useState, useContext} from 'react';
import axios from '../../axios';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [displayName, setDisplayName] = useState('');

  const {setUserData} = useContext(UserContext);
  const history = useHistory();

  const handleRegisterEmail = (e) => setEmail(e.target.value);
  const handleRegisterPassword = (e) => setPassword(e.target.value);
  const handleVerifyPassword = (e) => setPasswordCheck(e.target.value);
  const handleDisplayName = (e) => setDisplayName(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = {email, password, passwordCheck, displayName};
    await axios.post('/users/register', newUser);

    const loginRes = await axios.post('/users/login', {email, password});
    setUserData({
      token: loginRes.data.token,
      user: loginRes.data.user,
    });
    localStorage.setItem('auth-token', loginRes.data.token);
    history.push('/');
  };

  return (
    <div className='page'>
      <h2>Register</h2>
      <form className='form' onSubmit={onSubmit}>
        <label htmlFor='register-email'>Email</label>
        <input
          type='email'
          id='register-email'
          onChange={handleRegisterEmail}
        />
        <label htmlFor='register-password'>Password</label>
        <input
          type='password'
          id='register-password'
          onChange={handleRegisterPassword}
        />
        <input
          type='password'
          placeholder='Verify Password'
          onChange={handleVerifyPassword}
        />

        <label htmlFor='register-display-name'>Display Name</label>
        <input
          type='text'
          id='register-display-name'
          onChange={handleDisplayName}
        />

        <button type='submit' value='register'>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
