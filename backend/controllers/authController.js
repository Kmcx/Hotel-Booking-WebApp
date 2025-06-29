const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token oluşturucu
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, isMember: user.isMember },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, country, city, isMember } = req.body;
    const file = req.file;

    
    const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters, include 1 number and 1 special character',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const photoPath = file ? `/uploads/${file.filename}` : undefined;

    const user = new User({
      name,
      email,
      password,
      country,
      city,
      isMember,
      photo: photoPath
    });

    await user.save();
    const token = createToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = createToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
