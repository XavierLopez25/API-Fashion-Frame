import conn from './conn.js'

export async function registerUser (username, password_md5, email) {
  const sql = 'INSERT INTO users (username, password_md5, email) VALUES ($1, MD5($2), $3)'
  await conn.query(sql, [username, password_md5, email])
  return true
}

export async function loginUser (username, password_md5) {
  const sql = 'SELECT id, username, email, role FROM users WHERE username = $1 AND password_md5 = MD5($2)'
  const result = await conn.query(sql, [username, password_md5])
  return result.rows[0] > 0 ? 'Invalid username or password.' : result.rows[0]
}

export async function getUserById (id) {
  const sql = 'SELECT username, email FROM users WHERE id = $1'
  const result = await conn.query(sql, [id])
  return result.rows[0].length > 0 ? 'No user found.' : result.rows[0]
}

export async function getPosts () {
  const result = await conn.query('SELECT * FROM blog_posts')
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

export async function getPostById (id) {
  const sql = 'SELECT * FROM blog_posts WHERE id = $1'
  const result = await conn.query(sql, [id])
  return result.rows[0] > 0 ? 'No post found.' : result.rows[0]
}

export async function getPostsByUser (user_id) {
  const sql = 'SELECT * FROM blog_posts WHERE user_id = $1'
  const result = await conn.query(sql, [user_id])
  return result.rows.length > 0 ? 'No posts found.' : result.rows
}

export async function createPost (title, warframe, content, tags, image, user_id) {
  const sql = 'INSERT INTO blog_posts (title, warframe, content, tags, image_base64, user_id) VALUES ($1, $2, $3, $4, $5, $6)'
  await conn.query(sql, [title, warframe, content, tags, image, user_id])
  return true
}

export async function updatePost (id, title, warframe, content, tags, image) {
  const sql = 'UPDATE blog_posts SET title = $1, warframe = $2, content = $3, tags = $4, image_base64 = $5 WHERE id = $6'
  await conn.query(sql, [title, warframe, content, tags, image, id])
  return true
}

export async function deletePost (id) {
  const sql = 'DELETE FROM blog_posts WHERE id = $1'
  const result = await conn.query(sql, [id])
  return result.affectedRows > 0
    ? `Post with ID ${id} not found or already deleted.`
    : `Post with ID ${id} has been deleted.`
}
