const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');


// Load Schema
require('../models/Diary');
const Diary = mongoose.model('diary');

//Entries Page
router.get('/',ensureAuthenticated, (req,res) =>{
    Diary.find({user: req.user.id})
    .sort({date:'desc'})
    .then(diaries =>{
        res.render('entry/index', {
            diaries:diaries
        });
    })
    
});



// Add Entry
router.get('/add',ensureAuthenticated, (req,res) =>{
    res.render('entry/add');
    
});

// Edit Entry
router.get('/edit/:id',ensureAuthenticated, (req,res) =>{
    Diary.findOne({
        _id: req.params.id
    }).then(entry =>{
        if(entry.user != req.user.id){
            req.flash('error_msg', 'Not authorized');
            res.redirect('/entry');
        }else{
            res.render('entry/edit', {
                entry:entry
            });

        }
       
    })
   
   
});

// Submit Entry
router.post('/',ensureAuthenticated, (req,res) =>{
    let errors = [];
   
    if(!req.body.title){
    errors.push({text:'Please add a title'});
    }

    if(!req.body.entry){
        errors.push({text: 'Please add a diary entry'});
    }
    if(errors.length > 0){
        res.render('entry/add', {
            errors: errors,
            title: req.body.title,
            entry: req.body.entry,
            
        });
    }else{
        const newUser = {
            title: req.body.title,
            entry: req.body.entry,
            user: req.user.id
        }
        new Diary(newUser).save().then(entry => {
            req.flash('success_msg','Diary entry added');
            res.redirect('/entry');
        })
    }
});

//Edit and Update Entry
router.put('/:id',ensureAuthenticated, (req,res) =>{
   Diary.findOne({
       _id: req.params.id
   })
   .then(entry => {
       entry.title = req.body.title;
       entry.entry = req.body.entry;
       entry.save()
       .then(entry =>{
        req.flash('success_msg','Diary entry edited');
           res.redirect('/entry');
       })
   })
})

//Delete entry 
router.delete('/:id' ,ensureAuthenticated, (req,res) =>{
    Diary.deleteOne({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg','Diary entry deleted');
        res.redirect('/entry');
    })
})




module.exports = router;