import conn from './conn.js'

export async function registerUser(username, password_md5, email){
    const sql = `INSERT INTO users (username, password_md5, email) VALUES ($1, MD5($2), $3)`;
    await conn.query(sql, [username, password_md5, email]);
    return true;
}


export async function loginUser(username, password_md5){
    const sql = `SELECT * FROM users WHERE username = $1 AND password_md5 = MD5($2)`;
    const result = await conn.query(sql, [username, password_md5]);
    return result.rows[0];
}
