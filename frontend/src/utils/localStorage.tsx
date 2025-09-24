import type { Group, Text } from "@/Types/Library"

const LOCAL_STORAGE_KEY = "typesmart_last_typed"

interface localStorageData {
    type: "text" | "group",
    id: string
}

export function saveAsLastTyped(type: "text" | "group", obj: Text | Group) {
    if (type !== "text" && type !== "group") return;
    const data : localStorageData = {
        type: type,
        id: obj.id
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

export function getLastTyped() {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!rawData) return null;
    const parsed = JSON.parse(rawData);
    return parsed;
}