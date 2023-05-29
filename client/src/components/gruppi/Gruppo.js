

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
                <h4 className="nomeGruppo">{groupName}</h4>
            </div> 

            <h6 className="codice">Codice<br/>{groupID}</h6>

            <div className="gruppo-componenti">
                <h6>Leader: {leader}</h6>
            </div>
        </div> 

    );
}