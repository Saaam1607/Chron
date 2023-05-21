import CookieManager from'../tokenManager/cookieManager';

export default function Profilo({setAuthenticated}){

    return (
      <div>
        {/* <h1>Profilo</h1>
            <div>
                <h2> username: </h2>
                <p>bla bla bla</p>
            </div>
            <div>
                <h2>email: </h2>
                <p>bla bla bla</p>
            </div>
            <div>
                <button>Logout</button>
            </div> */}
            <button
                onClick={() => {
                    CookieManager.deleteAuthToken();
                    setAuthenticated(false);
                    }}
            >
                Logout
            </button>
            
      </div>
    );
}