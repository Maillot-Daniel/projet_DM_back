// Import de la fonction de requête à la base de données depuis le fichier "./init.db.js"
import query from "./init.db.js";


// Fonction pour créer un nouvel utilisateur dans la base de données
const create = async(email, password, pseudo) => {
    const sql = `
   INSERT INTO users (email, password, pseudo) 
   VALUES (?, ?, ?)`;

    let error = null;
    let result = null;

    try {
        // Exécute la requête SQL pour insérer un nouvel utilisateur
        result = await query(sql, [email, password, pseudo]);
    }
    catch (e) {
        // Capture toute erreur survenue pendant l'exécution de la requête
        error = e.message;
    }
    finally {
        // Retourne un objet contenant l'erreur et le résultat de l'opération
        return { error, result };
    }
};



// Fonction pour authentifier un utilisateur basé sur son adresse email
const signIn = async(email) => {
    const sql = `
  SELECT user_id, email, password FROM users
  WHERE email = ?`;

    let error = null;
    let result = null;

    try {
        // Exécute la requête SQL pour récupérer les informations de l'utilisateur
        result = await query(sql, [email]);
    }
    catch (e) {
        // Capture toute erreur survenue pendant l'exécution de la requête
        error = e.message;
    }
    finally {
        // Retourne un objet contenant l'erreur et le résultat de l'opération
        return { error, result };
    }
};



// Fonction pour lire les informations d'un utilisateur basé sur son identifiant
const readUserById = async(userId) => {
    // Requête SQL pour sélectionner toutes les colonnes de la table "users" où l'identifiant utilisateur correspond à la valeur fournie
    const sql = `
        SELECT * FROM users
        WHERE user_id = ?`;

    // Initialisation des variables pour stocker les éventuelles erreurs et résultats
    let error = null;
    let result = null;

    try {
        //fonction qui permet de checker si un user est bien ************
        await checkUser(userId);
        // Exécution de la requête SQL en utilisant une fonction appelée "query"
        result = await query(sql, [userId]);
    }
    catch (e) {
        // Capturer une éventuelle erreur survenue pendant l'exécution de la requête
        error = e.message;
    }
    finally {
        // Retourner un objet contenant l'erreur et le résultat (peut être null si aucune erreur n'a eu lieu)
        return { error, result };
    }
};



// Fonction pour mettre à jour les informations d'un utilisateur
const update = async(userId, email, password, pseudo) => {
    const sql = `
        UPDATE users
        SET email = ?, password = ?, pseudo = ?
        WHERE user_id = ?
    `;

    let error = null;
    let result = null;

    try {
        //fonction qui permet de checker si un user est bien ************
        await checkUser(userId);

        console.log('Executing update query. UserID:', userId);
        // Exécute la requête SQL pour mettre à jour les informations de l'utilisateur
        result = await query(sql, [email, password, pseudo, userId]);
        console.log('Update query executed successfully. Result:', result);
    }
    catch (e) {
        // Capture une éventuelle erreur survenue pendant l'exécution de la requête
        error = e.message;
        console.error('Error in update query:', error);
    }
    finally {
        // Retourne un objet contenant l'erreur et le résultat de l'opération
        return { error, result };
    }
};



// Fonction pour supprimer un utilisateur basé sur son identifiant
const deleteOne = async(userId) => {
    const sql = `
      DELETE FROM users
      WHERE user_id = ?
  `;

    let error = null;
    let result = null;

    try {
        //fonction qui permet de checker si un user est bien ************
        await checkUser(userId);

        // Exécute la requête SQL pour supprimer l'utilisateur
        result = await query(sql, [userId]);
    }
    catch (e) {
        // Capture une éventuelle erreur survenue pendant l'exécution de la requête
        error = e.message;
    }
    finally {
        // Retourne un objet contenant l'erreur et le résultat de l'opération
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



// Exporte un objet contenant toutes les fonctions liées à la base de données des utilisateurs
export const UsersDB = { create, signIn, readUserById, update, deleteOne };
