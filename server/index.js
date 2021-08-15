/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const validator = require('express-validator')
const mongoose = require('mongoose')
const path = require('path')
const fetch = require('node-fetch')
const Organization = require('./models/organization.model')
const User = require('./models/user.model')
const config = require('./config.json')
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


const buildPath = __dirname + '/build/'

app.use(express.static(buildPath))


const url = config.DBurl



//database connections
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('error', ()=> console.log('Error Connecting to Datbase'))
mongoose.connection.on('disconnect', ()=> {
    console.log('Disconnected from Server')
    return
})
mongoose.connection.on('connected', ()=> {

    //Listen and handle Request
    

    // check if a cookie is present 
    // this is to check if a user is logged in when the page loads
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
        res.send({response: 'cookie cleared'})
    }


    // the following function is used to authenticate a user when they log in 
    // the bcrypt module is used to compare the passwords and if a successful log in occurs
    // a cookie is sent to the client containing the email of the current user

    const authenticateUser =(req, res)=>{
    
        let email = req.body.email
        let password = req.body.password

        
        User.findOne({email: email}, (err, user)=>{

            if(!user){
                res.send({error: 'Invalid Email or Password'})
            }else{

                let match = bcrypt.compareSync(password, user.password)
                if(match){
                    
                    res.cookie('currentUser', user.email,{
                        maxAge: 6000*1000,
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


    // function called when a user creates an account 
    // checks if email is already being used
    // if not hash and salt the password using bcrypt
    // store the data in the User document
    const createUser = (req, res)=>{
    


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
                                maxAge: 6000 * 10000 ,
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

    // called when a user submits the form on the register organization page
    // a new organization will be created with the current user having 'Leader' status in
    // the organization allowing them to post events and announcements, promote other members to leaders etc.
    const createOrg = (req,res)=> {

        //Insert this data to the database to create a new club

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
    }


    // the following function is used to retrieve the organization data on the browse page
    // if a user is logged in the organization data will be sent to flask (file  ../flask/app.py) to recommend 
    // up to 3 organizations for the user
    
    const getAllOrgs = async (req,res) => {

        const query = Organization.find({}).select('name location') 
        const user = req.cookies.currentUser
        
        query.exec((err,result)=>{
            if(err){
                console.log(err)
            }else{
                let suggestions
                if(user){
                    Organization.find({}).select('_id').exec((err, orgs)=>{
                        User.find({}).select('OrganizationsJoined').exec((err, joinedOrgs)=>{
                            if(err){
                                console.log(err)
                                return
                            }
                            User.find({}).select('email').exec(async(err, userEmails)=>{
                                
                                    if(err){
                                        console.log(err)
                                        return
                                    }
                                    suggestions = await fetch('http://localhost:5000/flask', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({user: user, orgs: orgs, joinedOrgs: joinedOrgs, userEmails: userEmails }),
                                })
                                Organization.find({'_id': {'$in': await suggestions.json()}}).select('name location').exec((err,recOrgs)=>{

                                    if(err){
                                        console.log(err)
                                    }else{
                                        res.send({rec: recOrgs, orgs: result})
                                    }

                                })
                            })

                        })
                    })
                }
                else{
                    res.send({orgs: result})
                }
            }
            
        })
    }
    

    // Finds the organization that the current user is apart of and sends the name and location of the organization to the client
    const getUserOrgs = async (req, res) =>{


        const query = User.findOne({email: req.cookies.currentUser}).select('OrganizationsJoined') 
        
        query.exec(async (err,result)=>{
            if(err){
                console.log(err)
            }else{

                let userOrgs = []

                for(let i = 0; i < result.OrganizationsJoined.length; i++){

                  let findOrg = Organization.findOne({_id: result.OrganizationsJoined[i].org_id}).select('name location ')
                  let org = await  findOrg.exec()

                    userOrgs.push(org)

                }
                res.send(userOrgs)
            }
        
        })
    }


    // Gets a users profile data to display on their profile
    // const getUserProfile = (req, res) => {



    // }

    // recieves an organization id and the content of the 'Add announcement' form
    // adds the announcement to the Organization's document
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

    // receives organization Id and the content of the 'Add Event' form 
    // adds the content to the organization document
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

    // Receives and organization Id and sends an array of event objects from the 
    // organizations events property
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

    // Receives and organization Id and sends an array of announcement objects from the 
    // organizations announcement property
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

    // Receives and organization Id and sends an array of member objects from the 
    // organizations member property
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

    // Checks if the currentUser is a Member of the Organizations
    // If no user is logged in send {status:'No User'} to the client
    // if there is a user logged in:
    // Not a member send {status: None}
    // A member but NOT a Leader send {status: 'Member'}
    // A Leader send {status: Leader}
    const getMemberStatus = (req,res)=>{

      let id = req.body.id
      let user_email = req.cookies.currentUser
      let status

      if(!user_email){
        status = 'No User'
        res.send({status: status})
        return
      }
      let query = Organization.findOne({_id: id}).select('members')

    
      query.exec((err, org)=>{

        if(err){

          console.log(err)

          res.send({error:'Internal Server Error'})
          return
        }
        org.members.forEach(element =>{

            if(err){
                console.log(err)
            }

            if(element.user_email == user_email){
                status = element.status
                res.send({status: status})
                return
            }
        })
        if(!status){
            status = 'None'
            res.send({status: status})
        }

      })
    }

    // Gets basic information of the organization
    //Organization name location and about sectios 
    // used to display information on the organization homepage
    // after clicking a card
    const getOrgHome =(req, res)=>{
        const id = req.body.id

        let query = Organization.findOne({_id: id}).select('name location about')

        query.exec((err, org)=>{
            if(err){
                console.log(err)
                res.send({error: 'Internal Server Erro'})
            }
            res.send(org)
        })

    }

    // Called when a user clicks the join button on the Organization home page
    // Adds the user to the members array in the organization document with Member status
    //if done successfully an object is sent to client with success property  {success: 'Message'}
    // if unsuccessful an object is sent to the client with error property {error: 'Messages'}
    const joinOrg = (req,res)=>{
        const id = req.body.id
        const user_email = req.cookies.currentUser

        
        Organization.findByIdAndUpdate({_id: id},
            {'$push': {members: {user_email: user_email, status: 'Member'}}}, (err)=>{

                if(err){
                    console.log(err)
                    res.send({error:'Could not join Organization'})
                }else{
                    User.findOneAndUpdate({email: user_email}, 
                        {'$push': {OrganizationsJoined:{org_id: id }}}, (err)=>{
                            if(err){
                                console.log(err)
                                res.send({error: 'Could not add organization to your Organizations'})
                            }
                            res.send({success: 'Joined Organization'})
                        })
                }
               
            })
    }

    //Removes a member of an organization from the member array in the organization document
    // Sends an object to client {success: 'Message'} if successful or {error: 'Message'} if unsuccessful
    const leaveOrg = async (req, res) =>{

        const id = req.body.id
        const user_email = req.cookies.currentUser

       let OrgFound = await Organization.findOne({_id: id, members: {'$elemMatch': { user_email: user_email, status: 'Member' }}})

        if(OrgFound){
        Organization.findByIdAndUpdate({_id: id},
            {'$pull': {members: {user_email: user_email }}}, (err) => {

                if(err){
                    console.log(err)
                    res.send({error: 'Could not remove you from this organization'})
                }else{
                    User.findOneAndUpdate({email: user_email},
                    {'$pull': {OrganizationsJoined:{org_id: id}}}, (err) =>{
                        if(err){
                            console.log(err)
                            res.send({error: 'Could not remove you from this organization'})
                        }
                        res.send({success: 'Organization Left'})
                    })
                }
            }
            )
        }else{
            res.send({error: 'Could not remove you from this organization'})
        }
    }


     //This function is used to change the status of a Member from 'Member' to 'Leader'
    // in the Organizatio document

    const promoteMember = async (req, res)=>{

        let org_id = req.body.org_id
        let promotedMemberEmail = req.body.member

        let OrgFound = await Organization.findOne({_id: org_id, members: {'$elemMatch':{ user_email: promotedMemberEmail, status: 'Member'}}})

        
        if(OrgFound){
            console.log('PROMOTING MEMBER NOW \n')
            Organization.findOneAndUpdate(
                {_id: org_id, members: {'$elemMatch': {user_email: promotedMemberEmail, status: 'Member'}}},
                {
                    '$set': {'members.$': {user_email: promotedMemberEmail, status: 'Leader'}}
                },
                (err)=>{
                    if(err){
                        console.log(err)
                        res.send({error: 'Could not promote this member'})
                    }else{
                        res.send({success: 'Member Promoted'})
                    }
                }   
            )
        }else{
            res.send({error: 'Could not promote this member'})
        }

    }
    // app.get('/',(req, res)=>{ 
        
    //     res.sendFile(path.join(__dirname, 'build', 'index.html'))
    // })

    // Below are all the routes that are used to handle request 
    // these routes are bound the the function above with the name of the last parameter
    // to initiate these routes from the client send a fetch request with the corresponding method: GET POST etc
    // to 'http://localhost:3000/ folled by the string in the first parameter

    // the routes use express validator  middleware to validate and sanitize the input of the request body
    app.post('/checkIfloggedIn', checkLoginStatus)
    app.post('/clearCookie', clearCookie)
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
        validator.check('name').isLength({min: 3}).trim().escape(),
        validator.check('location').trim().escape(),
        validator.check('about').trim().escape()
    ], createOrg)
    
    
    app.post('/getBrowseOrgs', getAllOrgs)
    app.post('/getUserOrgs', getUserOrgs )
    app.post('/getUseProfile', getUserProfile)

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


    app.post('/checkMemberStatus', getMemberStatus)
    app.post('/getOrgHome', [validator.check('id').trim().escape()], getOrgHome)
    app.post('/getEvents', [validator.check('id').trim().escape()], getEvents)
    app.post('/getAnnouncements', [validator.check('id').trim().escape()], getAnnouncements)
    app.post('/getMembers', [validator.check('id').trim().escape()], getMembers)

    app.post('/onJoinOrg', [validator.check('id').trim().escape()], joinOrg)
    app.post('/onLeaveOrg', [validator.check('id').trim().escape()], leaveOrg)


    app.post('/promoteMember', [
        validator.check('id').trim().escape(),
        validator.check('member').isEmail().normalizeEmail().trim().escape(),
    ], promoteMember)

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
