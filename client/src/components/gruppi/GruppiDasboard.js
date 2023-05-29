import { useState, useEffect } from 'react';

import CookieManager from'../tokenManager/cookieManager';
import Gruppo from './Gruppo';

import './Gruppi.css';



export default function GruppiDashboard(){

    useEffect(() => {


        fetch('api/v1/gruppi/membro', {
            method: "GET",
            headers: CookieManager.generateHeader(),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 500){
                    throw new Error("Errore durante la lettura dei gruppi");
                }
            })
                .then(data => {
                    // fai qualcosa con dati
                    console.log(data);
                })
                .catch(error => {
                    alert(error.message);
                })

    }, []);


    return (
        <div className='Gruppi'>
            
            <div className='gruppi-leader'>
                <Gruppo groupName={"NOME-GRUPPO"} groupID={123456} leader={"SAM"} members={["CHRIS", "NICOLE"]} isLeader={true}/>
                <Gruppo groupName={"NOME-GRUPPO"} groupID={123456} leader={"SAM"} members={["CHRIS", "NICOLE"]} isLeader={true}/>
                <Gruppo groupName={"NOME-GRUPPO"} groupID={123456} leader={"SAM"} members={["CHRIS", "NICOLE"]} isLeader={true}/>
            </div>

            <div className='gruppi-membro'>
                <Gruppo groupName={"NOME-GRUPPO"} groupID={123456} leader={"SAM"} members={["CHRIS", "NICOLE"]}/>
                <Gruppo groupName={"NOME-GRUPPO"} groupID={123456} leader={"SAM"} members={["CHRIS", "NICOLE"]}/>
            </div>


        </div> 

    );
}