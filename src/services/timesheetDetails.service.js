import http from "../http-common";
import authHeader from "./auth-header";

const getAll = () => {
    return http.get(`/time-sheet-details`, { headers: authHeader() });
};

const get = id => {
    return http.get(`/time-sheet-details/${id}`, { headers: authHeader() });
};

const create = data => {
    return http.post("/time-sheet-details", data, { headers: authHeader() });
};

const update = (data) => {
    return http.put(`/time-sheet-details/`, data, { headers: authHeader() });
};

const remove = id => {
    return http.delete(`/time-sheet-details/${id}`, { headers: authHeader() });
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
};