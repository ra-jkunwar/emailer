const emailer = require('../models/emailModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const {
    sender
} = require("./nodemailer");
const path = require('path');
const csv = require('csv-parser')
const fs = require('fs');

const { model } = require('mongoose');



// @desc Get all emails sub/not sub
// @route GET api/v1/emails
// @access Public
exports.getEmails = asyncHandler ( async (req,res,next)=>{
    res.render('newUSer');
    
});
// @desc Get particular bootcamps
// @route GET api/v1/emails/:golf/
// @access Public
exports.getEmail = asyncHandler (async (req,res,next)=>{
    res.render('index');
 
    
})
// @desc add new email in database
// @route Post api/v1/bootcamps
// @access Private
exports.createUserEmail = asyncHandler (async (req,res,next)=>{

    const file = req.files.file;
    //checking if image is uploaded
    if(!file){
        return next(new ErrorResponse('Please Upload file',400));
    }
    //Make sure its image
    if(!file.name.endsWith("csv")){
       return next(new ErrorResponse('Please Upload only csv file',400));

    }
    if(file.size>process.on.MAX_SIZE){
       return next(new ErrorResponse(`Please Upload only csv file with size less than ${process.on.MAX_SIZE}`,400));
    }
    const results = [];
    file.name=`csvFile_${file.size}_${Date.now()}${path.parse(file.name).ext}`
    var pathe = `${process.env.PWD}/public/uploads/${file.name}`;
    file.mv(`${process.env.FILE_PATH}/${file.name}`, async err=>{
        fs.createReadStream(pathe)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          results.forEach(function(item){ 
            const newFile = new emailer({
              golf:item.golf,
              email:item.email
             
            })
            newFile.save()
          })
            res.redirect('/api/v1/emails/sendemail')
         });
    })
})


// @desc send email to selected cliets
// @route PUT api/v1/sendemail
// @access Private
exports.sendEmail = asyncHandler (async (req,res,next)=>{
    // await emailer.deleteMany();
  
    let emailList;
    let emailArray=[];
    let emailcount;
     if(req.body.type.startsWith("A")){
      emailList = await emailer.find()
     }else if(req.body.type.startsWith("O")){
        emailList = await emailer.find({golf:true})
     }else{
         emailList = await emailer.find({golf:false})
     }
     console.log(emailList)
     const fil = req.files.fileimg;
     emailcount=emailList.length
    console.log(emailList,emailcount)
     //checking if image is uploaded
     if(!fil){
         return next(new ErrorResponse('Please Upload image',400));
     }
     //Make sure its image
     if(!fil.mimetype.startsWith("image")){
        return next(new ErrorResponse('Please Upload only image  file',400));

     }
     if(fil.size>process.on.MAX_SIZE){
        return next(new ErrorResponse(  `Please Upload only image file with size less than ${process.on.MAX_SIZE}`,400));
     }
     fil.name=`image_${fil.size}_${Date.now()}${path.parse(fil.name).ext}`
     
     fil.mv(`${process.env.FILE_PATH}/${fil.name}`, async err=>{

        if(err){
            console.log(err);
            return next(new ErrorResponse(`Problem with file Upload`,500))
        }else{
          
        var paths = `${process.env.PWD}/public/uploads/${fil.name}`;
        let a,b,c;
       
        if(emailcount<=500){
      emailList.forEach(function(x){
       emailArray.push(x.email);
      })
      
      a = await sender(process.env.USER,process.env.PASS,emailArray,fil,paths,req.body.subject,req.body.post);
        }else{
            let newArray;
            let secondArray;
            emailArray = emailList.slice(0,500);
            let maxArray = emaiList.slice(500,emailcount);
            emailArray.forEach(function(x){
                newArray.push(x.email);
               })
            maxArray.forEach(function(x){
                secondArray.push(x.email);
               })
               console.log(req.body.post)
           b = await sender(process.env.USER,process.env.PASS,newArray,fil,paths,req.body.subject,req.body.post);
              c = await sender(process.env.USER2,process.env.PASME,newArray,fil,paths,req.body.subject,req.body.post);

        }
        if(a||b||c){
            await emailer.deleteMany();
            res.render("thank");
        }
                

        }
     })
    
       
   
     });

exports.newEmailpage=asyncHandler(async (req,res,next)=>{
   
    res.render('newUSer');
})

