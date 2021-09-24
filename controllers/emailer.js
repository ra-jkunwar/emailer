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

    const file = req.files.file;
    //checking if image is uploaded
    if(!file){
        return next(new ErrorResponse('Please Upload file',400));
    }
    //Make sure its image
    if(!file.mimetype.endsWith("ms-excel")){
       return next(new ErrorResponse('Please Upload only csv  file',400));

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
              name:item.name,
              golf:item.golf,
              email:item.email
             
            })
            newFile.save()
          })
            res.redirect('/api/v1/emails')
         });
    })
})

    

    

   
// @desc send email to selected cliets
// @route PUT api/v1/sendemail
// @access Private
exports.sendEmail = asyncHandler (async (req,res,next)=>{
    let emailList;
    let emailArray=[];
    let emailcount;
     if(req.body.type==="9"){
          emailList = await emailer.find();
     }else{
         emailList = await emailer.find({golf:req.body.type});
     }
     const file = req.files.file;
    
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
          
        var path = `${process.env.PWD}/public/uploads/${file.name}`;
        let a,b,c;
        emailcount=emailList.length;
        if(emailcount<=500){
      emailList.forEach(function(x){
       emailArray.push(x.email);
      })
      a = await sender(process.env.USER,process.env.PASS,emailArray,file,path);
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
              b = await sender(process.env.USER,process.env.USEME,newArray,file,path);
              c = await sender(process.env.USER,process.env.PASME,newArray,file,path);

        }
        if(a||b||c){
            res.render("thank")
        }
                

        }
     })
    
       
   
     });

exports.newEmailpage=asyncHandler(async (req,res,next)=>{
   
    res.render('newUSer');
})

