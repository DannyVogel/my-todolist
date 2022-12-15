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
    const newTask = { id: uuid(), text: newText, checked: false };
    setToDos(prevToDos => [...prevToDos, newTask])
    setNewText("")
  }

  function updatNewText(event) {
    setNewText(event.target.value)
  }

  function handleChecked(event){
    const id = event.target.id
    setToDos(prevToDos => {
      let newToDos = prevToDos.map(item => {
        if(id === item.id){
          return {...item, checked: !item.checked}
        } 
        return item
      })
      return newToDos
    })
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
        <button className='newtaskbutton' onClick={createNewToDo}>+</button>
      </div>
      {toDos.length > 0 
        ? toDoElements 
        : (<div>
            <input type="checkbox"></input>
            <span>Your ToDos will appear here</span>
          </div>)
      }
      <br />
      <button className="reset-button" onClick={handleReset}>Reset</button>
    </div>
  )
}

export default App
