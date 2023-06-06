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