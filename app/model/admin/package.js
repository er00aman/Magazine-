import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    features: {
        numberOfVisitors: {
            type: Number,
            required: true
        },
        demographic: {
            type: String,
            required: true
        },
        numberOfDevice: {
            type: Number,
            required: true
        }
    },
    duration: {
        type: String,
        default: "Yearly"
    },
    isDeleted: { 
        type: Boolean,
        default: false, 
    },
    createdAt: {
        type: Date,
        default: new Date().getTime(),
    },
    updatedAt: {
        type: Date,
        default: new Date().getTime()
    }
});

const plansModel = mongoose.model("packages", planSchema);
export default plansModel;
