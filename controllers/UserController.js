import User from '../models/User.js';
import * as argon2 from 'argon2';
import generateToken from '../utils/generateToken.js';

const logout = (_req, res) => {
  try {
    // clear cookie in browser;
    // res.clearCookie('token');
    // clear token in localStorage on the frontend
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  // console.log(username, password);
  try {
    // check if username already exists
    console.log('start check if username exists');
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
      console.log('username already exists');
      return res.status(409).json({ message: 'Username already exists' });
    }

    console.log('username does not exist');

    // hash password
    const hashedPassword = await argon2.hash(password);
    console.log('hashed password', hashedPassword);

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      likes: [],
    });

    console.log('create user: ', user);

    // generate JWT token
    const token = generateToken(user._id, username);
    console.log('token: ', token);

    // // send token in cookie
    // res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    // send token in response
    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, email, password } = req.body;
  // check username or email
  try {
    // check if username already exists
    let user;
    if (email) {
      user = await User.findOne({ email }).select('password').lean().exec();
    }

    if (username) {
      user = await User.findOne({ username }).select('password').lean().exec();
    }

    if (!user) {
      return res.status(401).json({ message: 'user not found!' });
    }

    // chheck if pwd is right
    const isPasswordCorrect = await argon2.verify(user.password, password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'wrong password!' });
    }

    // check if user is admin
    let isAdmin = false;
    if (username === 'admin') {
      isAdmin = true;
    }

    // generate JWT token
    const token = generateToken(user._id, username);

    // send token in response
    return res.status(200).json({ token, isAdmin });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const editInfo = async (req, res) => {
  // console.log(req.body)
  const { username } = req.body.user;
  const { newName, oldPwd, newPwd } = req.body;

  // check username, remove lean function
  try {
    const user = await User.findOne({ username }).select('password');
    // .lean()
    // .exec();

    if (!user) {
      return res.status(401).json({ message: 'user not found!' });
    }

    // chheck if pwd is right
    const isPasswordCorrect = await argon2.verify(user.password, oldPwd);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'wrong old password!' });
    }

    // update user
    if (newName) {
      user.username = newName;
    }
    if (newPwd) {
      const hashedNewPwd = await argon2.hash(newPwd);
      user.password = hashedNewPwd;
    }

    // save user to db
    await user.save();

    // generate JWT token

    const token = generateToken(user._id, user.username);
    console.log('new token: ', token);

    // send token in cookie
    // res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    // send token in response
    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const verifyJWT = async (req, res) => {
  const { id, username } = req.body.user;
  // console.log("userid, username: ", id, username)
  try {
    const user = await User.findById(id).select('password').lean().exec();
    if (!user) {
      return res.status(401).json({ message: 'user not found!' });
    }

    return res.status(200).json({ message: 'user verified' });
  } catch (err) {
    console.log(err);
  }
};

async function fetchFavoriteList(req, res) {
  // console.log(req.body.user);
  const { id } = req.body.user;

  try {
    const user = await User.findById(id)
      .select('likes')
      .populate('likes')
      .lean()
      .exec();
    if (!user) {
      return res.status(401).json({ message: 'user not found!' });
    }
    return res.status(200).json({ products: user.likes });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}

async function removeFavorite(req, res) {
  const productID = req.params.id;
  // console.log(productID);
  const { id: userID } = req.body.user;
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(401).json({ message: 'user not found!' });
    }

    const index = user.likes.indexOf(productID);
    if (index !== -1) {
      user.likes.splice(index, 1);
      await user.save();
      return res
        .status(200)
        .json({ message: 'product removed from favorites' });
    }

    return res.status(200).json({ message: 'product not found in favorites' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}

async function favoriteProduct(req, res) {
  const productID = req.params.id;
  // console.log(productID);
  const { id: userID } = req.body.user;
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(401).json({ message: 'user not found!' });
    }

    const index = user.likes.indexOf(productID);
    if (index === -1) {
      user.likes.push(productID);
      await user.save();
      return res.status(200).json({ message: 'product added to favorites' });
    }

    return res.status(200).json({ message: 'product already in favorites' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}

const getAdminData = async (req, res) => {
  const { username } = req.body.user;
  if (username !== 'admin') {
    return res.status(401).json({ message: 'unauthorized role' });
  }

  try {
    const users = await User.find().populate('likes').lean().exec();
    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export {
  getAdminData,
  register,
  login,
  editInfo,
  logout,
  fetchFavoriteList,
  verifyJWT,
  removeFavorite,
  favoriteProduct,
};
