import query from "./init.db.js";

const readAll = async() => {
    const sql = `
        SELECT category_id, name
        FROM categories
        ORDER BY name
    `;

    let error = null;
    let result = null;

    try {

        result = await query(sql);
    }
    catch (e) {
        error = e.message;
    }
    finally {
        return { error, result };
    }
};



export const CategoriesDB = {
    readAll,
};
