import http from "../http-common";
import authHeader from "./auth-header";

const getAll = () => {
    return http.get(`/departments`, { headers: authHeader() });
};

const get = id => {
    return http.get(`/departments/${id}`, { headers: authHeader() });
};

const create = data => {
    return http.post("/departments", data, { headers: authHeader() });
};

const update = (id, data) => {
    return http.put(`/departments/${id}`, data, { headers: authHeader() });
};

const remove = id => {
    return http.delete(`/departments/${id}`, { headers: authHeader() });
};

export default {
    getAll,
    get,
    create,
    update,
    remove
};