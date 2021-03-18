/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const validator = require('express-validator')
const mongoose = require('mongoose')
const path = require('path')
const Organization = require('./models/organization.model')
const User = require('./models/user.model')

const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';




app.use(express.json())
app.use(cookieParser())

// app.use(orgRouter)
// app.use(usersRouter)

//app.use(express.static(path.join(__dirname, 'build')))


// app.use(session({
//     secret:'lafjekjfo39rt0t4-))_R03i9rt4#REW"QR#', // value here can be anything
//     resave: true,
//     saveUninitialized: true
// }))

const buildPath = __dirname + '/build/'

app.use(express.static(buildPath))

const url = "mongodb+srv://admin:USM123@cluster0.wl7k0.mongodb.net/CSCProjectDatabase?retryWrites=true&w=majority";


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('error', ()=> console.log('Error Connecting to Datbase'))
mongoose.connection.on('disconnect', ()=> {
    console.log('Disconnected from Server')
    return
})
mongoose.connection.on('connected', ()=> {


    

    const checkLoginStatus = (req, res)=>{

       
        if(req.cookies.currentUser){
            res.send({user: req.cookies.currentUser})
        }
        else{
          
            res.send({loggedIn: false})
        }
    }

    const clearCookie = (req,res)=>{

        res.clearCookie('currentUser')
        return res.sendStatus(200).send('cookie Cleared')
    }

    const authenticateUser =(req, res)=>{
    
        //Check the database for the email 
        // if that email exists make sure the entered password 
        //is the same as the password in the database
        //{email, password}
        //if those checks don't pass send a response of format {error: 'string'}
        // I am not sure how to keep track of if someone is logged in or not 

        // make sure that the email exist in the database
        // compare the password field of the request to the password in the database
        //
    
        //cookies
    
        let email = req.body.email
        let password = req.body.password

        
        User.findOne({email: email}, (err, user)=>{

            if(!user){
                res.send({error: 'Invalid Email or Password'})
            }else{

                let match = bcrypt.compareSync(password, user.password)
                if(match){
                    
                    res.cookie('currentUser', user.email,{
                        maxAge: 60*60*100,
                        httpOnly: true,
                        //secure: true,
                        sameSite: true,

                    }).send({success: true})
                }
                else{
                    res.send({error: 'Invalid Email or Password' })
                }
            }
        })    
    }

    const createUser = (req, res)=>{
    
        //{name, email, password, confirmPassword, error}
        //if no errors set req.session.loggedin = true and req.session.userId = the new id of the user
        let name = req.body.name
        let email = req.body.email
        let password = req.body.password
        let SALT = 10

        
        User.findOne({email: email}, (err,user)=>{

            
            if(user){
                res.send({error: 'This email is already regisered'})
            }else{

                bcrypt.genSalt(SALT, (err, salt)=>{
                    if(err){
                        console.log(err)
                        return
                    }
                    bcrypt.hash(password, salt,(err,hash)=>{

                        if(err){
                            console.log(err)
                            return
                        }
                        const newUser = new User({

                            _id: mongoose.Types.ObjectId(),
                            name: name,
                            email: email,
                            password: hash

                        })
                        newUser.save((err, response)=>{
                            if(err){
                                console.log(err)
                                return
                            }
                            console.log('User added to Database')
                            res.cookie('currentUser', newUser.email,{
                                maxAge: 60*60*100,
                                httpOnly: true,
                                //secure: true,
                                sameSite: true,

                            }).send({success: true})
                            
                        })
                    })
                })
            }
        })  
    }

    const createOrg = (req,res)=> {

        //Insert this data to the database to create a new club
        //{name, location, about}
        const name = req.body.name
        const location = req.body.location
        const about = req.body.about
    
       
    
        const newOrg = new Organization({
    
            _id: mongoose.Types.ObjectId(),
            name: name,
            location: location,
            about: about,
            members:[{user_email: req.cookies.currentUser, status: 'Leader'}]
        })
        
        
        newOrg.save()
        .then(User.findOneAndUpdate({email: req.cookies.currentUser}, { "$push": {OrganizationsJoined: {org_id: newOrg._id}}}, 
        (err)=> {
            if(err){
                console.log(err)
                res.send({error: 'Could not add organization leader'})
            }
        }))
        .then(()=>res.send({success: true}))
        .catch(err => { 
            console.log(err)
            res.send({error: 'There has been a server error'})
            
        })
        //log error to file and send general error
    }
    const getAllOrgs = (req,res) => {

      console.log('getting Orgs')

        const query = Organization.find({}).select('name location') 
    
    
        query.exec((err,result)=>{
            if(err){
                console.log(err)
            }else{
                //delete result._id
                res.send(result)
            }
        })
    }

    const getUserOrgs = (req, res)=>{

        

        const query = User.findOne({email: req.cookies.currentUser}).select('OrganizationsJoined') 
        
        query.exec((err,result)=>{
            if(err){
                console.log(err)
            }else{

                let userOrgs = []
                result.OrganizationsJoined.forEach(element => {

                    
                    const FindOrg =  Organization.findOne({_id: element.org_id}).select('name location ')
                    FindOrg.exec((err, data)=>{

                        if(err){
                            console.log(err)
                        }else{
                            userOrgs.push(data)
                        }

                    })
                

                    
                });
                res.send(userOrgs)
            }
        
        })
    }


    const createAnnouncement = (req,res) => {

        Organization.findByIdAndUpdate({_id: req.body.id},
        { "$push": {announcements: {title: req.body.title, content: req.body.content}}}, (err) => {
            if (err){
                console.log(err);
                res.send({error: "Could not add announcement :("})
            }else{
                res.send({success: "Announcement added successfully :)"})
            }
        })
        
    }
    const createEvent =(req, res) => {

        Organization.findByIdAndUpdate({_id: req.body.id},{ 
            "$push": {
                events: {
                    name: req.body.name, 
                    address: req.body.address, 
                    date: req.body.date, 
                    time: req.body.time,
                    description: req.body.description }}}, (err) => {
                        if(err){
                            console.log(err);
                            res.send({error: "Could not add event"})
                        }
                        else{
                            res.send({success: "Event added successfully!"})
                        }
                    })
    }

    const getEvents = (req,res)=>{

      let id = req.body.id

      Organization.findOne({_id: id}, (err,org)=>{

        if(err){
          console.log(err)
          res.send({error: 'Internal Server Error'})
        }

        res.send(org.events)
      })



    }

    const getAnnouncements = (req,res)=>{

      let id = req.body.id

      Organization.findOne({_id: id}, (err,org)=>{

        if(err){
          console.log(err)
          res.send({error: 'Internal Server Error'})
        }

        res.send(org.announcements)
      })



    }
    const getMembers = (req,res)=>{

      let id = req.body.id

      Organization.findOne({_id: id}, (err,org)=>{

        if(err){
          console.log(err)
          res.send({error: 'Internal Server Error'})
        }

        res.send(org.members)
      })



    }
    const getMemberStatus = (req,res)=>{

      let id = req.body.id
      let user_email = req.cookies.currentUser


      if(!user_email){
        res.send({status: 'None'})
        return
      }
      let query = Organization.findOne({_id: id}).select('members')

      query.exec((err, members)=>{

        if(err){

          console.log(err)
          res.send({error:'Internal Server Error'})
          return
        }
        members.findOne({user_email: user_email}, (err, member)=>{

          if(err){
            console.log(err)
            res.send({error: 'Internal Server Error'})
            return
          }
          res.send({status: member.status})

        })
      })

      

      


    }
    // app.get('/',(req, res)=>{ 
        
    //     res.sendFile(path.join(__dirname, 'build', 'index.html'))
    // })

    app.get('/checkIfloggedIn', checkLoginStatus)
    app.get('/clearCookie', clearCookie)
    app.post('/loginSubmit',[ 
        validator.check('email').isEmail().normalizeEmail().trim().escape(),
        validator.check('password').isLength({min: 8}).trim().escape()
        ], authenticateUser)



    app.post('/signupSubmit',[
    
        validator.check('name').isLength({min: 3}).trim().escape(),
        validator.check('email').isEmail().normalizeEmail().trim().escape(),
        validator.check('password').isLength({min: 8}).trim().escape()
    ], createUser)
    
    
    app.post('/registerOrgSubmit', [
        validator.check('name').isLength({min: 3}).trim().escape().withMessage('Name must be at least 3 characters long'),
        validator.check('location').trim().escape(),
        validator.check('about').trim().escape()
    ], createOrg)
    
    
    app.get('/getBrowseOrgs', getAllOrgs)
    app.get('/getUserOrgs', getUserOrgs )

    // app.post('/getOrganizationData',[
    //     validator.check('id').trim().escape()
    // ], getOrgData)

    app.post('/onAnnouncementSubmit', [
        
        validator.check('title').trim().escape(),
        validator.check('content').trim().escape()
    ], createAnnouncement)

    app.post('/onEventSubmit', [
        validator.check('name').trim().escape(),
        validator.check('location').trim().escape(),
        validator.check('date').trim().escape(),
        validator.check('time').trim().escape(),
        validator.check('description').trim().escape()
    ], createEvent)


    app.post('/checkMemberStatus', [validator.check('id').trim().escape()], getMemberStatus)
    app.post('/getEvemts', [validator.check('id').trim().escape()], getEvents)
    app.post('/getAnnouncements', [validator.check('id').trim().escape()], getAnnouncements)
    app.post('/getMembers', [validator.check('id').trim().escape()], getMembers)


    // app.get('/', (req, res)=>{

    //     res.sendFile(buildPath + 'index.html')
    // })

    //use the gzipped bundle
    app.get('*.js', (req, res, next) => {
      req.url = req.url + '.gz'; // eslint-disable-line
      res.set('Content-Encoding', 'gzip');
      next();
    });

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
  console.log('Listening on port ' + port)
});

    console.log('connected to MongoDB database')
})
