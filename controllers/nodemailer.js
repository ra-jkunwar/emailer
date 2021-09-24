const express = require('express');
const nodemailer = require('nodemailer')


exports.sender=(user,password,sendingList,file,path)=>{
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
        maxMessage:1000
    };
    let m ;
    sender.sendMail(mail, function (error, info) {
        if (error) {
            console.log(error);
            
        } else {
            console.log('Email sent successfully: '
                    + info.response);
                m = 1;


                   
        }
    });
    
        sender.close();

        return 1;
}

