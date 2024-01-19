import isEmail from "validator/lib/isEmail.js";
import { UsersDB } from "../databases/users.db.js";
import { jwtSign } from "../middlewares/jwt.mdlwr.js";
import { stringIsFilled } from "../utils/string.utils.js";
import { hashPass, compareHash } from "../utils/crypto.utils.js";



// Fonction de création d'un utilisateur
const create = async(req, res) => {
    const { email, password, pseudo } = req.body;

    // Vérifier la validité de l'email
    //if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/[A-Z]/.test(email) || !/[!@#$%^&*(),.?":{}|<>]/.test(email))
    if (!email || !isEmail(email)) {
        return res.status(403).json({ message: `Invalid email !` });
    }

    // Vérifier la longueur du mot de passe
    if (!password || password.length <= 8) {
        return res
            .status(403)
            .json({ message: `Password must have at least 9 characters` });
    }

    // Vérifier la longueur du pseudo
    if (!pseudo || pseudo.length <= 4) {
        return res
            .status(403)
            .json({ message: `Pseudo must have at least 5 characters` });
    }

    // Hasher le mot de passe
    const hashResult = await hashPass(password);
    const hashError = hashResult.error;
    if (hashError) {
        return res.status(500).json({ message: hashError });
    }

    // Insérer l'utilisateur dans la base de données
    const response = await UsersDB.create(email, hashResult.hashed, pseudo);
    const responseError = response.error;

    if (responseError) {
        return res.status(500).json({ message: responseError });
    }

    // Récupérer l'ID de l'utilisateur créé
    const userId = response.result.insertId;

    return res.status(200).json({ message: "User created", user: userId });
};



// Fonction de connexion d'un utilisateur
const signIn = async(req, res) => {
    const { email, password } = req.body;

    // Vérifier la validité de l'email
    if (!email || !isEmail(email)) {
        return res.status(403).json({ message: `Invalid email` });
    }
    // Vérifier si le mot de passe est renseigné
    if (!stringIsFilled(password)) {
        return res.status(403).json({ message: `Invalid password` });
    }

    // Récupérer les informations de l'utilisateur depuis la base de données
    const response = await UsersDB.signIn(email);
    const responseErr = response.error;
    if (responseErr) {
        return res.status(500).json({ message: responseErr });
    }

    // Vérifier si l'utilisateur existe
    const result = response.result; // []
    const user = result[0];

    if (!user) {
        return res.status(401).json({ message: `Authentication failed` });
    }

    // Récupérer l'ID de l'utilisateur et le mot de passe haché de la base de données
    const userId = user.user_id;
    const dbPassword = user.password;

    // Comparer les mots de passe
    const passAreSame = await compareHash(password, dbPassword);
    if (!passAreSame) {
        return res.status(401).json({ message: `Authentication failed` });
    }

    //token : Générer un jeton JWT
    const token = jwtSign(userId);

    return res
        .status(200)
        .json({ message: `sign_in_ok`, user: { userId, email, token } });
};



// Fonction de lecture d'un utilisateur par son ID
const readUserById = async(req, res) => {
    try {
        // Extraire l'identifiant de l'utilisateur des paramètres de la requête
        const userId = req.params.userId;

        // Appeler la fonction readUserById de UsersDB (en supposant que c'est un utilitaire de base de données)
        const response = await UsersDB.readUserById(userId);
        const result = response.result;

        // Décommenter la ligne ci-dessous si vous souhaitez consigner le résultat de la base de données
        // console.log('Résultat de la base de données :', result);

        // Vérifier si l'utilisateur n'a pas été trouvé dans la base de données
        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Construire un objet utilisateur simplifié à partir du résultat de la base de données
        const user = {
            userId,
            email: result[0].email,
            pseudo: result[0].pseudo,
            role: result[0].role,
            // Ajouter d'autres propriétés de l'utilisateur au besoin
        };

        // Répondre avec les informations de l'utilisateur
        return res.status(200).json({ message: 'Request OK', user });
    }
    catch (error) {
        // Gérer les erreurs qui surviennent pendant le processus
        console.error('Error in readUser :', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



// Fonction de mise à jour d'un utilisateur
const update = async(req, res) => {
    const { userId } = req.params;
    const { email, password, pseudo } = req.body;

    try {
        console.log('User update. user ID :', userId);

        // Vérifier si l'ID utilisateur est présent
        if (!userId) {
            console.log('User ID is required');
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Vérifier la longueur du mot de passe
        if (password && password.length <= 8) {
            return res.status(403).json({ message: 'Password must have at least 9 characters' });
        }

        // Vérifier la longueur du pseudo
        if (pseudo && pseudo.length <= 4) {
            return res.status(403).json({ message: 'Pseudo must have at least 5 characters' });
        }

        let hashedPassword = null;

        // Hasher le nouveau mot de passe s'il est fourni
        if (password) {
            hashedPassword = await hashPass(password);
            const hashError = hashedPassword.error;

            if (hashError) {
                return res.status(500).json({ message: hashError });
            }
        }

        // Mettre à jour les informations de l'utilisateur dans la base de données
        const response = await UsersDB.update(userId, email, hashedPassword ? hashedPassword.hashed : null, pseudo);

        if (response.error) {
            console.error('Error updating user: ', response.error);
            return res.status(500).json({ message: 'Error updating user' });
        }

        console.log('User updated successfully.');
        return res.status(200).json({ message: `The user with the ID ${userId} has been updated` });
    }
    catch (error) {
        console.error('Error in update :', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



// Fonction de suppression d'un utilisateur
const deleteOne = async(req, res) => {
    // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
    const userId = req.params.userId;

    // Appeler la fonction deleteOne de UsersDB pour supprimer l'utilisateur de la base de données
    const response = await UsersDB.deleteOne(userId);
    console.log(response);

    let error = response.error;

    // Gérer les erreurs éventuelles lors de la suppression
    if (error) {
        return res.status(500).json({ message: error });
    }
    else {
        return res.status(200).json({ message: `user ${userId} deleted` });
    }
};



// Exporter un objet contenant toutes les fonctions du contrôleur des utilisateurs
export const UsersController = {
    create,
    signIn,
    readUserById,
    update,
    deleteOne
};


//En résumé, ce module gère les opérations CRUD (Create, Read, Update, Delete) pour les utilisateurs d'une application, 
//en utilisant une base de données (UsersDB). Il intègre également des mécanismes de validation et de sécurité, tels que 
//la vérification des emails, le hachage des mots de passe et l'utilisation de jetons JWT pour l'authentification.
