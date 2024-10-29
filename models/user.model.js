import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
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
        return passwordRegex.test(v);
      },
      message: () => `Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character!`
    }
  },
  tasks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  }],
  tokens: [{  
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 8; 
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();  
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_key';
  const token = jwt.sign({ _id: this._id.toString() }, secretKey, {
    expiresIn: '1h',
  });
  
  this.tokens.push({ token });
  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

userSchema.statics.findByToken = async function (token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return await this.findOne({ _id: decoded._id, 'tokens.token': token });
};

const User = mongoose.model('User', userSchema);

export default User;
