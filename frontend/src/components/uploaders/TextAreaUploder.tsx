import { Textarea } from "../ui/textarea";
import styles from "./TextAreaUploader.module.css";
import clsx from "clsx";

export default function TextAreaUploader() {

    return (
        <div className={clsx(styles.uploaderBox)}>
            <Textarea
                onChange={() => console.log("changed")}
                className="w-full h-full text-sm text-gray-600"
                placeholder="Enter you rext"
            />
        </div>
    )
}