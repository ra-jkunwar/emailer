const express = require('express');
const nodemailer = require('nodemailer');
const ErrorResponse = require('../utils/errorResponse');


exports.sender=(user,password,sendingList,file,path,subject,content)=>{

    var sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: password
        }
    });
    
    var mail = {
        from: "RAJ KUNWAR SINGH",
        to:sendingList,
        subject: subject,
    html:
    `<h1>${content}<br>Sent through Emailer</h1><p>Testing is done</p>Embedded image: <img src="uniq-gmail${file.name}.png"/>`,
    attachments: [
            {
                filename: file.name,
                path:path,
                cid: `uniq-gmail${file.name}.png`
            }
        ],
        pool:true,
        maxConnections:500,
        maxMessage:1000
    };
    let m ;
    sender.sendMail(mail, function (error, info) {
        if (error) {
            console.log(error);
            return new ErrorResponse(`${error.message},400`)
        } else {
            console.log('Email sent successfully: '
                    + info.response);
                m = 1;


                   
        }
    });
    
        sender.close();

        return 1;
}

