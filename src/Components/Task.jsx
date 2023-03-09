import React from 'react'

export default function Task(props) {
  
  const styles = {
    textDecoration: props.checked ? "line-through" : null
  }
  
  const deleteButton = (<i className='delete-button fa-solid fa-trash-can' onClick={props.deleteTask} id={props.id}></i>)

  return (
    <div className='taskList'>
        <input 
          className='check'
          type="checkbox" 
          id={props.id} 
          checked={props.checked} 
          onChange={props.handleChange}
        />
        <span className='task-text' style={styles}>{props.text}</span>
        {props.checked ? deleteButton : null}
    </div>
  )
}
