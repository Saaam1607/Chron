import { useState, useEffect } from 'react';

export default function SessionForm(){

    // const fetchData = async () =>{
    //     const requestBody = {
    //       time: time,
    //       fase: fase,
    //       stato: timerState
    //     };
      
    //     await fetch('api/v1/timer/end', {
    //       method: 'PUT',
    //       body: JSON.stringify(requestBody),
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     });
    //   };

    const today = new Date();

    const [date, setDate] = useState(new Date(today).toISOString().split('T')[0]); // yyyy-mm-dd
    const [time, setTime] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission with date and time data
        console.log('Submitted:', { date, time });
        // You can perform any necessary operations with the date and time data here
    };

    return (
            <form className='timer-form' onSubmit={handleSubmit}>
                <div className='form-div'>

                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        min="00:10"
                        max="10:00"
                        required
                    />

                </div>

                <div className='form-button'>
                    <button type="submit">Submit</button>
                </div>

            </form>
    );
}