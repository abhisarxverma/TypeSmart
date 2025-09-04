import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import AddTextCard from "./AddTextCard"
import SearchBar from "@/components/SearchBar"
import { useLibrary } from "@/Hooks/useLibrary"
import type { Group, TextInGroup } from "@/Types/Library"
import { Button } from "@/components/ui/button"
import { FaPlus } from "react-icons/fa6"

export default function AddTextDialog({
  group
}: {
  group: Group
}) {
  const { library, isFetchingLibrary } = useLibrary()

  if (isFetchingLibrary) return null

  const existingIds = new Set(group.group_texts.map(t => t.id));

  const canAddTexts = library.texts.filter(txt => !existingIds.has(txt.id));


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost"><FaPlus /> Add Text</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl p-6 space-y-4 flex flex-col gap-1">
        <DialogHeader className="border-b-2 border-border pb-5">
          <DialogTitle>Add text in group</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {group.name}
          </DialogDescription>
        </DialogHeader>

        <SearchBar addClass="" placeHolder="Search texts...." />

        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-2">
            {canAddTexts.length > 0 ? (
              canAddTexts.map((txt) => (
                <AddTextCard key={txt.id} text={txt as unknown as TextInGroup} groupId={group.id} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground px-2">
                No texts available to add.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
