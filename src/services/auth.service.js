import http from "../http-common";

const signup = data => {
    return http.post('/users/sign-up', data);
};

const login = data => {

    return http
    .post('/login', data)
    .then((res) => {

        console.log(res);

        if (res.headers.authorization) {

            localStorage.setItem("user.headers",  JSON.stringify({ headers: res.headers }));
        }
    });
};

const logout = () => {
    localStorage.removeItem("user.headers");
    localStorage.removeItem("user.data");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user.headers"));
};

const getCurrentUserData = () => {
    return JSON.parse(localStorage.getItem("user.data"));
};

export default {
    signup,
    login,
    logout,
    getCurrentUser,
    getCurrentUserData
};