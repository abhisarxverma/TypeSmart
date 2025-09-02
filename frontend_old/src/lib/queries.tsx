import api from "./axios";

export const getRealUser = async () => {
    const res = await api.get("/auth/getuser");
    const data = res.data;
    console.log("Getting user fetch result : ", data)
    if (data.error) {
        console.log("Error in getting real user : ", data.error);
        return null;
    }
    return data;
}

