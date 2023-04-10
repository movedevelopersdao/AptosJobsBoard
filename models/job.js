const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },

  typeOfPosition: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  keywordsArray: {
    type: [String],
    required: true
  },

  mail: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  website: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  
  location: {
    type: String,
    
  },
  remote: {
    type: String,
    
  },
  currency: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  
  
  photo: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Job', jobSchema);
