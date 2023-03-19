//Pending tasks:
// - fix reset db on reload
// - add favicon
// - edit no ToDo entered alert

import { useState, useEffect } from 'react'
import uuid from 'react-uuid';
import Task from './Components/Task'
import './App.css'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://todolist-396ab-default-rtdb.europe-west1.firebasedatabase.app/"
}

const userID = 1234
const app = initializeApp(appSettings)
const database = getDatabase(app)
const toDoDB = ref(database, "toDoApp")
const toDoListRef = ref(database, '/toDoApp/toDoLists/' + userID)

function App() {
  const [toDos, setToDos] = useState([])
  const [newText, setNewText] = useState("")
  
  //Read tasks from database
  useEffect(() => {
    onValue(toDoListRef, (snapshot) => {
      setToDos(snapshot.val() || []);
    });
  }, []);

  const toDoElements = toDos.map(task => (
    <Task
      key={task.id}
      id={task.id}
      text={task.text}
      checked={task.checked}
      handleChange={handleChecked}
      deleteTask={deleteTask}
    />
  ));

  function createNewToDo(event) {
    event.preventDefault()
    if(newText != ""){
      const newTask = { id: uuid(), text: newText, checked: false };
      setToDos(prevToDos => [...prevToDos, newTask])
      setNewText("")
    } else {
      alert("Please enter new ToDo")
    }
  }

  function updatNewText(event) {
    setNewText(event.target.value)
  }

  function handleChecked(event){
    const id = event.target.id
    setToDos(prevToDos => prevToDos.map(item => {
      return id === item.id ? {...item, checked: !item.checked} : item
    }))
  }

  function deleteTask(event) {
    const id = event.target.id
    setToDos(prevToDos => {
      let newToDos = prevToDos.filter(item => id != item.id)
      return newToDos
    })
  }

  //function called by following useEffect to write new toDo to database
  function writeNewToDo(toDoList) {
    const updates = {};
    updates['/toDoLists/' + userID] = toDoList;
  
    return update(toDoDB, updates);
  }

  useEffect(() => {
    writeNewToDo(toDos)
  }, [toDos])

  function handleReset() {
    window.location.reload(false);
  }

  return (
    <div className="app">
      <h1 className='title'>ToDo List</h1>
      <div className='newtask'>
        <form className='newTaskForm' onSubmit={createNewToDo}>
          <input className='newtaskinput' type="text" name="newtask" value={newText} onChange={updatNewText} placeholder="Type new ToDo here" autoComplete='off'/>
          <i className='newtaskbutton fa-solid fa-circle-plus' onClick={createNewToDo}></i>
        </form>
      </div>
      {toDos.length > 0 
        ? toDoElements 
        : (<div className='taskList'>
            <input className='check' type="checkbox"></input>
            <span className='task-text'>Your ToDos will appear here</span>
          </div>)
      }
      <br />
      <i className="reset-button fa-solid fa-recycle" onClick={handleReset}>: Clear list</i>
    </div>
  )
}

export default App
