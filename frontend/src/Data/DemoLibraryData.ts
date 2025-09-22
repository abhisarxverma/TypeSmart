import type { Library, Text } from "@/Types/Library";

const randomDate = "2025-09-05 20:21:38.469113+00";

const text1: Text = {
    id: "t1",
    user_id: "demo",
    times_typed: 3,
    title: "Engineering Mathematics – Linear Algebra",
    tag: "Maths",
    text: "Matrix methods are widely used for solving systems of linear equations. Eigenvalues and eigenvectors form the foundation for stability analysis, vibration problems, and principal component analysis.",
    uploaded_at: randomDate,
    importance: null,
}

const text2: Text = {
    id: "t2",
    user_id: "demo",
    times_typed: 2,
    title: "Thermodynamics – Laws of Thermodynamics",
    tag: "Mechanical",
    text: "The first law of thermodynamics states that energy can neither be created nor destroyed. The second law introduces the concept of entropy and explains the direction of heat transfer.",
    uploaded_at: randomDate,
    importance: null,
}

const text3: Text = {
    id: "t3",
    user_id: "demo",
    times_typed: 1,
    title: "Data Structures – Binary Trees",
    tag: "Computer Science",
    text: "A binary tree is a hierarchical structure where each node has at most two children. Traversal methods include inorder, preorder, and postorder, each useful for different applications.",
    uploaded_at: randomDate,
    importance: null,
}

const text4: Text = {
    id: "t4",
    user_id: "demo",
    times_typed: 4,
    title: "Circuit Theory – Kirchhoff’s Laws",
    tag: "Electrical",
    text: "Kirchhoff’s current law states that the algebraic sum of currents at a junction is zero. Kirchhoff’s voltage law states that the algebraic sum of voltages in a closed loop is zero.",
    uploaded_at: randomDate,
    importance: null,
}

const text5: Text = {
    id: "t5",
    user_id: "demo",
    times_typed: 0,
    title: "Fluid Mechanics – Bernoulli’s Equation",
    tag: "Civil",
    text: "Bernoulli’s principle relates pressure, velocity, and height in an ideal fluid flow. It is widely applied in pipe flow analysis, airplane wing design, and hydraulic machines.",
    uploaded_at: randomDate,
    importance: null,
}


export const DEMO_LIBRARY: Library = {
    texts: [text1, text2, text3, text4, text5],

    groups: [
        {
            id: "g1",
            name: "Class Test 1",
            user_id: "demo",
            tag: "Exam Prep",
            created_at: randomDate,
            group_texts: [
                {
                    ...text1,
                    importance: "medium",
                    added_at: randomDate,
                },
                {
                    ...text3,
                    importance: "medium",
                    added_at: randomDate,
                },
                {
                    ...text5,
                    importance: "medium",
                    added_at: randomDate,
                },
            ],
        },
        {
            id: "g2",
            name: "Mechanical + Electrical",
            user_id: "demo",
            tag: "Practice",
            created_at: randomDate,
            group_texts: [
                {
                    ...text2,
                    importance: "high",
                    added_at: randomDate,
                },
                {
                    ...text4,
                    importance: "high",
                    added_at: randomDate,
                },
            ],
        },
        {
            id: "g3",
            name: "Quick Revision – Maths",
            user_id: "demo",
            tag: "Revision",
            created_at: randomDate,
            group_texts: [
                {
                    ...text1,
                    importance: "low",
                    added_at: randomDate,
                },
            ],
        },
    ],
};
