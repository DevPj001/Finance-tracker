const Data = require('../models/Data');
exports.createData = async(req,res)=>{
  const {amount,purpose,category,date} = req.body;
  try{
    const newData = new Data({
      user: req.user._id,
      amount,
      purpose,
      category,
      date
    });
    await newData.save();
    res.status(201).json(newData);

  }catch(error){
    res.status(500).json({Message:error.Message});
  }
};

exports.getData = async(req,res) =>{
  try{
      const data = await Data.find({user: req.user._id});
      res.json(data);
  }catch(error){
    res.status(500).json({message: error.message});
  }
};