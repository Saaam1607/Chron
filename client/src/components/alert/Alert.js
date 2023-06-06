import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './Alert.css';

const MySwal = withReactContent(Swal)

export function handleAlert (message, sound, icon) {
    MySwal.fire({
        icon: icon,
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

export function handleConfirmation(title, confirmButtonText, cancelButtonText, onConfirm) {
    MySwal.fire({
      title: title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        if (onConfirm) {
          onConfirm();
        }
      }
    });
  }

 
