import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './Alert.css';

const MySwal = withReactContent(Swal)

export function handleAlert (message, sound) {
    MySwal.fire({
        icon: 'success',
        confirmButtonText: message,
        customClass: {
            confirmButton: 'custom-confirm-button'
        },
        didOpen: () => {
            if (sound){
                var audio = new Audio("Notification.mp3"); 
                audio.play();
            }
        }
    })
}

 
