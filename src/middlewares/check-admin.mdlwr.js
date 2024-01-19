import query from "../databases/init.db.js";

const checkAdmin = async(req, res, next) => {
  const userId = req.body.userId;

  const userSql = `
    SELECT user_id, role
    FROM users
    WHERE user_id = ?
  `;

  const userRes = await query(userSql, [userId]);
  const user = userRes[0];
  const role = user.role;

  if (role !== "admin") {
    return res
      .status(401)
      .json({ message: `You don't have the right` });
  }

  next();
};

export default checkAdmin;
