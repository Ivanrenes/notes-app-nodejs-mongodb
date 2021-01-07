const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) =>{
    res.render('notes/add-note');
})

router.post('/notes/new-note', isAuthenticated, async (req, res) =>{
    const {title, description} = req.body; 
    const errors = [];

    if(!title){
        req.flash('error_msg', 'You have to write a title');
    }
    if(!description){
        req.flash('error_msg', 'You have to write a description');
    }
    if(!title || !description){
        res.render('notes/add-note', {
            title,
            description,
            error_msg: req.flash('error_msg')
        })
    }else{
       const newNote = new Note({title, description});
       newNote.user = req.user.id;
       await newNote.save().then((res) => {
           req.flash('success_msg', 'Note Added Successfully');
       }).catch((err) => {
           console.log(err);
       });

       res.redirect('/notes')
    }
})

router.get('/notes', isAuthenticated, async (req, res)=>{
     const notes  = await Note.find({user: req.user.id}).lean().sort({date:'desc'});
     res.render('notes/all-notes', {notes})
});

router.get('/notes/edit/:id', isAuthenticated, async (req,res) =>{
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note})
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) =>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description}).then(
        req.flash('success_msg','Note Updated Successfully')
    );
    res.redirect('/notes')

});

router.delete('/notes/delete/:id', isAuthenticated, async (req,res) =>{
    await Note.findByIdAndDelete(req.params.id).then(
        req.flash('success_msg','Note Deleted Successfully')
    );
    res.redirect('/notes');
})
module.exports = router;
