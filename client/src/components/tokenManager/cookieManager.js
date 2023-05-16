class CookieManager{

    static setAuthToken(token){
        localStorage.setItem('token', token);
    }

    static getAuthToken(){
        const token = localStorage.getItem("token")
        if (token) {
            // console.log("Ho trovato qualcuno!")
            return token;
        } else{
            // console.log("Non trovo nessuno")
            return false;
        }
    }

    static generateHeader(){
        const headers = {};
        const token = this.getAuthToken()
        
        // setting the header, if the token exists
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
            return headers;
        } else{
            return undefined;
        }
    }
}

module.exports = CookieManager;