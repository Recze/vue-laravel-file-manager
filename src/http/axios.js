import axios from 'axios';

// set new axios instance
export default axios.create({
    baseURL: import.meta.env.VITE_APP_LFM_AXIOS_BASE_URL
});
