import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String, required: true }
    },
    role: {
        type: String,
        enum: ["admin", "basic"],
        default: "basic"
    },
    fineAmount:{ 
      type:Number, default:0 
    },
    banned:{ type:Boolean, default:false },
    banExpires: {
        type: Date,
        default: null
    },
    borrowHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Borrow"
    }]
}, {timestamps: true});
//createdat and updatedat fields are automaticallu added into the document

export const User = mongoose.model('User', userSchema);