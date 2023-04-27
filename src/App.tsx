import { useState, useEffect } from 'react'
import uuid from 'react-uuid';
import Task from './Components/Task'
import './App.css'
import {database, ref, update, remove, onValue} from '../firebase'
import { DataSnapshot } from 'firebase/database';

const userID = 1234
const toDoDB = ref(database, "toDoApp")
const toDoListRef = ref(database, '/toDoApp/toDoLists/' + userID)

interface ToDo {
  id: string,
  text: string,
  checked: boolean
}

function App(): JSX.Element {
  const [toDos, setToDos] = useState<ToDo[]>(()=>[])
  const [initWrite, setInitWrite] = useState<boolean>(false)
  const [newText, setNewText] = useState<string>("")
  const [errorParagraph, setErrorParagraph] = useState<boolean>(false)
  
  //Read tasks from database and update in realtime
  useEffect(() => {
    onValue(toDoListRef, (snapshot: DataSnapshot) => {
      snapshot.exists() ? setToDos(snapshot.val()) : []
      setInitWrite(true)
    })
  }, []);

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

  //function called by following useEffect to write new toDo to database
  function writeNewToDo(toDoList: ToDo[]) {
    const updates: Record<string, any> = {};
    updates['/toDoLists/' + userID] = toDoList;
    return update(toDoDB, updates);
  }

  useEffect(() => {
    initWrite && writeNewToDo(toDos)
  }, [toDos])

  function handleReset(): void {
    remove(toDoDB);
    setToDos([])
  }

  return (
    <div className="app">
      <h1 className='title'>ToDo List</h1>
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
      <br />
      <i className="reset-button fa-solid fa-recycle" onClick={handleReset}>: Clear list</i>
    </div>
  )
}

export default App
