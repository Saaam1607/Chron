

export default function Gruppo({ groupName, groupID, leader, isLeader}){

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

            <h3 className="codice">Codice<br/>{groupID}</h3>

            <div className="gruppo-componenti">
                <h5>Leader: {leader}</h5>
            </div>
        </div> 

    );
}