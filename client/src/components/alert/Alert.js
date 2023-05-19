import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export function handleAlert() {
        MySwal.fire({
            icon: 'success',
            confirmButtonText: 'Cool',
            didOpen: () => {
                var audio = new Audio("Notification.mp3"); 
                audio.play();
            }
        })
    }
