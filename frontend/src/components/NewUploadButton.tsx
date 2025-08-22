
import { Button } from "./ui/button";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function NewUploadButton({ additionalClasses, folderName }: { additionalClasses: string, folderName: string }) {

    const navigate = useNavigate();

    return (
        <Button className={clsx(additionalClasses)} variant="outline" onClick={() => navigate("/library/"+folderName+"/add-new")}>
            <BsFileEarmarkPlus className="" />
            <span>Add New File</span>
        </Button>
    );
}
