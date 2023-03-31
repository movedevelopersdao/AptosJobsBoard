const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  compensation: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  
  responsibilities: {
    type: [String],
    required: true
  },
  keywords: {
    type: [String],
    required: true
  },
  photo: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Job', jobSchema);
