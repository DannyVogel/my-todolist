import { useState, useEffect } from 'react'
import uuid from 'react-uuid';
import Task from './Components/Task'
import AuthModal from './Components/AuthModal';
import './App.css'
import {database, ref, update, remove, onValue} from '../firebase'
import { DataSnapshot } from 'firebase/database';
import { auth, signOut, get, onAuthStateChanged } from '../firebase';
import type { User } from '../firebase';

interface ToDo {
  id: string,
  text: string,
  checked: boolean
}

function App(): JSX.Element {
  const [toDos, setToDos] = useState<ToDo[]>(()=>[])
  const [newText, setNewText] = useState<string>("")
  const [errorParagraph, setErrorParagraph] = useState<boolean>(false)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [userName, setUser] = useState<string>("")
  const [userUID, setUserUID] = useState<string>("")
  const toDoDB = ref(database, "toDoApp")
  const toDoListRef = ref(database, '/toDoApp/toDoLists/' + userUID)

  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null)=> {
      if (user) {
        const uid: string = user.uid;
        setUser(user.displayName ? user.displayName : 'Guest')
        setLoggedIn(true)
        setUserUID(uid)
      } else {
        setLoggedIn(false)
        setUser('')
        setUserUID('')
        // User is signed out
      }
    });
  }, [])

  //when logged in, get from database once
  useEffect(() => {
    if(loggedIn){
      get(toDoListRef).then((snapshot: DataSnapshot) => {
        snapshot.exists() ? setToDos(snapshot.val()) : setToDos([])
      })
    }
  }, [loggedIn]);

  // Read todos from firebase realtime storage database and update in realtime
  useEffect(() => {
    if(!loggedIn) return
    onValue(toDoListRef, (snapshot: DataSnapshot) => {
      snapshot.exists() ? setToDos(snapshot.val()) : setToDos([])
    })
  }, [loggedIn]);

  const toDoElements = toDos.map((task: ToDo) => (
    <Task
      key={task.id}
      id={task.id}
      text={task.text}
      checked={task.checked}
      handleChange={handleChecked}
      deleteTask={deleteTask}
    />
  ));

  function createNewToDo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if(newText != ""){
      const newTask: ToDo = { id: uuid(), text: newText, checked: false };
      setToDos(prevToDos => [...prevToDos, newTask])
      setNewText("")
    } else {
      setErrorParagraph(true)
      setTimeout(()=>{
        setErrorParagraph(false)
      }, 2000)
    }
  }

  //function called by following useEffect to write new toDo to database
  function writeNewToDo(toDoList: ToDo[]) {
    if(!loggedIn) return
    const updates: Record<string, any> = {};
    updates['/toDoLists/' + userUID] = toDoList;
    return update(toDoDB, updates);
  }

  useEffect(() => {
    if(!loggedIn) return
    writeNewToDo(toDos)
  }, [toDos])

  function updatNewText(event: React.ChangeEvent<HTMLInputElement>): void {
    setNewText(event.target.value)
  }

  function handleChecked(event: React.ChangeEvent<HTMLInputElement>): void {
    const id = (event.target as HTMLElement).id
    setToDos(prevToDos => prevToDos.map(item => {
      return id === item.id ? {...item, checked: !item.checked} : item
    }))
  }

  function deleteTask(event: React.MouseEvent<HTMLElement>): void {
    const id = (event.target as HTMLElement).id
    setToDos(prevToDos => {
      let newToDos = prevToDos.filter(item => id != item.id)
      return newToDos
    })
  }

  function handleReset(): void {
    setToDos([])
  }

  function handleSignOut(){
    signOut(auth).then(() => {
        setLoggedIn(false)
        setUser("")
        setUserUID("")
        setToDos([])
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
    });
}

  const checkedToDos = toDos.filter(item => item.checked)
  const deleteCheckedButton = checkedToDos.length > 1 ? <button className='deleteCheckedButton' onClick={deleteChecked}>Delete checked</button> : null
  function deleteChecked(){
    setToDos(prevToDos => {
      let newToDos = prevToDos.filter(item => !item.checked)
      return newToDos
    })
  }

// toggle dark mode
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [darkModeIcon, setDarkModeIcon] = useState<string>('fa-solid fa-moon blue')
  function toggleDarkMode(){
    setDarkMode(prevDarkMode => !prevDarkMode)
    darkMode ? setDarkModeIcon('fa-solid fa-moon blue') : setDarkModeIcon('fa-solid fa-sun orange')
  }



  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <meta name="theme-color" content={`${darkMode ? '#30cfd0' : '#f6d365'}`}/>
      <button className='darkModeButton' onClick={toggleDarkMode}><i className={darkModeIcon}></i></button>
      {loggedIn ? <button className='logout-button' onClick={handleSignOut}><i className="fa-solid fa-power-off"></i></button> : null}
      {loggedIn
        ? null
        : <AuthModal
          loggedIn={loggedIn}
          user={userName}
          setLoggedIn={setLoggedIn}
          setUser={setUser}
          userUID={userUID}
          setUserUID={setUserUID}
        />}
      <div className="titleContainer">
        <h1 className='title'>{userName && `${userName}'s`}</h1>
        <h1 className='title'>ToDo List</h1>
      </div>
      {errorParagraph &&
        <p className='errorParagraph'>Please enter new ToDo</p>
      }
      <div className='newtask'>
        <form className='newTaskForm' onSubmit={createNewToDo}>
          <input className='newtaskinput' type="text" name="newtask" value={newText} onChange={updatNewText} placeholder="Type new ToDo here" autoComplete='off' />
          <button className='newtaskbutton' type="submit"><i className='fa-solid fa-circle-plus'></i></button>
        </form>
      </div>
      {toDos.length > 0
        ? toDoElements
        : (<div className='taskList'>
          <input className='check' type="checkbox"></input>
          <span className='task-text'>Your ToDos will appear here</span>
        </div>)
      }
      {deleteCheckedButton}
      <br />
    </div>
  )
}

export default App
