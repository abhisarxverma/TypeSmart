import type { Group, Text } from "@/Types/Library";

export function getSubjects(files : Text[]) {

    if (!files) return [];

    const subjects = new Set<string>();

    if (files) {
        for (const file of files) {
            subjects.add(file.tag);
        }
    }

    return Array.from(subjects)
}

export function getPresentInGroups( textId: string, groups: Group[] ) {

    const res = new Set<Group>();

    for (const group of groups) {
        let isPresent = false;
        for (const text of group.group_texts) {
            if (text.id === textId) isPresent = true;
        }
        if (isPresent) res.add(group);
    }

    console.log("res : ", res);

    return Array.from(res);

}