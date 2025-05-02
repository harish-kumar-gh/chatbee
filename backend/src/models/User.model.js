import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required: true,
    },
    email: {
        type:String,
        required: true,
        unique: true,
    },
    password: {
        type:String,
        required: true,
        minlength: 8,
    },
    bio: {
        type:String,
        default: ""
    },
    profilePic: {
        type:String,
        default: ""
    },
    nativeLanguage:{
        type:String,
        default: ""
    },
    learningLanguage:{
        type: String,
        default: ""
    },
    location:{
        type:String,
        default: ""
    },
    isOnboarded:{
        type: Boolean,
        default: false,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]

}, {timestamps:true})

// prehook to hash the password (don't use arrow function cause it wil cause problem with this.password)
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // random string added to the password before hashing to prevent 2 same passwords to have the same hash
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function(enteredPassword){
    const isPasswordCorrect = bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
}

const User = mongoose.model("User", userSchema);




export default User;