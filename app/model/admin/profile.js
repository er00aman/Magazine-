import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    uploadYourFile: {  
        type: String,
        required: true, 
    },
    createdAt: {
        type: Date,
        default: new Date().getTime(),
    },
    updatedAt: {
        type: Date,
        default: new Date().getTime()
    }
})

const profileModel = mongoose.model("adminProfile",profileSchema)
export default profileModel