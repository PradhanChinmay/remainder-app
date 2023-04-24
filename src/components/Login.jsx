import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../firebase';

import { useNavigate } from 'react-router-dom';

import bannerImg from '../assets/header-img.svg'

import { TextField, Button } from '@mui/material';

import '../styles/Login.css';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isRegistering, setIsRegistering] = useState(false);

  const [registerInfo, setRegisterInfo] = useState({
    email: '',
    // confirmedEmail: '',
    password: '',
    confirmedPassword: ''
  })

  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (res?.accessToken) {
        navigate('/homepage');
      }
    })
  },[])

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password).then(() => {
      navigate('/homepage');
    }).catch((err) => alert(err.message));
  }

  const handleRegister = () => {

    if (registerInfo.password !== registerInfo.confirmedPassword) {
      alert('Please check your credentials');
      return;
    }

    createUserWithEmailAndPassword(auth, registerInfo.email, registerInfo.password).then(() => {
      navigate('/homepage');
    }).catch((err) => {
      alert(err.message);
    })
  }

  return (
    <div className='login'>
      <img src={bannerImg} className="banner-img" alt='banner-img'/>
      <h1>Remainder App</h1>

      <div className='login-register-container'>
        {
          isRegistering ? (
            <>
              <TextField required autoFocus variant='outlined' label='Enter email' type='email' value={registerInfo.email} onChange={(e) => {
                setRegisterInfo({
                  ...registerInfo,
                  email: e.target.value
                })
              }} className='inp-common'/>
              {/* <TextField required variant='outlined' type="email" label='confirm email' value={registerInfo.confirmedEmail} onChange={(e) => {
                setRegisterInfo({
                  ...registerInfo,
                  confirmedEmail: e.target.value
                })
              }} className='inp-common'/> */}
              <TextField required variant='outlined' type='password' label='Enter Password' value={registerInfo.password} onChange={(e) => {
                setRegisterInfo({
                  ...registerInfo, 
                  password: e.target.value
                })
              }} className='inp-common'/>
              <TextField required variant='outlined' type='password' label='Confirm Password' value={registerInfo.confirmedPassword} 
                onChange={(e) => {
                  setRegisterInfo({
                    ...registerInfo,
                    confirmedPassword: e.target.value
                  })
                }}
                className='inp-common'
              />

              <Button variant='contained' onClick={handleRegister}>Register</Button>
              <p>Already an user? <span onClick={() => setIsRegistering(false)}
                  style={{textDecoration: 'underline',
                      color: '#0072b1',
                      cursor: 'pointer'
                    }}
                >Sign in</span>
              </p>
            </>
          ) : (
            <>
              <TextField required autoFocus className='inp-common' variant='outlined' label='Enter email' type="email" onChange={handleEmailChange} value={email}/>
              <TextField required className='inp-common' variant='outlined' label='Enter password' type="password" onChange={handlePasswordChange} value={password}/>
              <Button variant='contained' onClick={handleSignIn}>Sign In</Button>
              
              {/* <button onClick={() => setIsRegistering(true)}>Create An Account</button> */}
              <p>New to remainder app? <span onClick={() => setIsRegistering(true)}
                  style={{textDecoration: 'underline',
                      color: '#0072b1',
                      cursor: 'pointer'
                    }}
                >register now</span>
              </p>
            </>
          )
        }
      </div>
    </div>
  )
}

export default Login