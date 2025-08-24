import { useParams } from "react-router-dom";
import styles from "./GroupPage.module.css";
import { useLibrary } from "@/Hooks/useLibrary";
import { PiFilesLight } from "react-icons/pi";
import clsx from "clsx";
import TextsList from "@/components/Texts_list/TextsList";


export default function GroupPage() {

    const { id: groupId } = useParams();

    const { library } = useLibrary();

    const group = library?.groups?.find(group => group.id === groupId);

    console.log(group?.group_texts)

    const canAddTexts = library?.texts?.filter(
        text => !group?.group_texts?.some(gt => gt.id === text.id)
    );

    return (
        <div className={styles.container}>
            <div className={styles.left}>

                <span className="text-[1rem]">Group</span>
                <p className={styles.pageTitle}><PiFilesLight className="me-1" />{group?.name}</p>
                <div className={clsx(styles.textsBox, styles.section)}>
                    <p className={clsx(styles.sectionTitle)}>Texts</p>
                    {group?.group_texts && group?.group_texts.length <= 0 ? (
                        <div className={styles.noTexts}>No Text present....</div>
                    ) : (
                        <TextsList groupId={groupId ?? null} type="present_in_group" texts={group?.group_texts ?? []} />
                    )}
                </div>
            </div>
            {canAddTexts && canAddTexts.length > 0 && <div className={clsx(styles.addTextsBox, styles.right, "shadow")}>
                <p className={clsx(styles.sectionTitle, "ms-2")}>Add Texts</p>
                <TextsList groupId={groupId ?? null} type="add_in_group" texts={canAddTexts} />
            </div>}
        </div>
    )
}
