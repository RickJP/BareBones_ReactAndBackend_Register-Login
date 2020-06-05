const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id
  });
});

router.post('/register', async (req, res) => {
  try {
    const {email, password, passwordCheck} = req.body;
    let { displayName } = req.body;

    if (!email || !password || !passwordCheck)
      return res.status(400).json({msg: 'You are missing something!'});
    if (password.length < 5)
      return res
        .status(400)
        .json({msg: 'The password must be at least 5 characters long'});
    if (password !== passwordCheck)
      return res.status(400).json({msg: 'The passwords must match!'});

    if (!displayName) displayName = email;

    const existingUser = await User.findOne({email});
    if (existingUser)
      return res.status(400).json({msg: 'Email already exists'});

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt );

    const newUser = new User({ 
      email,
      password: passwordHash,
      displayName
     });
     const savedUser = await newUser.save();

     console.log('REGISTERED ' + savedUser);
     res.json(savedUser);

    
    
  } catch (err) {
    res.status(500).json({ err: err.message});
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
     return res.status(400).json({msg: 'You are missing something!'});

    const user = await User.findOne({ email});
    if (!user) 
      return res.status(400).json({msg: 'No account with this email has been registered'});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({msg: 'Login info not correct'});

    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        displayName:  user.displayName,
      }
    });
  } catch (err) {

  }
})

router.delete('/delete', auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);

  } catch (err) {
      res.status(500).json({ err: err.message});
  }
})

router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.json(false);

    const verified = await jwt.verify(token, process.env.SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ err: err.message});
  }
})

module.exports = router;
