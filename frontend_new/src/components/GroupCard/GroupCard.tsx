import type { Group } from "@/lib/Types/Library";
import styles from "./GroupCard.module.css";
import clsx from "clsx";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

export default function GroupCard({ group }: {group: Group}) {
    return (
        <div className={clsx(styles.card, "shadow bg-background")}>
            <div className={styles.textGroup}>
                <p className={styles.name}>{group.name}</p>
                {group.subject && <Badge variant="secondary" className="rounded">{group.subject}</Badge>}
            </div>
            <div className={clsx(styles.buttons)}>
                <Button>Start Typing</Button>
                <Button variant="outline" asChild>
                    <Link to={`/library/group/${group.id}`}>Details</Link>
                </Button>
            </div>
        </div>
    )
}