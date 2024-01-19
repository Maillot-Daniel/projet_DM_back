// ingredients.controller.js
import { IngredientsDB } from "../databases/ingredients.db.js";



const readOne = async(req, res) => {
    try {
        const ingredientId = req.params.ingredientId;

        const response = await IngredientsDB.readOne(ingredientId);
        console.log(response);

        const result = response.result;

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Ingrédient non trouvé" });
        }

        // Traitement des données du résultat
        const ingredient = {
            ingredientId,
            name: result[0].name,
            // Ajoutez d'autres propriétés selon votre modèle de données
        };

        return res.status(200).json({ message: "Requête OK", ingredient });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur interne du serveur", error: error.message });
    }
};



//const readAll = async(req, res) => {
//     try {
//         const response = await IngredientsDB.readAll();
//         const result = response.result;

//         if (!result || result.length === 0) {
//             console.log("Aucun ingrédient trouvé dans la base de données.");
//             return res.status(404).json({ message: "Aucun ingrédient trouvé" });
//         }

//         const ingredients = result.map(ingredient => ({
//             ingredientId: ingredient.ingredient_id,
//             name: ingredient.name,
//             // Ajoutez d'autres propriétés selon votre modèle de données
//         }));

//         return res.status(200).json({ message: "Requête OK", ingredients });
//     }
//     catch (error) {
//         console.error("Erreur lors de la récupération des ingrédients :", error);
//         return res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
//     }
// };



const create = async(req, res) => {
    try {

        const { name } = req.body;


        const response = await IngredientsDB.create(name);

        const result = response.result;


        if (result && result.affectedRows > 0) {

            const newIngredientId = result.insertId;

            return res.status(201).json({ message: "Ingrédient créé avec succès", newIngredientId });
        }
        else {
            return res.status(500).json({ message: "Erreur lors de la création de l'ingrédient" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};



const update = async(req, res) => {
    try {
        const { ingredientId, name } = req.body;

        // Vérifiez si tous les champs requis sont présents dans la requête
        if (!ingredientId || !name) {
            return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
        }

        // Vérifiez si ingredientId est un nombre valide
        if (isNaN(ingredientId)) {
            return res.status(400).json({ error: 'IngredientId doit être un nombre valide.' });
        }

        const response = await IngredientsDB.update(ingredientId, name);

        // Vérifiez si la mise à jour a été effectuée avec succès
        if (response.error) {
            return res.status(500).json({ error: `Erreur lors de la mise à jour : ${response.error}` });
        }

        return res.status(200).json({ success: true, message: `Ingrédient ${ingredientId} mis à jour avec succès.` });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};



const deleteOne = async(req, res) => {
    const userId = req.body.userId;
    const ingredientId = req.body.ingredientId;

    // Validate userId if needed

    const response = await IngredientsDB.deleteOne(ingredientId, userId);
    console.log(response);

    let error = response.error;

    if (error) {
        return res.status(500).json({ message: error });
    }
    else {
        return res.status(200).json({ message: "ingredient deleted" });
    }
};


export const IngredientsController = {
    readOne,
    create,
    update,
    deleteOne
};
