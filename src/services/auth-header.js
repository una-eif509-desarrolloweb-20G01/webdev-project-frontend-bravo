export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user.headers'));

    if (user && user.headers.authorization) {
        return { Authorization: user.headers.authorization };
    } else {
        return {};
    }
}
