import { type Status } from "@/Hooks/useTyping";

export function initializeStatuses(text: string) : Status[] {
    const statuses: Status[] = Array(text.length).fill("pending");
    statuses[0] = "current"
    return statuses;
}