export default function GruppiDashboard({ groupName, groupID, leader, members, isLeader}){

    return (
        <div className="gruppo-div">

            <div className="gruppo-title">
                {isLeader ?
                    <span className="icona-gruppo">
                        <i
                            className="bi bi-star-fill"
                            title="LEADER"
                        ></i>
                    </span>
                    :
                    <span className="icona-gruppo">
                        <i
                            className="bi bi-person"
                            title="LEADER"
                        ></i>
                    </span>
                }
                <h1>{groupName}</h1>
            </div> 

            <h3 className="codice">Codice: {groupID}</h3>

            <div className="gruppo-componenti">
                <h5>Leader: {leader}</h5>
                <ul>
                    {members.map((item, index) => (
                    <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </div> 

    );
}