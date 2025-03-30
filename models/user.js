const mongoose = require("mongoose");
const { createHmac, randomBytes } = require('crypto');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "/images/Avatar.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }

}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    
    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashedpassword = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');

    this.salt = salt;
    this.password = hashedpassword;        

    next();
});

userSchema.static("matchPassword", async function (email,password){
    const user = await this.findOne({email});
    if (!user) return new Error("User Not Found!");

    const salt = user.salt;
    const hashedpassword = user.password;
    const userProvidedHash = createHmac("sha256",salt)
        .update(password)
        .digest("hex")
    if (hashedpassword !== userProvidedHash){
        return new Error("Incorrect Email or Password");
    }
    user.password = undefined;
    user.salt = undefined;
    return {...user };    
})

const User = mongoose.model("user", userSchema);

module.exports = User;