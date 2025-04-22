import { User } from '../models/index.js';

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-__v')
      .populate('agencyId', 'name');
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v')
      .populate('agencyId', 'name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Create a new user
export const addUser = async (req, res, next) => {
  try {
    const { name, email, password, role, agencyId } = req.body;
    const user = new User({ name, email, password, role, agencyId });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);  
  }
};

// Update a user
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role, agencyId } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, password, role, agencyId }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};


