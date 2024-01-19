import { RecipesDB } from "../databases/recipes.db.js";
//import { CategoriesDB } from "../databases/categories.db.js";


const readOne = async(req, res) => {
    try {
        const recipeId = req.params.recipeId;

        const response = await RecipesDB.readOne(recipeId);
        console.log(response); // Ajout pour déboguer

        const result = response.result;

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Le reste du code pour traiter result
        const recipe = {
            recipeId,
            name: result[0].name,
            timing: result[0].timing,
            forPeople: result[0].forPeople,
            description: result[0].description,
            comments: result
                .map((r) => {
                    if (
                        r.comment_id === null &&
                        r.content === null &&
                        r.date === null
                    ) {
                        return null;
                    }

                    return {
                        id: r.comment_id,
                        content: r.content,
                        date: r.date
                    };
                })
                .filter((r) => r !== null),
        };

        return res.status(200).json({ message: "Request OK", recipe });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



const readAll = async(req, res) => {
    try {
        const recipeId = req.params.recipeId;

        const response = await RecipesDB.readOne(recipeId);
        console.log(response); // Ajout pour déboguer

        const result = response.result;

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Le reste du code pour traiter result
        const recipe = {
            recipeId,
            name: result[0].name,
            timing: result[0].timing,
            forPeople: result[0].forPeople,
            description: result[0].description,
            comments: result
                .map((r) => {
                    if (
                        r.comment_id === null &&
                        r.content === null &&
                        r.date === null
                    ) {
                        return null;
                    }

                    return {
                        id: r.comment_id,
                        content: r.content,
                        date: r.date
                    };
                })
                .filter((r) => r !== null),
        };

        return res.status(200).json({ message: "Request OK", recipe });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



const create = async(req, res) => {
    try {
        const { name, timing, forPeople, categoryId, description, userId } = req.body;

        // Assurez-vous que les données requises sont présentes dans la requête
        if (!name || !timing || !forPeople || !description || !userId) {
            return res.status(400).json({ message: "Données de recette incomplètes" });
        }

        const response = await RecipesDB.create(name, timing, forPeople, categoryId, description, userId);

        if (response.error) {
            // Gestion des erreurs lors de la création
            return res.status(400).json({ message: "Erreur lors de la création de la recette", error: response.error });
        }

        return res.status(201).json({ message: "Recette créée avec succès", recipe: response.result });
    }
    catch (error) {
        // Gestion des erreurs internes du serveur
        return res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};



const update = async(req, res) => {
    try {
        const { recipeId, name, timing, forPeople, categoryId, description, userId } = req.body;

        // Vérifiez si tous les champs requis sont présents dans la requête
        if (!recipeId || !name || !timing || !forPeople || !categoryId || !description || !userId) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const response = await RecipesDB.update(
            recipeId,
            name,
            timing,
            forPeople,
            categoryId,
            description,
            userId
        );

        // Vérifiez si la mise à jour a été effectuée avec succès
        if (response.error) {
            return res.status(500).json({ message: response.error });
        }

        return res.status(200).json({ message: `Recipe number ${recipeId} has been updated successfully.` });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};



const deleteOne = async(req, res) => {
    const recipeId = req.params.recipeId;
    const userId = req.body.userId;
    const response = await RecipesDB.deleteOne(recipeId, userId);
    console.log(response);

    let error = response.error;

    if (error) {
        return res.status(500).json({ message: error });
    }
    else {
        return res.status(200).json({ message: "recipe deleted" });
    }
};




export const RecipesController = {
    readOne,
    readAll,
    create,
    update,
    deleteOne

};
