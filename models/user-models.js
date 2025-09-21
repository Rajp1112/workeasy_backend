const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Base user schema
const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Common fields
    phone: { type: String },
    profileImage: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },

    // Role-based: customer / worker / admin
    role: {
      type: String,
      enum: ["customer", "worker", "admin"],
      default: "customer",
    },

    // Customer-specific fields
    address: String,
    city: String,
    postal_code: String,

    // Worker-specific fields
    skills: [String],
    experience: String,
    hour_rate: String,
    bio: String,
    available: { type: Boolean, default: true },

    // Admin-specific fields
    permissions: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRound = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRound);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate JWT
userSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
  } catch (error) {
    console.error(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
