import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  publicationType: {
    type: String,
    required: true,
  },
  plans: {
    type: String,
    required: true,
  },
  uploadYourFile: {  
    type: String,
    required: true, 
  },
  chooseYourThumbnail: {  
    type: String,
    required: true,
  },
  isDeleted: { 
    type: Boolean,
    default: false, 
},
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const publisherModel = mongoose.model('publisher account', publisherSchema);
export default publisherModel;
