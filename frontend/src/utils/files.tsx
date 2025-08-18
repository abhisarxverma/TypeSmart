import type { Library } from "@/Types/Library";

export function getSubjects(library : Library) {

    const subjects = new Set<string>();

    if (library?.files) {
        for (const file of library.files) {
            subjects.add(file.subject);
        }
    }

    if (library?.folders) {
        for (const folder of library.folders) {
            if (!folder.files) continue;
            for (const file of folder.files) {
                subjects.add(file.subject);
            }
        }
    }

    return Array.from(subjects)
}