import query from "./init.db.js";


const create = async(values) => {

    // on prepare la requete SQL
    const sql = `INSERT INTO comments (content, date, recipe_id, user_id) 
   VALUES (?, NOW(), ?, ?)`;


    // je prends mon tableau valeur et je change les valeurs
    const newValues = [...values]

    let error = null;
    try {
        //await checkUserAndComment(commentId, userId);
        // on execute la requete avec les valeurs receptionnées
        await query(sql, newValues);
    }
    catch (e) {
        console.log(e.message);
        error = e.message;
    }
    finally {
        return error;
    }
};



const readAll = async(recipe_id) => {
    const sql = "SELECT * FROM comments WHERE recipe_id = ?";

    let result = []; // ou NULL
    let error = null;

    try {
        result = await query(sql, [recipe_id]);
        console.log(recipe_id);
        console.log(result);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return {
            result,
            error,
        };
    }
};



const update = async(commentId, content, date, recipeId, userId) => {
    const sql = `
        UPDATE comments
        SET
          content = ?,
          date = ?,
          recipe_id = ?,
          user_id = ?
        WHERE comment_id = ?;
    `;

    let error = null;
    let result = null;

    try {
        await checkUserAndComment(commentId, userId);
        // Make sure that the number of placeholders matches the number of values
        result = await query(sql, [content, date, recipeId, userId, commentId]);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { error, result };
    }
};



const deleteOne = async(comment_id, user_id) => {
    const sql = `
    DELETE FROM comments
    WHERE comment_id = ?
  `;


    let error = null;
    let result = null;

    try {

        result = await query(sql, [comment_id]);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { result, error };
    }
};




const checkUserAndComment = async(comment_id, user_id) => {
    const commentSql = `SELECT comment_id, user_id FROM comments WHERE comment_id = ?`;
    const commentResult = await query(commentSql, [comment_id]);
    const commentErr = commentResult.error;
    if (commentErr) {
        throw new Error(commentErr);
    }

    console.log(commentResult);
    const comment = commentResult[0];

    if (comment.user_id !== user_id) {
        throw new Error(
            `User with id ${user_id} is not the creator of comment with id ${comment_id}`
        );
    }
};




export const CommentsDB = { create, readAll, update, deleteOne };
