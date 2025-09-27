
import type { Text } from "@/lib/Types/Library";
import TextCard from "../TextCard/TextCard";

interface TextsListProps {
  groupId: string | null;
  texts: Text[];
}

export default function TextsList({ groupId=null, texts }: TextsListProps) {

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
      {texts.map(text => (
        <TextCard
          key={text.id}
          text={text}
          groupId={groupId}
        />
      ))}
    </div>
  );
}
