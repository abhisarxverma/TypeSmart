
export const uploadFile = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {

        const { title, text, subject, folder_id } = req.body;

        console.log("Folder id : ", folder_id)

        if (!title || !text || !subject) {
            return res.json({ error: "Incomplete details provided to upload file" })
        }

        const findDuplicateQuery = sb.from("files").select("*").eq("title", title);

        if (folder_id) {
            findDuplicateQuery.eq("folder_id", folder_id);
        } else {
            findDuplicateQuery.is("folder_id", null);
        }

        const { data: existingFile, error: fetchError } = await findDuplicateQuery;


        if (fetchError) {
            console.log("Error checking for duplicate files : ", fetchError);
            return res.status(500).json({ error: "Unexpected server error" })
        }

        if (existingFile.length >= 1) {
            return res.status(301).json({ error: "File with this name already exits" })
        }

        const { data: insertedFileRow, error } = await sb
            .from("files")
            .insert({
                user_id: user.id,
                title: title,
                text: text,
                subject: subject,
                folder_id: folder_id || null
            }).select("*").single();

        if (error) {
            console.log("Error in inserting new file : ", error);
            return res.status(500).json({ error: "Unexpected server error" });
        }

        return res.status(200).json(insertedFileRow)

    } catch (error) {
        console.log("Error in upload file controller : ", error);
        return res.stats(500).json({ error: "Unexpected server error " });
    }
}

export const getLibrary = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {
        // Fetch folders with their files using a left join
        const { data: foldersWithFiles, error: foldersWithFilesError } = await sb
            .from("folders")
            .select(`
    *,
    files:files (
      *
    )
  `);

        if (foldersWithFilesError) {
            console.log("Error fetching folders with files:", foldersWithFilesError);
            return res.status(500).json({ error: "Unexpected server error" });
        }

        // Fetch files that are not in any folder
        const { data: freeFiles, error: freeFilesError } = await sb
            .from("files")
            .select("*")
            .is("folder_id", null);

        if (freeFilesError) {
            console.log("Error fetching free files:", freeFilesError);
            return res.status(500).json({ error: "Unexpected server error" });
        }

        // Final response
        return res.status(200).json({
            folders: foldersWithFiles,
            files: freeFiles
        });

    } catch (error) {
        console.log("Error occured in get library controller : ", error);
        return res.status(500).json({ error: "Unexpected server error" });
    }
}

export const createFolder = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {

        const { name } = req.body;
        if (!name) {
            return res.status(300).json({ error: "Please provide the folder name" })
        }
        const { data: createdFolder, error } = await sb
            .from("folders")
            .insert({
                user_id: user.id,
                name: name
            }).select("*").single();

        if (error) {
            console.log("Error in create folder supabase request : ", error);
            return res.status(500).json({ error: "Unexpected Server Error" });
        }

        return res.status(200).json(createdFolder)

    } catch (error) {
        console.log("Error in create folder controller : ", error);
        return res.status(500).json({ error: "Unexptected server error" });
    }
}