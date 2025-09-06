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
import { useState } from "react"
import { useSearch } from "@/Hooks/useSearch"
import { PiEmpty } from "react-icons/pi"

export default function AddTextDialog({
  group,
  children
}: {
  group: Group
  children: React.ReactNode
}) {
  const { library, isFetchingLibrary } = useLibrary()
  const [searchQuery, setSearchQuery] = useState<string>("");

  const existingIds = new Set(group.group_texts.map(t => t.id));

  const canAddTexts = library.texts.filter(txt => !existingIds.has(txt.id));

  const queriedCanAddTexts = useSearch(canAddTexts, searchQuery, ["title", "tag"]);

  if (isFetchingLibrary) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-xl p-6 space-y-4 flex flex-col gap-1">
        <DialogHeader className="border-b-2 border-border pb-5">
          <DialogTitle>Add text in group</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {group.name}
          </DialogDescription>
        </DialogHeader>

        <SearchBar querySetterFn={setSearchQuery} placeHolder="Search texts...." />

        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-2">
            {queriedCanAddTexts.length > 0 ? (
              queriedCanAddTexts.map((txt) => (
                <AddTextCard key={txt.id} text={txt as unknown as TextInGroup} groupId={group.id} />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 py-10">
                <PiEmpty className="text-3xl text-muted-foreground" />
                <p className="text-sm text-muted-foreground px-2">
                  No texts found.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
