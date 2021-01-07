const express = require('express');
const router = express.Router();
const User = require('../models/User')
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin')

});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/signup', (req, res) => {
    res.render('users/signup');

});

router.post('/users/signup', async (req, res)=>{
    const {name, email, password, confirm_password} = req.body;
    if(!name){
        req.flash('error_msg', 'Name must be a valid string')
    }
    if(!email){
        req.flash('error_msg', 'Email cant be blank')
    }
    if(password != confirm_password){
        req.flash('error_msg', 'Password does no match')
    }
    if(password.length < 4 ){
        req.flash('error_msg', 'Password must be at least 4 characters')

    }
    if(!name || !email || !password || password < 4 || !confirm_password ){
        res.render('users/signup', {
            name,
            email,
            password,
            confirm_password,
            error_msg : req.flash('error_msg')
        })
    }else{
        const emailUser = await User.findOne({email : email})
        if(emailUser){
            req.flash('error_msg', 'Your email is already registered!')
            res.redirect('/users/signin')
        }else{
            const newUser = new User({name, email, password})
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered!')
            res.redirect('/users/signin')
        }
    }

})

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;