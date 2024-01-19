import query from "./init.db.js";



const create = async(values, userId) => {

    // on prepare la requete SQL
    const sql = `INSERT INTO recipe_ingredients (quantity, measure, ingredient_id, recipe_id) 
   VALUES (?, ?, ?, ?)`;


    // je prends mon tableau valeur et je change les valeurs
    const newValues = [...values]

    let error = null;
    try {
        await checkUser(userId);
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
    const sql = "SELECT * FROM recipe_ingredients WHERE recipe_id = ?";

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



const update = async(recipe_ingredients_id, quantity, measure, ingredient_id, recipe_id) => {
    const sql = `
    UPDATE recipe_ingredients
    SET
        quantity = ?,
        measure = ?,
        ingredient_id = ?,
        recipe_id = ?
    WHERE recipe_ingredients_id = ?;
`;

    console.log(sql);

    let error = null;
    let result = null;

    try {
        //wait checkUser(user_id);
        // Make sure that the number of placeholders matches the number of values
        result = await query(sql, [quantity, measure, ingredient_id, recipe_id, recipe_ingredients_id]);
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
    DELETE FROM recipe_ingredients
    WHERE recipe_ingredients_id = ?
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



const checkUser = async(userId) => {
    const userSql = 'SELECT user_id FROM users WHERE user_id = ?';

    // Exécute la requête SQL pour récupérer l'utilisateur
    const userResult = await query(userSql, [userId]);
    const userErr = userResult.error;

    if (userErr) {
        throw new Error(userErr);
    }

    console.log(userResult);
    const user = userResult[0];

    if (!user) {
        // Lance une erreur si l'utilisateur n'est pas trouvé
        throw new Error(`User with id ${userId} not found`);
    }
};



export const Recipe_ingredientsDB = { create, readAll, update, deleteOne };
