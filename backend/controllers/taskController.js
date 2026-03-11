const express = require('express');
const Task = require('../models/Task');

//create task 
const CreateTask = async (req,res) => {

   try{
      const {title,status} = req.body;
      
      const existingTask = await Task.findOne({title,user:req.user.id});
      if(existingTask){
        return res.status(400).json({message:'Task is already exist'});
      }

      const newTask = await Task.create({
         title,
         status,
         user:req.user.id
      });

      res.status(201).json({message:'Task is created',newTask});

   }catch(error){
      res.status(500).json({message:error.message});
   }

};

const getAllTask = async(req,res) => {
    
    try{
       
       const tasks = await Task.find({user:req.user.id}).populate('user','userName email').sort({createdAt:-1});

       if(tasks.length==0){
         return res.status(404).json({message:'No task found'})
       }

       res.status(200).json(tasks);


    }catch(error){
       res.status(500).json({message:error.message});
    }

}  

const getTaskById = async(req,res) => {

   try{

       const task = await Task.findById(req.params.id)
           .populate('user','userName email');
       if(!task.user.toString() !== req.user.id){
         return res.status(403).json({message:'Not authorized'});
       }

       if(!task){
         return res.status(404).json({message:'Task not found'});
       }

      res.status(200).json(task);



   }catch(error){
      res.status(500).json({message:error.message});
   }
};

const UpdateTask = async(req,res) => {

     try{
        const {title,status} = req.body;
        const task = await Task.findById(req.params.id);
        if(!task){
         return res.status(404).json({message:'Task not found'});
        }

        if(task.user.toString()!== req.user.id){
           return res.status(403).json({message:'Not authorized'});
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {title,status},
            {new:true}
        );
        res.status(200).json({message:'Task updated succesfully',updatedTask})

     }catch(error){
       return res.status(500).json({message:error.message});
     }


};

const deleteTask = async (req,res) => {

     try{
        const task = await Task.findById(req.params.id);
        if(!task){
         return res.status(404).json({message:'Task not found'});
        }

        if(task.user.toString() !== req.user.id){
         return res.status(403).json({message:'Not authorized'});
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({message:'task deleted succesfully'});

     }catch(error){
        return res.status(500).json({message:error.message});
     }



};




module.exports = {CreateTask,getAllTask,getTaskById,UpdateTask,deleteTask};