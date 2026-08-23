class ApiClient {
    // static BASE_URL = "http://127.0.0.1:8080";
    static BASE_URL = "";  // Uses proxy setted in package.json
    static COMMON_HEADERS = {"Content-Type": "application/json"};

    static async get(endpoint, headers={}) {
        const request = await fetch(`${this.BASE_URL}${endpoint}`, 
            {method: "GET", headers: {...this.COMMON_HEADERS, ...headers}}
        );
        return await request.json();
    }

    static async post(endpoint, data={}, headers={}) {
        const request = await fetch(`${this.BASE_URL}${endpoint}`, 
            {method: "POST", body: JSON.stringify(data), headers: {...this.COMMON_HEADERS, ...headers}}
        );
        return await request.json();
    }

    static async put(endpoint, data={}, headers={}) {
        const request = await fetch(`${this.BASE_URL}${endpoint}`, 
            {method: "PUT", body: JSON.stringify(data), headers: {...this.COMMON_HEADERS, ...headers}}
        );
        return await request.json();
    }

    static async delete(endpoint, headers={}) {
        const request = await fetch(`${this.BASE_URL}${endpoint}`, 
            {method: "DELETE", headers: {...this.COMMON_HEADERS, ...headers}}
        );
        return await request.json();
    }
}

module.exports = ApiClient