import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: '',
    },
    countryCode: {
      type: String,
      default: '+91',
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    isAlreadyRegister: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      default: 1234,
    },
    deviceToken: {
      type: String,
      default: null, // 1-android 2-ios 
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: new Date().getTime(),
    },
    updatedAt: {
      type: Date,
      default: new Date().getTime(),
    },
    language: {
      type: String,
      default: 'en',
    },
    lastLogin: {
      type: Number,
      default: new Date().getTime(),
    },
    isDeleted: { 
      type: Boolean,
      default: false, 
    },
  },
  {
    strict: true,
    collection: 'Users',
    versionKey: false,
  }
);

userSchema.index({
  location: '2dsphere'
});

const UserModel = mongoose.model('Users', userSchema);
export default UserModel;
