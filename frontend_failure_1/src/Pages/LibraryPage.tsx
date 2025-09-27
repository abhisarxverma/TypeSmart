import clsx from "clsx";
import styles from "./LibraryPage.module.css";
import { useState } from "react";
import { Loader2, SearchIcon } from "lucide-react";
import { getSubjects } from "@/utils/files";
import { LuLibraryBig } from "react-icons/lu";
import { useLibrary } from "@/Hooks/useLibrary";
import File from "@/components/File";
import type { File as FileType, Folder } from "@/Types/Library";
import NewUploadButton from "@/components/NewUploadButton";
import SubjectSelect from "@/components/SubjectSelect";
import FoldersCommand from "@/components/FoldersCommand";
import { useParams } from "react-router-dom";

export default function LibraryPage() {

    const { library, isFetchingLibrary } = useLibrary();

    const [currentSubject, setCurrentSubject] = useState<string>("All");

    const { folderName } = useParams();

    const currentFolder =
    folderName === "home"
            ? null
            : library?.folders?.find((f: Folder) => f.name === folderName) ?? null;
            
    const subjects = getSubjects(currentFolder?.files || library?.files || []);

    const files = currentFolder
        ? currentFolder.files ?? []
        : library?.files ?? [];


    const fileEls = files?.filter(
        (obj: FileType) => currentSubject === "All" || obj.subject === currentSubject
    ).map((obj: FileType) => (
        <File key={obj.id} {...obj} />
    ));


    return (
        <>
            <h1 className={clsx(styles.title, "text-foreground text-heading flex items-center gap-1")}>
                <LuLibraryBig />
                <span>Your Library</span>
            </h1>
            <div className={clsx(styles.folderBar)}>
                <div className="flex flex-col">
                    <span className="text-caption font-bold">Folder</span>
                    <p className="text-subheading mt-[-.3rem]">{currentFolder?.name ?? "Home"}</p>
                </div>
                <FoldersCommand folders={library?.folders ?? []} />
            </div>
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.filesContainer)}>
                    <h3 className="section-heading">Files in {currentFolder?.name ?? "Home"}</h3>
                    <div className={clsx(styles.topBar)}>
                        <div className={clsx(styles.searchBar)}>
                            <SearchIcon size={"1rem"} />
                            <input className={clsx(styles.searchInput)} type="text" placeholder="Search" />
                        </div>
                        <SubjectSelect currentSubject={currentSubject} clickFn={setCurrentSubject} customClass={clsx(styles.subjectSelect)} subjects={subjects} />

                        <NewUploadButton folderName={folderName ?? "Home"} additionalClasses={clsx(styles.addFileButton, "bg-foreground text-background px-3 py-1 rounded-md text-body-sm font-semibold")} />
                    </div>
                    {isFetchingLibrary || fileEls?.length > 0 ? (
                        <div className={clsx(styles.filesList, "rounded-md")}>
                            {isFetchingLibrary && <Loader2 className="animate-spin" />}
                            {fileEls}
                        </div>
                    ) : (
                        <div className={clsx(styles.noFileBox)}>
                            <p>No files.</p>
                            <NewUploadButton folderName={folderName ?? "Home"} additionalClasses="" />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}