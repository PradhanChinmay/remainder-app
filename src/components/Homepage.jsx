import React, { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';

import { uid } from 'uid';
import { set, ref, onValue, remove } from 'firebase/database';

import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import '../styles/Homepage.css';

const Homepage = () => {

  const [remainder, setRemainder] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [rems, setRems] = useState([]);

  const [isCompleted, setIsCompleted] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (res) => {

      if(res?.accessToken) {

        onValue(ref(db, `/${ auth.currentUser.uid }`), (snapshot) => {
          setRems([]);

          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((rem) => {
              setRems((oldArray) => [...oldArray, rem]);
            })
          }
        })

      } else if (!res?.accessToken) {
        navigate('/');
      }
    })
  }, [])

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((err) => {
      alert(err.message);
    })
  }

  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      remainder: remainder,
      date: date,
      time: time,
      uidd: uidd
    });

    setRemainder('');
    setDate('');
    setTime('');
  }

  const handleDelete = (uidd) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uidd}`));
  }

  const handleCompletion = () => {
    if (isCompleted) {
      setIsCompleted(false);
    }
    else {
      setIsCompleted(true);
    }
  }

  return (
    <div className='homepage'>
        <div className='input-container'>
          <TextField autoFocus variant='outlined' className='add-input' type='text' label='Add remainder' onChange={(e) => setRemainder(e.target.value)} value={remainder} />
          <TextField variant='outlined' className='add-input' type='date' onChange={(e) => setDate(e.target.value)} value={date} />
          <TextField variant='outlined' className='add-input' type='time' onChange={(e) => setTime(e.target.value)} value={time} />
          <Button variant='contained' onClick={writeToDatabase}>add</Button>
        </div>

        <div className='remainder-container'>
          {
            rems.map((rem) => (
              <div className='remainder'>
                <div className='remainder-content'>
                  <h2>{rem.remainder}</h2><p>by {rem.time}</p><p>, {rem.date}</p> {isCompleted && <span style={{color: 'green', fontWeight: 'bold', marginLeft: '8px'}}>completed</span>}
                </div>
                <CheckBoxIcon className='check-button' sx={{color: isCompleted ? 'greenyellow' : 'black'}} onClick={handleCompletion} />
                <DeleteIcon onClick={() => handleDelete(rem.uidd)} className='delete-button' />
              </div>
            ))
          }
        </div>
        
        <LogoutIcon onClick={ handleSignOut } className='logout-icon'/>
    </div>
  )
}

export default Homepage