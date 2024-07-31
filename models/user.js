const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// Define the User schema with email and password fields
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email can not be blank!"] // Email is required with a custom error message
  },
  password: {
    type: String,
    required: [true, "Password can not be blank!"] // Password is required with a custom error message
  }
});

// Static method to find a user by email and validate the password
userSchema.statics.findAndValidate = async function(email, password){
    // Find the user by email
    const foundUser = await this.findOne({ email })
    if (!foundUser) {
        return false; // Return false if no user is found
    }
    // Compare the provided password with the stored hashed password
    const isValid = await bcrypt.compare(password, foundUser.password)
    return isValid ? foundUser : false; // Return the user if valid, otherwise false
}

// Middleware to hash the password before saving the user document
userSchema.pre('save', async function(next) {
    // If the password field is not modified, proceed to the next middleware
    if(!this.isModified('password')) return next();
    // Hash the password with a salt factor of 12
    this.password = await bcrypt.hash(this.password, 12);
    next(); // Proceed to the next middleware
})

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
