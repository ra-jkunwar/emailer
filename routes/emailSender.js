
const express = require('express');
const router = require('express').Router();
const {
    getEmail,
    getEmails,
    deleteEmail,
    createUserEmail,
    sendEmail,
    newEmailpage
} = require('../controllers/emailer')


// router setup
router
   .route('/')
   .get(getEmails)
router
   .route('/:golf')
   .get(getEmail)
router
   .route('/sendemail')
   .post(sendEmail)
   


       
module.exports=router;