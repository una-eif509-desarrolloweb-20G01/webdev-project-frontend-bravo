import http from "../http-common";
import authHeader from "./auth-header";

const signup = data => {
    console.log(data);
    return http.post("/users/sign-up", data);
};

const getAll = () => {
    return http.get(`/users`, { headers: authHeader() });
};

const get = id => {
    return http.get(`/users/${id}`, { headers: authHeader() });
};

const create = data => {
    return http.post("/users", data, { headers: authHeader() });
};

const update = (data) => {
    return http.put(`/users/`, data, { headers: authHeader() });
};

const remove = id => {
    return http.delete(`/users/${id}`, { headers: authHeader() });
};

export default {
    signup,
    getAll,
    get,
    create,
    update,
    remove
};