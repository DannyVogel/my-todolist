
interface Props {
  id: string;
  text: string;
  checked: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deleteTask: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function Task(props: Props) {
  
  const styles: React.CSSProperties = {
    textDecoration: props.checked ? "line-through" : undefined
  }
  
  const deleteButton = (<i className='delete-button fa-solid fa-trash-can' onClick={props.deleteTask} id={props.id} data-testid="delete-button"></i>)

  return (
    <div className='taskList'>
        <input 
          className='check'
          type="checkbox" 
          id={props.id} 
          checked={props.checked} 
          onChange={props.handleChange}
        />
        <label htmlFor={props.id} className='task-text' style={styles} data-testid="taskEl">{props.text}</label>
        {props.checked ? deleteButton : null}
    </div>
  )
}
