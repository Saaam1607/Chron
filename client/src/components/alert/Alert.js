import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)



export function handleAlert (message, sound, icon, timer) {

    const configurazioneAlert = {
        icon: icon,
        text: message,
        confirmButtonText: 'OK',
        didOpen: () => {
            if (sound) {
                var audio = new Audio('Notification.mp3');
                audio.play();
            }
        }
    };
    
    if (timer) {
            configurazioneAlert.timer = timer;
            configurazioneAlert.timerProgressBar = true;
            configurazioneAlert.showConfirmButton = false;
    }

    MySwal.fire(configurazioneAlert);
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

 
