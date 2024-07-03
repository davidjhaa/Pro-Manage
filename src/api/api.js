import axios from "axios";
const backendUrl = `${import.meta.env.VITE_Backend_URL}/user`;

export const registerAdmin = async ({ email, password, name }) => {
    try {
        const reqUrl = `${backendUrl}/signUp`;
        const response = await axios.post(reqUrl, {
            name,
            password,
            email,
        });
        return response;
    } 
    catch (error) {
        return error;
    }
};

export const loginAdmin = async ({ email, password }) => {
    try {
        const reqUrl = `${backendUrl}/login`;
        const response = await axios.post(reqUrl, {
            password,
            email,
        });
        if (response.status === 200 && response.data?.token) {
            const { token, name, userId, email } = response.data;
            localStorage.setItem("token",token);
            localStorage.setItem("name", JSON.stringify(name));
            localStorage.setItem("userId", JSON.stringify(userId));
            localStorage.setItem("email", JSON.stringify(email));
        }
        return response;
    } 
    catch (error) {
        console.log("error");
    }
};
