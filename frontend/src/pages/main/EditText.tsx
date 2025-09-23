import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FileReference from "@/components/uploaders/FileReference";
import { useEditTextMutation } from "@/Hooks/useBackend";
import { useLibrary } from "@/Hooks/useLibrary";
import { Loader2 } from "lucide-react";
import LoaderPage from "../utils/LoaderPage";
import NotFound from "../utils/NotFound";
import TextForm from "@/components/layouts/TextForm";
import { useMode } from "@/Hooks/useMode";
import { giveTextDetailsRoute } from "@/utils/routing";

export default function EditText() {
  const { id: textId } = useParams();
  const { library, isFetchingLibrary, setLibrary } = useLibrary();
  const { mode } = useMode();
  const navigate = useNavigate();
  
  const libraryText = library?.texts?.find((txt) => txt.id === textId);
  
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [text, setText] = useState("");

  const { editText, isEditingText } = useEditTextMutation({ text, title, tag, textId : textId ?? "" });

  function handleEdit() {
    if (mode === "main") editText();
    else {
      const updatedTexts = library.texts.map(txt => {
        if (txt.id === textId) {
          return {
            ...txt, 
            title,
            tag,
            text
          }
        }
        else return txt
      })
      if (setLibrary) setLibrary({ ...library, texts: updatedTexts })
      navigate(giveTextDetailsRoute(textId ?? "", mode))
    }
  }

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
        onClick={handleEdit}
        disabled={isFormInvalid || isEditingText}
        className="md:w-80 w-full mt-10"
      >
        {isEditingText ? <Loader2 className="animate-spin" /> : "Update Text"}
      </Button>
    </>
  );
}
