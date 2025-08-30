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
        <div className="max-w-[1100px] mx-auto pb-8">
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-3xl font-semibold">Your Library</h1>
                <div className="flex items-center gap-2">
                    <CreateFolderDialogWrapper><Button ><PiFilesThin />Create Group</Button></CreateFolderDialogWrapper>
                    <Button variant="outline" asChild>
                        <Link to="/add"><CiTextAlignLeft />Add Text</Link>
                    </Button>
                </div>
            </div>
            <div className="flex items-center mt-8 gap-2">
                <div className={clsx(styles.inputGroup)}>
                    {/* <label>Search</label> */}
                    <div className={clsx(styles.searchBar)}>
                        <Input name="search" placeholder="Search your library...." />
                    </div>
                </div>
                <div className={clsx(styles.inputGroup)}>
                    {/* <label>Subject</label> */}
                    <CustomSelect label="Subject" setValue={setSubject} options={subjects} />
                </div>
                <div className={clsx(styles.inputGroup)}>
                    {/* <label>Importance</label> */}
                    <CustomSelect label="Importance" setValue={setImportance} options={getImportances()} />
                </div>
            </div>
            <div className="mt-8">
                <p className="text-xl font-semibold mb-2">Groups</p>
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                    {library?.groups?.map(group => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            </div>
            <div className="mt-8">
                <p className="text-xl font-semibold mb-2">All Texts</p>
                <TextsList groupId={null} texts={library?.texts ?? []} />
            </div>
        </div>
    )
}