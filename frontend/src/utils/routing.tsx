
export function giveLibraryRoute() {
    return "/app/library";
}

export function giveAddTextRoute() {
    return "/app/library/add-text";
}

export function giveEditTextRoute(textId: string) {
    return "/app/library/edit-text/"+textId;
}

export function giveTextDetailsRoute(textId: string) {
    return "/app/library/text/"+textId;
}

export function giveAuthRoute() {
    return "/login-signup";
}