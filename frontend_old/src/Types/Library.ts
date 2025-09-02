export interface Library {
    files: File[] | null
    folders: Folder[] | null
}

export interface File {
    id: string
    user_id: string,
    folder_id: string
    times_typed: number,
    text: string,
    title: string
    subject: string
    uploaded_at: string
}

export interface Folder {
    id: string
    name: string
    user_id: string
    files: File[] | null
}