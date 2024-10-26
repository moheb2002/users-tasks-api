import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: validator.isEmail, 
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 8 && /[A-Z]/.test(v) && /\d/.test(v);
      },
      message: () => `Password must be at least 8 characters long, contain at least one uppercase letter, and one number!`
    }
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], 
}, {
  timestamps: true,
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();  
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();  
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
