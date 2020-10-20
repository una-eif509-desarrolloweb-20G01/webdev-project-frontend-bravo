import http from "../http-common";

const signup = data => {
    return http.post('/users/sign-up', data);
};

const login = data => {
    return http
        .post('/login', data)
        .then((response) => {
            response.headers.authorization = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNDA5MTU1NX0.R-MGtrZfONs8lgFKoxh2jdE0aVQnizrEO0-iBXXhZY-7EJYZ0mgV3csZtJIBhic6GmMrtoBr08GGTM04olva8Q";
            console.log(response);
            console.log(response.headers.authorization);
            if (response.headers.authorization) {
                localStorage.setItem("user.headers", JSON.stringify(response.headers));
                localStorage.setItem("user.data", JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user.headers");
    localStorage.removeItem("user.data");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

export default {
    signup,
    login,
    logout,
    getCurrentUser
};