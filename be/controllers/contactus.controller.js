const db = require('../config/db');
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
exports.contactUs = async(req,res,next) => {
  const {email,subject,message} = req.body;
  if(!isNonEmptyString(email) || !isNonEmptyString(subject) || !isNonEmptyString(message)) return res.status(400).json({error: 'All fields are required!'});
  try {
    const [result] = await db.execute('INSERT INTO messages(email,subject,message) VALUES(?,?,?)', [email,subject,message]);
    if(!result || result.affectedRows === 0) return res.status(400).json({error: 'Message could not be saved!'});
    res.status(201).json({
      success: 'Message sent successfully!',
      id: result.insertId
    });
  } catch (err) {
    next(err)
  }
};
