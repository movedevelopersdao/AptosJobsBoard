
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const JobSeeker = require('./models/jobSeeker');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const path = require('path');
const Job = require('./models/job');
const multer = require('multer');
require('dotenv').config();

let port = process.env.PORT || 3005;

const username = process.env.DB_USER_NAME;
const pass = process.env.DB_PASSWORD;

// Set up Multer to handle file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/companies-logo')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new Error('Only PNG and JPEG images are allowed'))
    }
    cb(null, true)
  },
  limits: {
    fileSize: 1024 * 1024 * 2 // 2 MB
  }
});

app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(`mongodb+srv://${username}:${pass}@jobsboardcluster.ljtw9cg.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{console.log("connected db")})
.catch(err => console.log(err));




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({urlencoded: false}));


app.get('/applyToJob/:id', async (req, res) => {
  const jobId = req.params.id;
  const jobs = await Job.find();
  const job = jobs.find(j => j.id === jobId);
  res.render('applyJob', {job});
});


app.get('/', async (req,res)=>{

  
  try {
    const jobs = await Job.find().sort('-createdAt');
    res.render('mainPage', { jobs });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }


  
})

app.get('/job-preview/:id', async (req, res) => {
  const jobId = req.params.id;
  const jobs = await Job.find();
  const job = jobs.find(j => j.id === jobId);
  res.render('jobPreview', { job });
});


app.get('/search', async (req, res) => {
  


  
const query = req.query;
const titleQuery = query.title ? { $or: [
  { companyName: { $regex: query.title, $options: 'i' } },
  { role: { $regex: query.title, $options: 'i' } },
  { keywords: {$regex: query.title, $options: 'i'}},
  { typeOfPosition: {$regex: query.title, $options: 'i'}},
  { domain: {$regex: query.title, $options: 'i'}}
]} : {};
const locationQuery = query.location ? { $or: [{location: { $regex: query.location, $options: 'i' }}, { remote: { $regex: query.location, $options: 'i' }} ] } : {};
const jobs = await Job.find({ $and: [titleQuery, locationQuery] });
res.render('mainPage', {jobs});
});


// Handling a POST requestg
app.post('/submitProfile',(req, res) => {
  // Handle form submission data here
  const jobApplication = new JobSeeker({
    name: req.body.name,
    email: req.body.email,
    experience: req.body.experience,
    github: req.body.github,
    linkedin: req.body.linkedin,
  });
 

 

  jobApplication.save()
    .then(() => {
      console.log('Job application saved to database');
      res.render('success', { jobApplication });

    })
    .catch(err => {
      console.error('Error saving job application to database', err);
      res.status(500).send('Error saving job application');
    });
});

app.get('/newjob', (req,res)=>{
  res.render('newJob');
})

app.post('/postJob',upload.single('photo') , async (req, res)=>{


  const {companyName, role, typeOfPosition, description, keywords, mail, domain, location, remote, currency, amount } = req.body;
  // const { title,role, description, compensation, location, type, email, responsibilities,keywords } = req.body;
  let remoteString;
  if (remote == "on"){
    remoteString = "remote";
  }else{
    remoteString = "";
  }
  console.log(req.body);
  const keywordsArray = keywords.split(" ")
 
  try {
    const job = new Job({
      companyName,
      role,
      typeOfPosition: typeOfPosition[0],
      description,
      keywordsArray,
      mail,
      domain,
      location,
      remote: remoteString,
      currency,
      amount,
      photo: req.file.filename
    });
    await job.save();
    res.json({msg : "redirected"});
  } catch (error) {
    console.error(error);
    res.render('error');
  }

})



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
