import http from "../http-common";
import authHeader from "./auth-header";

const getAll = () => {
    return http.get(`/privileges`, { headers: authHeader() });
};

const get = id => {
    return http.get(`/privileges/${id}`, { headers: authHeader() });
};

const create = data => {
    return http.post("/privileges", data, { headers: authHeader() });
};

const update = (data) => {
    return http.put(`/privileges/`, data, { headers: authHeader() });
};

const remove = id => {
    return http.delete(`/privileges/${id}`, { headers: authHeader() });
};

export default {
    getAll,
    get,
    create,
    update,
    remove
};