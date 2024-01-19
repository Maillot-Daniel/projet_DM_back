import query from "./init.db.js";



const readOne = async(ingredientId) => {
    const sql = `
            SELECT 
                ingredients.ingredient_id,
                ingredients.name
            FROM 
                ingredients
            LEFT JOIN 
                recipe_ingredients ON ingredients.ingredient_id = recipe_ingredients.ingredient_id
            WHERE 
                ingredients.ingredient_id = ?;
        `;

    let error = null;
    let result = null;

    try {
        //await checkUser(userId);

        result = await query(sql, [ingredientId]);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { error, result };
    }
};



//const readAll = async() => {
//     console.log("Avant la requête SQL pour readAll");

//     const sql = `
//             SELECT 
//                 ingredients.ingredient_id,
//                 ingredients.name
//             FROM 
//                 ingredients
//             LEFT JOIN 
//                 recipe_ingredients ON ingredients.ingredient_id = recipe_ingredients.ingredient_id
//             WHERE 
//                 ingredients.ingredient_id = ?;
//         `;

//     let error = null;
//     let result = null;

//     try {
//         result = await query(sql);
//     }
//     catch (e) {
//         error = e.message;
//     }
//     finally {
//         console.log("Après la requête SQL pour readAll - error:", error, "result:", result);
//         return { error, result };
//     }
// };



const create = async(ingredientName) => {
    const sql = `
        INSERT INTO ingredients (name)
        VALUES (?);
    `;

    let error = null;
    let result = null;

    try {
        // Add any additional validation or checks before executing the query if needed
        // For example, check if the ingredientName is valid or not.

        result = await query(sql, [ingredientName]);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { error, result };
    }
};



const update = async(ingredientId, name) => {
    const sql = `
        UPDATE ingredients
        SET
          name = ?
        WHERE ingredient_id = ?;
    `;

    let error = null;
    let result = null;

    try {
        // Assurez-vous que ingredientId est inclus dans le tableau des valeurs
        result = await query(sql, [name, ingredientId]);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { error, result };
    }
};




const deleteOne = async(ingredientId) => {


    const sql = `
        DELETE FROM ingredients
        WHERE ingredient_id = ?;
    `;


    const recipe_ingredientssql = `
        DELETE FROM recipe_ingredients
        WHERE ingredient_id = ?;
    `;

    const recipessql = `
        DELETE FROM recipes
        WHERE rec_id = ?;
    `;

    let error = null;
    let result = null;

    try {
        console.log('Deleting from ingredients:', ingredientId);
        await query(recipe_ingredientssql, [ingredientId]);
        await query(recipessql, [ingredientId]);
        result = await query(sql, [ingredientId]);
        console.log('Result:', result);
    }
    catch (e) {
        error = e.message;
        console.error('Error:', error);
    }
    finally {
        return { result, error };
    }
};




const checkUser = async(ingredientId) => {
    console.log("Avant la requête SQL dans checkUser - ingredientId:", ingredientId);

    const userSql = 'SELECT ingredient_id FROM ingredients WHERE ingredient_id = ?';

    const userResult = await query(userSql, [ingredientId]);
    const userErr = userResult.error;

    if (userErr) {
        throw new Error(userErr);
    }

    const user = userResult.result[0];

    if (!user) {
        throw new Error(`Ingredient with id ${ingredientId} not found`);
    }

    console.log("Après la requête SQL dans checkUser - user:", user);
};




export const IngredientsDB = { readOne, create, update, deleteOne };
