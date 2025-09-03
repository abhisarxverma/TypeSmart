
export const uploadText = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {

        const { title, text, tag } = req.body;

        if (!title || !text || !tag) {
            return res.json({ error: "Incomplete details provided to upload file" })
        }

        const { data: insertedText, error } = await sb
            .from("texts")
            .insert({
                user_id: user.id,
                title: title,
                text: text,
                tag: tag,
            }).select("*").single();

        if (error) {
            console.log("Error in inserting new text : ", error);
            return res.status(500).json({ error: "Unexpected server error" });
        }

        return res.status(200).json(insertedText)

    } catch (error) {
        console.log("Error in upload text controller : ", error);
        return res.stats(500).json({ error: "Unexpected server error " });
    }
}

export const getLibrary = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {

        const { data: allTexts, error: textsError } = await sb
            .from('texts')
            .select('*')

        if (textsError) throw textsError

        // console.log("All texts result : ", allTexts);

        const { data: groupsWithTexts, error: groupsError } = await sb
            .from("groups")
            .select(`
    *,
    group_texts:group_texts (
      importance,
      texts (*)
    )
  `);


        if (groupsError) throw groupsError;

        const flattenedGroups = groupsWithTexts.map(group => ({
            ...group,
            group_texts: group.group_texts.map(g => ({
                ...g.texts,
                importance: g.importance
            }))
        }));

        // console.log("Groups with texts result : ", flattenedGroups);

        return res.status(200).json({
            "groups": flattenedGroups,
            "texts": allTexts
        })

    } catch (error) {
        console.log("Error occured in get library controller : ", error);
        return res.status(500).json({ error: "Unexpected server error" });
    }
}

export const createGroup = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {

        const { name, subject } = req.body;
        if (!name) {
            return res.status(300).json({ error: "Please provide the folder name" })
        }
        const { data: createdGroup, error } = await sb
            .from("groups")
            .insert({
                user_id: user.id,
                name: name,
                tag: tag
            }).select("*").single();

        if (error) {
            throw error
        }

        return res.status(200).json(createdGroup)

    } catch (error) {
        console.log("Error in create group controller : ", error);
        return res.status(500).json({ error: "Unexptected server error" });
    }
}

export const addInGroup = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {

        const { text_id, group_id } = req.body;

        if (!text_id || !group_id) {
            return res.status(300).json({ error: "Missing data in request" });
        }

        const { data: text, error: textFindError } = await sb
            .from("texts")
            .select("*")
            .eq("id", text_id)
            .single()

        if (textFindError) throw textFindError;

        const { data: group, error: groupFindError } = await sb
            .from("groups")
            .select("*")
            .eq("id", group_id)
            .single()

        if (groupFindError) throw groupFindError;

        console.log("Find group result : ", group)

        const { data: GroupTextRow, error: GroupTextError } = await sb
            .from("group_texts")
            .insert({
                text_id: text.id,
                group_id: group.id
            });

        if (GroupTextError) throw GroupTextError;

        // console.log("Group insertion result : ", GroupTextRow);

        return res.status(200).json(text);

    } catch (error) {
        console.log("Error occured in add in group controller : ", error);
        return res.status(500).json({ error: "Unexpected server error" });
    }
}

export const removeFromGroup = async (req, res) => {
    const sb = req.sb;
    const user = req.user;

    try {

        const { text_id, group_id } = req.body;

        if (!text_id || !group_id) {
            return res.status(300).json({ error: "Missing data in request" });
        }

        const { data: text, error: textFindError } = await sb
            .from("texts")
            .select("*")
            .eq("id", text_id)
            .single()

        if (textFindError) throw textFindError;

        const { data: group, error: groupFindError } = await sb
            .from("groups")
            .select("*")
            .eq("id", group_id)
            .single()

        if (groupFindError) throw groupFindError;

        console.log("Find group result : ", group)

        const { data: removedText, error: removeError } = await sb
            .from("group_texts")
            .delete()
            .match({
                text_id: text.id,
                group_id: group.id
            });


        if (removeError) throw removeError;

        // console.log("Group deletion result : ", removedText);

        return res.status(200).json(text);

    } catch (error) {
        console.log("Error occured in remove from group controller : ", error);
        return res.status(500).json({ error: "Unexpected server error" });
    }
}

export const editText = async (req, res) => {
    const sb = req.sb;

    try {
        const { title, text, tag, textId } = req.body;

        if (!title || !text || !tag || !textId) {
            return res.json({ error: "Incomplete details provided to upload file" })
        }

        const { data: updatedText, error } = await sb
            .from("texts")
            .update({
                title: title,
                text: text,
                tag: tag,
            })
            .eq("id", textId)
            .select("*")
            .single();


        if (error) {
            throw error;
        }

        return res.status(200).json(updatedText)

    } catch (error) {
        console.log("Error in upload text controller : ", error);
        return res.stats(500).json({ error: "Unexpected server error " });
    }
}

export const updateImportance = async (req, res) => {
  const sb = req.sb;

  try {
    const { textId, groupId, importance } = req.body;

    if (!textId || !groupId || !importance) {
      return res.status(400).json({ error: "Incomplete request made" });
    }

    const { data: updatedJoinRow, error: updateError } = await sb
      .from("group_texts")
      .update({ importance })
      .eq("text_id", textId)
      .eq("group_id", groupId)
      .select("importance")
      .single();

    if (updateError) throw updateError;

    const { data: textRow, error: textError } = await sb
      .from("texts")
      .select("*")
      .eq("id", textId)
      .single();

    if (textError) throw textError;

    const enrichedText = {
      ...textRow,
      importance: updatedJoinRow.importance,
    };

    return res.status(200).json(enrichedText);
  } catch (error) {
    console.error("Error in updateImportance controller:", error);
    return res.status(500).json({ error: "Unexpected server error" });
  }
};
