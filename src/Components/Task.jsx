import React from 'react'

export default function Task(props) {
  
  const styles = {
    textDecoration: props.checked ? "line-through" : null
  }
  
  const deleteButton = (<button className='delete-button material-icons' onClick={props.deleteTask} id={props.id}>close</button>)

  return (
    <div>
        <input 
          type="checkbox" 
          id={props.id} 
          checked={props.checked} 
          onChange={props.handleChange}
        />
        <span style={styles}>{props.text}</span>
        {props.checked ? deleteButton : null}
    </div>
  )
}
