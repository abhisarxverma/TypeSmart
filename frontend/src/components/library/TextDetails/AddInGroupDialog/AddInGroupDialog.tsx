import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import AddInGroupCard from "./AddInGroupCard"
import SearchBar from "@/components/library/SearchBar"
import { useLibrary } from "@/Hooks/useLibrary"
import type { Group, Text } from "@/Types/Library"
import LoaderPage from "@/pages/utils/LoaderPage"
import { useState } from "react"
import { useSearch } from "@/Hooks/useSearch"
import { PiEmpty } from "react-icons/pi"

export default function AddInGroupDialog({
  text,
  presentInGroups,
  children
}: {
  text: Text
  presentInGroups: Group[]
  children: React.ReactNode
}) {
  const { library, isFetchingLibrary } = useLibrary()
  const [ searchQuery, setSearchQuery ] = useState<string>("");

  const presentInGroupsIds = new Set(presentInGroups.map(grp => grp.id));
  const canAddInGroups = library.groups.filter(grp => !presentInGroupsIds.has(grp.id));

  const queriedCanAddGroups = useSearch(canAddInGroups, searchQuery, ["name", "tag"]);
  
  if (isFetchingLibrary) return <LoaderPage />

  return (
    <Dialog>
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent className="max-w-xl p-6 space-y-4 flex flex-col gap-1">
        <DialogHeader className="border-b-2 border-border pb-5">
          <DialogTitle>Add text in group</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {text.title}
          </DialogDescription>
        </DialogHeader>

        <SearchBar querySetterFn={setSearchQuery} placeHolder="Search groups to add...." />

        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-2">
            {queriedCanAddGroups.length > 0 ? (
              queriedCanAddGroups.map((grp) => (
                <AddInGroupCard key={grp.id} group={grp as unknown as Group} textId={text.id} />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 py-10">
                <PiEmpty className="text-3xl text-muted-foreground" />
                <p className="text-sm text-muted-foreground px-2">
                  No groups found.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
