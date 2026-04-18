const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger').logger;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

exports.register = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ error: 'Name, email, and password are required!' });
    }

    const [existsUser] = await db.execute('SELECT id FROM users WHERE email = ?', [email.trim()]);
    if (existsUser.length > 0) return res.status(400).json({ error: 'User already exists!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users(name,email,password) VALUES(?,?,?)', [
      name.trim(),
      email.trim(),
      hashedPassword
    ]);

    return res.status(201).json({ success: 'User registered successfully!' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ error: 'Email and password are required!' });
    }

    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email.trim()]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid email or password!' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password!' });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await db.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);
    logger.info('User login successful');
    return res.status(200).json({
      success: 'Login successfully',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error)
  }
};

exports.logout = async (req, res,next) => {
  try {
    const { refreshToken } = req.body;
    if (!isNonEmptyString(refreshToken)) {
      return res.status(400).json({ error: 'Refresh token required!' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired refresh token!' });
    }

    const [result] = await db.execute(
      'SELECT id FROM users WHERE id = ? AND refresh_token = ?',
      [decoded.id, refreshToken]
    );

    if (result.length > 0) {
      await db.execute('UPDATE users SET refresh_token = NULL WHERE id = ?', [decoded.id]);
    }

    return res.status(200).json({ success: 'Logged out successfully!' });
  } catch (error) {
    next(error)
  }
};

exports.refreshToken = async (req, res,next) => {
  const { refreshToken } = req.body;
  try {
    if (!isNonEmptyString(refreshToken)) {
      return res.status(401).json({ error: 'Refresh token required!' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired refresh token!' });
    }

    const [result] = await db.execute(
      'SELECT id, role, refresh_token FROM users WHERE id = ? AND refresh_token = ?',
      [decoded.id, refreshToken]
    );

    if (result.length === 0) {
      return res.status(403).json({ error: 'Refresh token not valid!' });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: result[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, role: result[0].role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await db.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [newRefreshToken, decoded.id]);

    return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

