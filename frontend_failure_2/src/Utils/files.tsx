import type { Text } from "@/lib/Types/Library";

export function getSubjects(texts : Text[]) {

    if (!texts) return [];

    const subjects = new Set<string>();

    if (texts) {
        for (const file of texts) {
            subjects.add(file.subject);
        }
    }
    return Array.from(subjects)
}

export function getImportances() {
    return ["low", "medium", "high"];
}
