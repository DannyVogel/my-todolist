
export default function Loader(props: { darkMode: boolean, isUnmounting: boolean }) {
  return (
    <div className={`${props.darkMode && 'dark'} ${props.isUnmounting && ''} loader`}>
        <div className="loader-wrapper">
          <h1 className='title'>ToDo List</h1>
          <img className='loader-image' src="public/notebook-small.png" alt="notebook icon enlarged image" width={250} />
          <h2 className='loader-text'>Loading...</h2>
        </div>
    </div>
  )
}
