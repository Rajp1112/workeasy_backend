import Review from '../models/review-model.js';
import User from '../models/user-models.js';
import { getSocketInstance } from '../utils/socket.js';

// Home Logic
export const home = async (req, res) => {
  try {
    res.status(200).send('Welcome to WorkEasy Backend 🚀');
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Register Logic
export const register = async (req, res) => {
  console.log('Register request body:', req.body);

  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      postal_code,
      address,
      city,
      role,
      skills,
      experience,
      hour_rate,
      bio,
      available,
      profileImage,
    } = req.body;

    // check if email exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // Generate auto-increment ID (only for workers, you can adapt for all roles)
    let numericId = 1;
    if (role === 'worker') {
      const lastWorker = await User.find({ role: 'worker' })
        .sort({ createdAt: -1 })
        .limit(1);
      if (lastWorker.length > 0) {
        numericId = lastWorker[0].numericId + 1;
      }
    }

    // create new user
    const userCreated = await User.create({
      first_name,
      last_name,
      email,
      password,
      phone,
      postal_code,
      address,
      city,
      role: role || 'customer',
      numericId, // Add numericId here
      skills: skills ? (Array.isArray(skills) ? skills : [skills]) : [],
      experience,
      hour_rate,
      bio,
      available: available === 'true' || available === true,
      profileImage,
    });

    res.status(201).json({
      msg: 'Registration Successful',
      token: await userCreated.generateToken(),
      userId: userCreated.numericId, // now use numeric ID
      role: userCreated.role,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Login Logic
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await userExist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    res.status(200).json({
      msg: 'Login successful',
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
      role: userExist.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const user = async (req, res) => {
  try {
    const userData = req.user;

    let enrichedUser = userData.toObject();

    // If user is a worker, include reviews and average rating
    if (userData.role === 'worker') {
      const reviews = await Review.find({ worker_id: userData._id }).populate(
        'customer_id',
        'first_name last_name email'
      );

      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating =
        reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : null;

      enrichedUser.reviews = reviews;
      enrichedUser.averageRating = averageRating;
    }

    return res.status(200).json({
      user: enrichedUser,
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const fetchWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('-password');

    const workersWithReviews = await Promise.all(
      workers.map(async (worker) => {
        const reviews = await Review.find({ worker_id: worker._id }).populate(
          'customer_id',
          'first_name last_name email'
        );

        // Calculate average rating
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating =
          reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : null;

        return {
          ...worker.toObject(),
          reviews,
          averageRating,
        };
      })
    );

    return res.status(200).json({ workers: workersWithReviews });
  } catch (error) {
    console.error('Fetch workers error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { workerId, available } = req.body || {};

    if (!workerId || typeof available !== 'boolean') {
      return res.status(400).json({ msg: 'Invalid request data' });
    }

    const worker = await User.findOne({ _id: workerId, role: 'worker' });

    if (!worker) {
      return res.status(404).json({ msg: 'Worker not found' });
    }

    worker.available = available;
    await worker.save();

    const io = getSocketInstance();
    io.emit('workerAvailabilityUpdated', {
      workerId: worker._id,
      available: worker.available,
    });

    res.status(200).json({
      msg: 'Availability updated successfully',
      available: worker.available,
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
