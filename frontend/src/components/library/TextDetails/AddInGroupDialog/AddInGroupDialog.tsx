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
import SearchBar from "@/components/SearchBar"
import { useLibrary } from "@/Hooks/useLibrary"
import type { Group, Text } from "@/Types/Library"
import LoaderPage from "@/pages/utils/LoaderPage"

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

  if (isFetchingLibrary) return <LoaderPage />

  const presentInGroupsIds = new Set(presentInGroups.map(grp => grp.id));

  const canAddInGroups = library.groups.filter(grp => !presentInGroupsIds.has(grp.id));

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

        <SearchBar addClass="" placeHolder="Search texts...." />

        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-2">
            {canAddInGroups.length > 0 ? (
              canAddInGroups.map((grp) => (
                <AddInGroupCard key={grp.id} group={grp as unknown as Group} textId={text.id} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground px-2">
                No groups available to add.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
