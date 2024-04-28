import conn from './conn.js'

export async function registerUser(username, password_md5, email){
    const sql = `INSERT INTO users (username, password_md5, email) VALUES ($1, MD5($2), $3)`;
    await conn.query(sql, [username, password_md5, email]);
    return true;
}

export async function loginUser(username, password_md5){
    const sql = `SELECT * FROM users WHERE username = $1 AND password_md5 = MD5($2)`;
    const result = await conn.query(sql, [username, password_md5]);
    return result.rows[0] > 0 ? result.rows[0] : 'Invalid username or password.';
}

export async function getUserById(id){
    const sql = `SELECT * FROM users WHERE id = $1`;
    const result = await conn.query(sql, [id]);
    return result.rows[0].length > 0 ? result.rows[0] : 'No user found.';
}

export async function getPosts(){
    const result = await conn.query(`SELECT * FROM blog_posts`);
    return result.rows.length > 0 ? result.rows : 'No posts found.';
}
