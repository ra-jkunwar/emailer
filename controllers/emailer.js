const emailer = require('../models/emailModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const nodemailer = require("nodemailer");
const path = require('path');
const { model } = require('mongoose');



// @desc Get all emails sub/not sub
// @route GET api/v1/emails
// @access Public
exports.getEmails = asyncHandler ( async (req,res,next)=>{
        const emails = await emailer.find();
        if(!emails){
            return res.status(400).json({success:false});
        }
        // res.status(200).json({
        //     success:true,
        //     count:emails.length,
        //     data:emails
        // })
    res.render('index',{data:emails});
});
// @desc Get particular bootcamps
// @route GET api/v1/emails/:golf/
// @access Public
exports.getEmail = asyncHandler (async (req,res,next)=>{

    if(req.params.golf){
        query= emailer.find({golf:true});
    }else{
        query= emailer.find({golf:false});
    }

    const emails = await query;
        res.status(201).json({
            success:true,
            data:emails
        })
    
})
// @desc add new email in database
// @route Post api/v1/bootcamps
// @access Private
exports.createUserEmail = asyncHandler (async (req,res,next)=>{
        const email = new emailer({
            name:req.body.name,
            golf:req.body.golf,
            email:req.body.email
        })
        email.save(function(err){
            if(err){
                return res.status(400).json({success:false})
            }
            res.status(201).redirect("/api/v1/emails")
        })
       
   
})
// @desc send email to selected cliets
// @route PUT api/v1/sendemail
// @access Private
exports.sendEmail = asyncHandler (async (req,res,next)=>{
    console.log("hello")
    let emailList;
    let emailArray=[];
     if(req.body.type==="9"){
          emailList = await emailer.find();
     }else{
         emailList = await emailer.find({golf:req.body.type});
     }
     const file = req.files.file;
   emailList.forEach(function(x){
    emailArray.push(x.email);
   })
     //checking if image is uploaded
     if(!file){
         return next(new ErrorResponse('Please Upload file',400));
     }
     //Make sure its image
     if(!file.mimetype.startsWith("image")){
        return next(new ErrorResponse('Please Upload only image  file',400));

     }
     if(file.size>process.on.MAX_SIZE){
        return next(new ErrorResponse(`Please Upload only image file with size less than ${process.on.MAX_SIZE}`,400));
     }
     file.name=`image_${file.size}_${Date.now()}${path.parse(file.name).ext}`
     
     file.mv(`${process.env.FILE_PATH}/${file.name}`, async err=>{

        if(err){
            console.log(err);
            return next(new ErrorResponse(`Problem with file Upload`,500))
        }else{
          
        var path = `${process.env.PWD}/public/uploads/${file.name}`
            var sender = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                }
            });
            
            var mail = {
                from: "RAJ KUNWAR SINGH",
                to:emailArray,
                subject: 'Sending Email using Node.js',
                text: 'That was easy!',
            html:
            "<h1>Sent through Emailer</h1><p>Testing is done</p>",
            attachments: [
                    {
                        filename: file.name,
                        path:path,
                        // cid: 'uniq-mailtrap.png'
                    }
                ],
                pool:true,
                maxConnections:500,
                maxMessage:500
            };
            console.log(path)
            sender.sendMail(mail, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).send("There was error sending email")
                } else {
                    console.log('Email sent successfully: '
                            + info.response);
                            res.render("thank")
                }
            });
            
                sender.close();
                

        }
     })
    
       
   
     });

exports.newEmailpage=asyncHandler(async (req,res,next)=>{
    console.log('Hello')
    res.render('newUser');
})

// @desc delete particular email/All the email
// @route DELETE api/v1/delete/:id
// @access Private
exports.deleteEmail =asyncHandler(async (req,res,next)=>{
        if(req.params.id){
        const particularEmail = await emailer.findByIdAndDelete(req.params.id);
        if(!particularEmail){
            return next(new ErrorResponse(`bootcamp not find with id of ${req.params.id}`,400));
        }
        res.status(201).json({
            success:true,
            data:{}
        })
        }else{
            const yes = await emailer.deleteMany();
            res.status(201).json({
                success:true,
                data:{},
                msg:"Deleted all the emails from the database"
            })
        }
       

})