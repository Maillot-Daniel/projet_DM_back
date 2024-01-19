// Importez votre modèle de base de données
import { CategoriesDB } from "../databases/categories.db.js";

// Contrôleur pour récupérer toutes les catégories
const readAll = async(req, res) => {
    try {
        const { error, result } = await CategoriesDB.readAll();

        if (error) {
            return res.status(500).json({ error: "Erreur lors de la récupération des catégories." });
        }

        res.status(200).json({ categories: result });
    }
    catch (err) {
        console.error("Erreur dans le contrôleur readAll :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

// Exportez l'objet du contrôleur
export const CategoriesController = { readAll };
