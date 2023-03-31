const mongoose = require('mongoose');


const jobApplicationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    experience: {
      type: Number,
      required: true
    },
    github: {
      type: String,
      required: true
    },
    linkedin: {
      type: String,
      required: true
    }
    
  });

  const model = mongoose.model('JobSeeker', jobApplicationSchema);

  module.exports = model;