// Backend API Interface Methods
import { BACKEND_PORT } from './config.json';

const BASE = `http://localhost:${BACKEND_PORT}`

console.log(BASE);

const apiMethods = {
    login: async () => {
        return await fetch(`${BASE}/`)
    },

}

export default apiMethods;