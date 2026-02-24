const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    agreeToTerms: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'workspace_owner'],
      default: 'user'
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space'
      }
    ],
    subscriptionPlan: {
      type: String,
      enum: ['none', 'user_basic', 'user_pro', 'owner_basic', 'owner_pro'],
      default: 'none'
    },
    subscriptionStatus: {
      type: String,
      enum: ['inactive', 'active'],
      default: 'inactive'
    },
    subscriptionForRole: {
      type: String,
      enum: ['user', 'workspace_owner', null],
      default: null
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
const User = mongoose.model('User', userSchema);
module.exports = User;