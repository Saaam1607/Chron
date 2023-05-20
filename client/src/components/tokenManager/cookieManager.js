class CookieManager{

    static setAuthToken(token){
        localStorage.setItem('token', token);
    }

    static deleteAuthToken(token){
        localStorage.removeItem('token');
    }

    static getAuthToken(){
        const token = localStorage.getItem("token")
        if (token) {
            return token;
        } else{
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