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

export const addTextInGroup = async(groupId: string | null, textId: string) => {
    const res = await api.post("/user/add_in_group", {
        group_id: groupId,
        text_id : textId
    });
    const data = res.data;
    console.log("Add in group mutation result : ", data);
    if (data.error) throw Error(data.error);
    return data;
}

export const addText = async ( title: string, text: string, tag: string ) => {
    const res = await api.post("/user/add_text", {
        title,
        text,
        tag
    });
    const data = res.data;
    console.log("Add text fetch result : ", data);
    if (data.error) throw new Error(data.error);
    return data;
}