import type { File } from "@/Types/Library";

export function getSubjects(files : File[]) {

    if (!files) return [];

    const subjects = new Set<string>();

    if (files) {
        for (const file of files) {
            subjects.add(file.subject);
        }
    }

    return Array.from(subjects)
}