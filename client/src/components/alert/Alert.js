import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function Alert() {

    const handleAlert = () => {
        MySwal.fire({
            title: <p>It's time for a break!</p>,
            icon: 'success',
            confirmButtonText: 'Cool',
            didOpen: () => {
                var audio = new Audio("Notification.mp3"); 
                audio.play();
            }
        })
    }

  return (
    <div>
      <button onClick={func}>Click Me</button>
    </div>
  )
}

export default Alert
