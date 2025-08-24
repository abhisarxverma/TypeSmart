import clsx from "clsx";
import styles from "./TextsList.module.css";
import type { Text } from "@/lib/Types/Library";
import TextCard from "../TextCard/TextCard";

interface TextsListProps {
  groupId: string | null;
  type: "add_in_group" | "present_in_group" | "library_all_texts";
  texts: Text[];
}

export default function TextsList({ groupId=null, type, texts }: TextsListProps) {

  return (
    <div className={clsx(styles.container)}>
      {texts.map(text => (
        <TextCard
          key={text.id}
          text={text}
          groupId={groupId}
          type={type}
        />
      ))}
    </div>
  );
}
