import http from "../http-common";
import authHeader from "./auth-header";

const getAll = () => {
    return http.get(`/time-sheets`, { headers: authHeader() });
};

const get = id => {
    return http.get(`/time-sheets/${id}`, { headers: authHeader() });
};

const create = data => {
    return http.post("/time-sheets", data, { headers: authHeader() });
};

const update = (id, data) => {
    return http.put(`/time-sheets/${id}`, data, { headers: authHeader() });
};

const remove = id => {
    return http.delete(`/time-sheets/${id}`, { headers: authHeader() });
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
};