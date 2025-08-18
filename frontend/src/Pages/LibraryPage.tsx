import clsx from "clsx";
import styles from "./LibraryPage.module.css";
import FileUploader from "@/components/FileUploader";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader2, SearchIcon } from "lucide-react";
import File from "@/components/File";
import { Button } from "@/components/ui/button";
import { BsFolderPlus } from "react-icons/bs";
import useSubjectSelect from "@/Hooks/useSubjectSelect";
import type { File as FileType, Folder as FolderType } from "@/Types/Library";
import CreateFolderEl from "@/components/CreateFolder";
import { CiFolderOn } from "react-icons/ci";
import { HiOutlineFolderPlus } from "react-icons/hi2";

export default function LibraryPage() {

    const { data: library, isLoading: isFetchingLibrary } = useQuery({
        queryKey: ["library"],
        queryFn: async () => {
            try {
                const res = await api.get("/user/library");
                const data = res.data;
                console.log("Library fetch result : ", data);
                if (data.error) throw new Error(data.error);
                return data;
            } catch (error) {
                console.log("Error in library fetch query : ", error)
                throw new Error(error.response.data.error);
            }
        },
    })

    const { currentSubject, SubjectSelect } = useSubjectSelect({ library: library ?? { files: [], folders: [] } });

    const els = library?.files?.map((obj: FileType) => {
        if (currentSubject === "All") return (
            <File key={obj.id} text={obj.text} title={obj.title} subject={obj.subject} />
        )
        else if (obj.subject === currentSubject) {
            return (
                <File key={obj.id} text={obj.text} title={obj.title} subject={obj.subject} />
            )
        }
    })

    return (
        <>
            <h1 className={clsx(styles.title, "text-foreground text-heading")}>Your Library</h1>
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.foldersContainer)}>
                    <div className="flex items-center gap-2 justify-between">
                        <p className="section-heading">Folders</p>
                        <CreateFolderEl>
                            <HiOutlineFolderPlus />
                        </CreateFolderEl>
                    </div>
                    {library?.folders?.length > 0 ? (
                        <>
                            {library?.folders?.map((folder: FolderType) => {
                                return (
                                    <Button variant={"secondary"} className="flex items-center justify-start gap-2">
                                        <CiFolderOn />
                                        <span>{folder.name}</span>
                                    </Button>
                                )
                            })}
                        </>
                    ) : (
                        <div className="flex flex-col gap-1 mt-1">
                            <p className="text-body-sm">No folders</p>
                            <CreateFolderEl>
                                <Button className="w-full text-start flex justify-start gap-3" variant="secondary"><BsFolderPlus /><span>New Folder</span></Button>
                            </CreateFolderEl>
                        </div>
                    )}

                </div>
                <div className={clsx(styles.filesContainer)}>
                    <h3 className="section-heading">Files in Home</h3>
                    <div className={clsx(styles.topBar)}>
                        <div className={clsx(styles.filterGroup)}>
                            <div className={clsx(styles.searchBar, "flex items-center gap-2")}>
                                <SearchIcon />
                                <input type="text" placeholder="Search" />
                            </div>
                            <SubjectSelect />
                        </div>
                        <FileUploader />
                    </div>
                    <div className={clsx(styles.filesList, "rounded-md")}>
                        {isFetchingLibrary && <Loader2 className="animate-spin" />}
                        {els}
                    </div>
                </div>
            </div>
        </>
    )
}