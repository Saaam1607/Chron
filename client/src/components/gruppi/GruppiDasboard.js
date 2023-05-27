import Gruppo from './Gruppo';
import './Gruppi.css';

export default function GruppiDashboard(){

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