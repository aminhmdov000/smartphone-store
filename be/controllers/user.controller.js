const db = require('../config/db');
exports.getProfile = async(req,res,next) => {
  const userID = req.user.id;
  try {
    const [result] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userID]);
    if(result.length === 0) return res.status(404).json({error: 'User not found!'});
    return res.status(200).json(result[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async(req,res,next) => {
  const userID = req.user.id;
  const {name, email} = req.body;
  try {
    if(!(typeof name === 'string' && name.trim()) || !(typeof email === 'string' && email.trim())) return res.status(400).json({error: 'Name and E-mail are required!'});
    const Name = name.trim();
    const Email = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email);
    if (!isValidEmail) return res.status(400).json({error: 'Enter a valid email address!'});
    const [result] = await db.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [Name, Email, userID]);
    if(result.affectedRows === 0 ) return res.status(404).json({error: 'User not found!'});
    const [users] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [userID]);
    if(result.changedRows === 0 ) return res.status(200).json({success: 'No profile changes detected!', user: users[0]});
    return res.status(200).json({success: 'Profile updated successfully!', user: users[0]});
  } catch (error) {
    next(error)
  }
};

exports.removeProfile = async(req,res,next) => {
  const userID = req.user.id;
  try {
    const [query] = await db.execute(`DELETE FROM users WHERE id = ?`, [userID]);
    if(query.affectedRows === 0) return res.status(404).json({error: 'User not found or data not removed!'});
    return res.status(200).json({success: 'Profile removed successfully!'});
  } catch (error) {
    next(error);
  }
};

// only admin
exports.getUsers = async(req,res,next) => {
  try {
    const [users] = await db.execute('SELECT id, name, email, role, created_at FROM users');
    return res.status(200).json(users)
  } catch (error) {
    next(error);
  }
}

// only admin
exports.removeUser = async(req,res,next) => {
  const userID = req.params.id;
  try {
    const [user] = await db.execute('DELETE FROM users WHERE id = ?', [userID]);
    if(user.affectedRows === 0) return res.status(404).json({error: 'User not found!'});
    return res.status(200).json({success: 'User removed successfully!'});
  } catch (error) {
    next(error);
  }
}
