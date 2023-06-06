import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import "./Home.css";



function Home() {

    const currentDate = new Date();
    const formattedDate = format(currentDate, "EEEE d MMMM", { locale: it });

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
    
        return () => {
          clearInterval(timer);
        };
      }, []);

      const formattedTime = currentTime.toLocaleTimeString();


    return (
        <div className="home-container">


            <div className="introduction-div">
                <h1 className="welcome-message">Benevnuto su Chron!</h1>
            
                <div className="data-e-ora">
                    <p className="data">
                        {formattedDate}
                    </p>
                    <p className="ora">
                        {formattedTime}
                    </p>
                </div>

            </div>

        </div>
    )
}

export default Home;