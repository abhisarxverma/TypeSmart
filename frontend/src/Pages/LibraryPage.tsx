import clsx from "clsx";
import styles from "./LibraryPage.module.css";
import FileUploader from "@/components/NewUpload";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader2, SearchIcon } from "lucide-react";
import File from "@/components/File";
import { Button } from "@/components/ui/button";
import type { File as FileType, Folder } from "@/Types/Library";
import { BsFileEarmarkPlus } from "react-icons/bs";
import SubjectSelect from "@/components/SubjectSelect";
import { useState } from "react";
import FoldersCommand from "@/components/FoldersCommand";
import { getSubjects } from "@/utils/files";
import { LuLibraryBig } from "react-icons/lu";

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

    const [currentSubject, setCurrentSubject] = useState<string>("All");

    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    
    const subjects = getSubjects(selectedFolder?.files || library?.files);

    let files;

    if (selectedFolder === null) {
        files = library?.files;
    }
    else {
        files = library?.folders?.filter((folder: Folder) => folder.id === selectedFolder.id)[0].files
    }

    const fileEls = files?.map((obj: FileType) => {
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
            <h1 className={clsx(styles.title, "text-foreground text-heading flex items-center gap-1")}>
                <LuLibraryBig />
                <span>Your Library</span>
            </h1>
            <div className={clsx(styles.folderBar)}>
                <div className="flex flex-col">
                    <span className="text-caption font-bold">Folder</span>
                    <p className="text-subheading mt-[-.3rem]">{selectedFolder?.name ?? "Home"}</p>
                </div>
                <FoldersCommand folders={library?.folders ?? []} clickFn={setSelectedFolder} />
            </div>
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.filesContainer)}>
                    <h3 className="section-heading">Files in {selectedFolder?.name ?? "Home"}</h3>
                    <div className={clsx(styles.topBar)}>
                        <div className={clsx(styles.searchBar, "flex items-center gap-2")}>
                            <SearchIcon size={"1rem"} />
                            <input className={clsx(styles.searchInput)} type="text" placeholder="Search" />
                        </div>
                        <SubjectSelect currentSubject={currentSubject} clickFn={setCurrentSubject} customClass={clsx(styles.subjectSelect)} subjects={subjects} />

                        <FileUploader folder_id={selectedFolder?.id ? selectedFolder?.id : null}>
                            <Button className={clsx("flex items-center gap-2", styles.addFileButton)}>
                                <BsFileEarmarkPlus className="font-bold" />
                                <span>Add File</span>
                            </Button>
                        </FileUploader>
                    </div>
                    {fileEls?.length > 0  ? (
                        <div className={clsx(styles.filesList, "rounded-md")}>
                            {isFetchingLibrary && <Loader2 className="animate-spin" />}
                            {fileEls}
                        </div>
                    ) : (
                        <div className={clsx(styles.noFileBox)}>
                            <p>No files.</p>
                            <FileUploader folder_id={selectedFolder?.id ?? null}>
                                <Button className="flex items-center gap-2">
                                    <BsFileEarmarkPlus className="font-bold" />
                                    <span>Add First File</span>
                                </Button>
                            </FileUploader>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}