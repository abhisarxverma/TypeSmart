import { PiDotsThreeVerticalBold } from "react-icons/pi";
import type { Text } from "@/Types/Library";
import { countWords, timeAgo } from "@/utils/text";
import { FaHashtag } from "react-icons/fa";
import { memo } from "react";

function TextCard({ text } : { text : Text }) {
    return (
        <div className="relative min-h-[145px] p-5 rounded-lg border-1 border-border bg-card flex flex-col justify-between transition-all duration-300 hover:bg-secondary">
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{text.title}</p>
                    <PiDotsThreeVerticalBold />
                </div>
                <div className="flex items-center text-muted-foreground text-[.8rem] gap-1">
                    <FaHashtag />
                    <span className="">{text.tag}</span>
                </div>
            </div>
            <div className="text-muted-foreground pt-2 text-[.7rem] border-t-2 border-secondary flex items-center justify-between">
                <p className="text-[.8rem]">{countWords(text.text)} Words</p>
                <p className="">{timeAgo(text.uploaded_at)}</p>
            </div>
        </div>
    )
}

export default memo(TextCard, (prevProps, nextProps) => {
  return (
    prevProps.text.title === nextProps.text.title &&
    prevProps.text.text === nextProps.text.text &&
    prevProps.text.uploaded_at === nextProps.text.uploaded_at
  );
});
