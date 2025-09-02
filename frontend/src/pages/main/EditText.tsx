import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileReference from "@/components/uploaders/FileReference";
import { useEditTextMutation } from "@/Hooks/useBackend";
import { useLibrary } from "@/Hooks/useLibrary";
import { Loader2 } from "lucide-react";
import LoaderPage from "../utils/LoaderPage";
import NotFound from "../utils/NotFound";
import TextForm from "@/components/layouts/TextForm";

export default function EditText() {
  const { id: textId } = useParams();
  const { library, isFetchingLibrary } = useLibrary();
  
  const libraryText = library?.texts?.find((txt) => txt.id === textId);
  
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [text, setText] = useState("");

  const { editText, isEditingText } = useEditTextMutation({ text, title, tag, textId : textId ?? "" });

  useEffect(() => {
    if (libraryText) {
      setTitle(libraryText.title);
      setTag(libraryText.tag);
      setText(libraryText.text);
    }
  }, [libraryText]);

  if (isFetchingLibrary) return <LoaderPage />;
  if (!libraryText || !textId) return <NotFound text="Text not found" />;

  const isFormInvalid = !title || !tag || !text;

  return (
    <>
      <h1 className="text-heading">Edit Text</h1>
      <p className="text-subheading mt-1">Edit text freely by opening any file on the side</p>

      <div className="flex flex-col md:flex-row justify-between mt-10 min-h-[400px] gap-10">
        
        <TextForm 
            text={text}
            title={title}
            tag={tag}
            setText={setText}
            setTitle={setTitle}
            setTag={setTag}
            addClass="flex-3"
        />

        <div className="flex-2 flex flex-col gap-2">
          <span className="text-sm">File Reference</span>
          <FileReference addClass="flex-1" text={text} textSettingFn={setText} />
        </div>
      </div>

      <Button
        onClick={() => editText()}
        disabled={isFormInvalid || isEditingText}
        className="md:w-80 w-full mt-10"
      >
        {isEditingText ? <Loader2 className="animate-spin" /> : "Update Text"}
      </Button>
    </>
  );
}
