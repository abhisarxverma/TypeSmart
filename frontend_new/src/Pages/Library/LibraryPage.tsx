import clsx from "clsx";
import styles from "./LibraryPage.module.css";
import { Button } from "@/components/ui/button";
import { PiFilesThin } from "react-icons/pi";
import { CiTextAlignLeft } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/Library_filters/CustomSelect";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getImportances, getSubjects } from "@/Utils/files";
import { useLibrary } from "@/Hooks/useLibrary";
import CreateFolderDialogWrapper from "@/components/Create_folder/CreateFolderDialogWrapper";
import GroupCard from "@/components/GroupCard/GroupCard";
import TextsList from "@/components/Texts_list/TextsList";


export default function LibraryPage() {

    const [subject, setSubject] = useState<string | null>(null);
    const [importance, setImportance] = useState<string | null>(null);

    const { library } = useLibrary();

    const subjects = getSubjects(library?.texts ?? [])

    return (
        <>
            <div className={clsx(styles.container)}>
                <h1 className={clsx(styles.pageTitle)}>Your Library</h1>
                <div className="flex items-center gap-1">
                    <CreateFolderDialogWrapper><Button className={clsx(styles.createGroupButton)}><PiFilesThin />Create Group</Button></CreateFolderDialogWrapper>
                    <Button className={clsx(styles.addTextButton)} asChild>
                        <Link to="/add"><CiTextAlignLeft />Add Text</Link>
                    </Button>
                </div>
            </div>
            <div className={clsx(styles.filtersBox, "shadow")}>
                <div className={clsx(styles.inputGroup)}>
                    <label>Search</label>
                    <div className={clsx(styles.searchBar)}>
                        <Input name="search" placeholder="Search your library...." />
                    </div>
                </div>
                <div className={clsx(styles.inputGroup)}>
                    <label>Subject</label>
                    <CustomSelect label="Filter by subject" setValue={setSubject} options={subjects} />
                </div>
                <div className={clsx(styles.inputGroup)}>
                    <label>Importance</label>
                    <CustomSelect label="Filter by Importance" setValue={setImportance} options={getImportances()} />
                </div>
            </div>
            <div className={clsx(styles.groupsBox)}>
                <p className={clsx(styles.sectionTitle, "mb-2")}>Your Groups</p>
                <div className={clsx(styles.groupsList)}>
                    {library?.groups?.map(group => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            </div>
            <div className={clsx(styles.textsBox)}>
                <p className={clsx(styles.sectionTitle, "mb-2")}>Your All Texts</p>
                <TextsList groupId={null} texts={library?.texts ?? []} type={"library_all_texts"} />
            </div>
        </>
    )
}