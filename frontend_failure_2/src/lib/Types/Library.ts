
export interface Text {
    id: string
    title: string
    text: string
    user_id: string
    times_typed: number
    uploaded_at: string
    importance: string
    subject: string
}

export interface Group {
    id: string
    name: string
    subject: string
    created_at: string
    importance: string
    user_id: string
    group_texts: Text[] | null
}

export interface Library {
    groups: Group[] | null
    texts: Text[] | null
}