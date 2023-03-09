import { useState, useEffect } from 'react'
import uuid from 'react-uuid';
import Task from './Components/Task'
import './App.css'


function App() {
  const [toDos, setToDos] = useState( () => 
    JSON.parse(localStorage.getItem("toDos")) || []
    )
  const [newText, setNewText] = useState("")

  const toDoElements = toDos.map(task => <Task 
  key={task.id}
  id={task.id}
  text={task.text}
  checked={task.checked}
  handleChange={handleChecked}
  deleteTask={deleteTask}
  />)

  function createNewToDo() {
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

  useEffect(() => {
    localStorage.setItem("toDos", JSON.stringify(toDos))
    console.log(toDos)
  }, [toDos])

  function handleReset() {
    localStorage.clear()
    window.location.reload(false);
  }



  return (
    <div className="app">
      <h1 className='title'>ToDo List</h1>
      <div className='newtask'>
        <input className='newtaskinput' type="text" name="newtask" value={newText} onChange={updatNewText} placeholder="Type new ToDo here"/>
        <i className='newtaskbutton fa-solid fa-circle-plus' onClick={createNewToDo}></i>
      </div>
      {toDos.length > 0 
        ? toDoElements 
        : (<div className='taskList'>
            <input className='check' type="checkbox"></input>
            <span>Your ToDos will appear here</span>
          </div>)
      }
      <br />
      <i className="reset-button fa-solid fa-recycle" onClick={handleReset}>: Clear list</i>
    </div>
  )
}

export default App
