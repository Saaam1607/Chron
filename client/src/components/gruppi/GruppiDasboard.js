import { useState, useEffect } from 'react';

import CookieManager from'../tokenManager/cookieManager';
import Gruppo from './Gruppo';

import './Gruppi.css';



export default function GruppiDashboard(){

    const [gruppiMembro, setGruppiMembro] = useState([]);
    const [gruppiLeader, setGruppiLeader] = useState([]);

    useEffect(() => {

        fetch('api/v1/gruppi/membro', {
            method: "GET",
            headers: CookieManager.generateHeader(),
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 204){
                    return;
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                }
            })
                .then(data => {
                    if (Array.isArray(data.result) && data.length === 0){
                    } else {
                        setGruppiMembro(data.result);
                    }
                })
                .catch(error => {
                    alert(error.message);
                })

        fetch('api/v1/gruppi/leader', {
            method: "GET",
            headers: CookieManager.generateHeader(),
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 204){
                    return;
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                }
            })
                .then(data => {
                    if (Array.isArray(data.result) && data.length === 0){
                    } else {
                        setGruppiLeader(data.result);
                    }
                    
                })
                .catch(error => {
                    alert(error.message);
                })

    }, []);


    return (
        <div className='Gruppi'>
            
            <div className='gruppi-leader'>

                {gruppiLeader.map(item => (
                    <div key={item._id}>
                        <Gruppo groupName={item.name} groupID={item._id} leader={item.leader_id} isLeader={true}/>
                    </div>
                ))}

            </div>


            <div className='gruppi-membro'>

                {gruppiMembro.map(item => (
                    <div key={item._id}>
                        <Gruppo groupName={item.name} groupID={item._id} leader={item.leader_id} members={["CHRIS", "NICOLE"]}/>
                    </div>
                ))}

            </div>


        </div> 

    );
}