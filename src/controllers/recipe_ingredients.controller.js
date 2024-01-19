import { Recipe_ingredientsDB } from "../databases/recipe_ingredients.db.js";



const create = async(req, res) => {
    const body = req.body;

    const quantity = body.quantity;
    const measure = body.measure;
    const ingredient_id = body.ingredient_id;
    const recipe_id = body.recipe_id;

    const error = await Recipe_ingredientsDB.create([quantity, measure, ingredient_id, recipe_id]);

    // une fois que l'insertion est ok, on répond au client
    res.status(error ? 500 : 201).json({ message: error ? error : "Request Ok" });
};



const readAll = async(req, res) => {

    const recipe_id = req.params.reqRecipe_id;


    const { result, error } = await Recipe_ingredientsDB.readAll(recipe_id);

    res
        .status(error ? 500 : 200)
        .json({ message: error ? error : "Request ok", Recipe_ingredients: result });
};



const update = async(req, res) => {
    try {
        const { recipe_ingredients_id, quantity, measure, ingredient_id, recipe_id } = req.body;

        // Vérifiez si tous les champs requis sont présents dans la requête
        if (!recipe_ingredients_id || !quantity || !measure || !ingredient_id || !recipe_id) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const response = await Recipe_ingredientsDB.update(
            recipe_ingredients_id,
            quantity,
            measure,
            ingredient_id,
            recipe_id
        );
        if (response.error) {
            return res.status(500).json({ message: response.error });
        }

        return res.status(200).json({ message: `recipe_ingredients number ${recipe_ingredients_id} has been updated successfully.` });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};



const deleteOne = async(req, res) => {
    const recipe_ingredients_id = req.params.recipe_ingredients_id;

    const response = await Recipe_ingredientsDB.deleteOne(recipe_ingredients_id);
    console.log(response);

    let error = response.error;

    if (error) {
        return res.status(500).json({ message: error });
    }
    else {
        return res.status(200).json({ message: "recipe_ingredients delete" });
    }
};



export const Recipe_ingredientsController = { create, readAll, update, deleteOne };
