import { CommentsDB } from "../databases/comments.db.js";



const create = async(req, res) => {
    const body = req.body;

    const content = body.content;
    const recipe_id = body.recipe_id;
    const user_id = body.user_id;

    const error = await CommentsDB.create([content, recipe_id, user_id]);

    // une fois que l'insertion est ok, on répond au client
    res.status(error ? 500 : 201).json({ message: error ? error : "Request Ok" });
};


const readAll = async(req, res) => {

    const recipe_id = req.params.reqRecipe_id;


    const { result, error } = await CommentsDB.readAll(recipe_id);

    res
        .status(error ? 500 : 200)
        .json({ message: error ? error : "Request ok", comment: result });
};



const update = async(req, res) => {
    try {
        const { comment_id, content, date, recipe_id, user_id } = req.body;

        // Vérifiez si tous les champs requis sont présents dans la requête
        if (!comment_id || !content || !date || !recipe_id || !user_id) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const response = await CommentsDB.update(
            comment_id,
            content,
            date,
            recipe_id,
            user_id
        );

        if (response.error) {
            return res.status(500).json({ message: response.error });
        }

        return res.status(200).json({ message: `Comment number ${comment_id} has been updated successfully.` });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


const deleteOne = async(req, res) => {
    const comment_id = req.params.comment_id;
   
    const response = await CommentsDB.deleteOne(comment_id);
    console.log(response);

    let error = response.error;

    if (error) {
        return res.status(500).json({ message: error });
    }
    else {
        return res.status(200).json({ message: "comment delete" });
    }
};



export const CommentsController = { create, readAll, update, deleteOne };
