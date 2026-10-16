import './Modal.css'

const Modal = ({ onClose }) => {
  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-window' onClick={(event) => {event.stopPropagation()}}>
        <button
        className='modal-close'
        onClick={onClose}>
          &times;
        </button>
        <p>This is my first modal window.</p>
      </div>
    </div>
  )
}

export default Modal;