
export const uploadFile = async (req, res) => {
    const sb  = req.sb;
    const user = req.user;

    try {

        const { title, text, subject } = req.body;

        if (!title || !text || !subject) {
            return res.json({error : "Incomplete details provided to upload file"})
        }

        const { data: existingFile, error: fetchError } = await sb
        .from("files").select("*").eq("title", title);

        if (fetchError) {
            console.log("Error checking for duplicate files : ", fetchError);
            return res.status(500).json({ error : "Unexpected server error"})
        }

        if (existingFile.length >= 1) {
            return res.status(301).json({ error : "File with this name already exits"})
        }

        const { data: insertedFileRow, error } = await sb
        .from("files")
        .insert({
            user_id: user.id,
            title: title,
            text : text,
            subject : subject
        }).select("*").single();

        if (error) {
            console.log("Error in inserting new file : ", error);
            return res.status(500).json( { error : "Unexpected server error" });
        }

        return res.status(200).json(insertedFileRow)

    } catch (error) {
        console.log("Error in upload file controller : ", error);
        return res.stats(500).json({ error : "Unexpected server error "});
    }
}

export const getLibrary = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {
        const { data: folders, error: foldersFetchError } = await sb
        .from("folders")
        .select("*")

        if (foldersFetchError) {
            console.log("Error in fetching folders : ", foldersFetchError);
            return res.status(500).json({ error : "Unexpected server error" });
        }

        if ( folders.length <= 0 ) {

            const { data: files, error: filesFetchError } = await sb
            .from("files")
            .select("*")

            if (filesFetchError) {
                console.log("Error in fetching only files : ", filesFetchError);
                return res.status(500).json({ error : "Unexpcted server error" });
            }

            return res.status(200).json({files: files, folders: null})
        }
        
        const populatedFolders = await Promise.all(folders.map(async (folder) => {
            const { data: filesInFolder, error: filesInFolderError } = await sb
            .from("files")
            .select("*")
            .eq("folder_id", folder.id);

            if (filesInFolderError) {
                console.log("Error in fetching files of a folder : ", filesInFolderError);
                throw new Error("Unexpected server error")
            }

            if (filesInFolder.length > 0) folder.files = filesInFolder;
            else folder.files = null;
            return folder;
        }))

        const { data : freeFiles, error: freeFilesFetchError } = await sb
        .from("files")
        .select("*")
        .is("folder_id", null);

        if (freeFilesFetchError) {
            console.log("Error in free files fetch : ", freeFilesFetchError);
            return res.status(500).json({ error : "Unexpected server error" });
        }
        
        const result ={
            folders : populatedFolders,
            files: freeFiles
        }

        return res.status(200).json(result)

    } catch (error) {
        console.log("Error occured in get library controller : ", error);
        return res.status(500).json({ error : "Unexpected server error" });
    }
}

export const createFolder = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {

        const {name} = req.body;
        if (!name) {
            return res.status(300).json({error: "Please provide the folder name"})
        }
        const { data: createdFolder, error } = await sb
        .from("folders")
        .insert({
            user_id: user.id,
            name: name
        }).select("*").single();

        if (error) {
            console.log("Error in create folder supabase request : ", error);
            return res.status(500).json({ error: "Unexpected Server Error"});
        }

        return res.status(200).json(createdFolder)

    } catch (error) {
        console.log("Error in create folder controller : ", error);
        return res.status(500).json({ error: "Unexptected server error" });
    }
}