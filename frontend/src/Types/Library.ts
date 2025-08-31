export interface Library {
    texts: Text[]
    groups: Group[]
}

export interface Text {
    id: string
    user_id: string,
    times_typed: number,
    text: string,
    title: string
    tag: string
    uploaded_at: string
}

export interface Group {
    id: string
    name: string
    user_id: string
    tag: string
    group_texts: Text[]
    created_at: string
}