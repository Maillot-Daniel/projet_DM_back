import query from "./init.db.js";


const readOne = async(recipeId) => {
    const sql = `
SELECT 
    recipes.recipe_id,
    recipes.name,
    recipes.timing,
    recipes.forPeople,
    recipes.description,
    recipes.user_id,
    comments.comment_id,
    comments.content,
    comments.date
FROM 
    recipes
LEFT JOIN 
    comments ON recipes.recipe_id = comments.recipe_id
WHERE 
    recipes.recipe_id = ?;
        
    `;

    let error = null;
    let result = null;

    try {
        //await checkUserRecipe(recipeId, userId);

        result = await query(sql, [recipeId]);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { error, result };
    }
};



const readAll = async(recipeId) => {
    const sql = `
SELECT 
    recipes.recipe_id,
    recipes.name,
    recipes.timing,
    recipes.forPeople,
    recipes.description,
    recipes.user_id,
    comments.comment_id,
    comments.content,
    comments.date
FROM 
    recipes
LEFT JOIN 
    comments ON recipes.recipe_id = comments.recipe_id

    `;

    let error = null;
    let result = null;

    try {
        //await checkUserRecipe(recipeId, userId);

        result = await query(sql, [recipeId]);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { error, result };
    }
};


const readAllx = async(recipe_id) => {
    const sql = "SELECT * FROM recipes WHERE recipe_id = ?";

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



const create = async(name, timing, forPeople, categoryId, description, userId) => {
    const recipeSql = `
        INSERT INTO recipes (name, timing, forPeople, category_id, description, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        // Effectuez des vérifications ou des validations supplémentaires si nécessaire
        if (!name || !timing || !forPeople || categoryId === undefined || categoryId === null || !description || !userId) {
            throw new Error('Données de recette incomplètes');
        }

        // Création de la recette
        const recipeResult = await query(recipeSql, [name, timing, forPeople, categoryId, description, userId]);
        const recipeId = recipeResult.insertId;

        // Récupérez les recettes après la création
        const recipesResponse = await readAll();

        if (recipesResponse.error) {
            throw new Error('Erreur lors de la récupération des recettes');
        }

        return { error: null, result: recipesResponse.result };
    }
    catch (e) {
        return { error: e.message, result: null };
    }
};



const update = async(recipeId, name, timing, forPeople, categoryId, description, userId) => {
    const sql = `
        UPDATE recipes
        SET
          name = ?,
          timing = ?,
          forPeople = ?,
          category_id = ?,
          description = ?,
          user_id = ?
        WHERE recipe_id = ?;
    `;

    let error = null;
    let result = null;

    try {
        // Assurez-vous que recipeId est inclus dans le tableau des valeurs
        result = await query(sql, [name, timing, forPeople, categoryId, description, userId, recipeId]);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { error, result };
    }
};



const deleteOne = async(recipeId, userId) => {
    const sql = `
    DELETE FROM recipes
    WHERE recipe_id = ?
  `;

    const categorySql = `
    DELETE FROM categories
    WHERE category_id = ?
  `;

    const commentSql = `
    DELETE FROM comments
    WHERE recipe_id = ?
  `;

    let error = null;
    let result = null;

    try {
        // Uncomment the following lines if needed
        // await checkAdminRole(userId);
        // await checkUserAndArticle(articleId, userId);

        await query(commentSql, [recipeId]);
        await query(categorySql, [recipeId]);
        result = await query(sql, [recipeId]);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { result, error };
    }
};



//fonction qui permet de checker si un user est bien
//le createur du user
//cette fonction est appelée dans readUserById
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



export const RecipesDB = { readOne, readAll, readAllx, create, update, deleteOne };
