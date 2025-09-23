
export function giveLibraryRoute(mode: "main" | "demo") {
    if (mode === "main") return "/app/library";
    return "/demo/library";
}

export function giveAddTextRoute() {
    return "/app/library/add-text";
}

export function giveEditTextRoute(textId: string, mode: "main" | "demo") {
    if (mode === "main") return "/app/library/edit-text/"+textId;
    return "/demo/library/edit-text/"+textId;
}

export function giveTextDetailsRoute(textId: string, mode: string) {
    if (mode === "main") return "/app/library/text/"+textId
    return "/demo/library/text/"+textId;
}

export function giveAuthRoute() {
    return "/login-signup";
}

export function giveGroupDetailsRoute( groupId: string, mode: string ) {
    if (mode === "main") return "/app/library/group/"+groupId
    return "/demo/library/group/"+groupId
}

export function giveTypingPageRoute(mode: string) {
    if (mode === "demo") return "/demo/typing"
    return "/app/typing";
}