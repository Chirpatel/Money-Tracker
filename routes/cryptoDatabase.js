const express  = require('express');
const {Router} = express;
const router = Router();
const Crypto = require('../module/crypto');
const axios = require('axios');
const getName = async (url) => {return await axios.get(url)}

router.get('/',async (req,res) =>{
    try{
        let cryptodata = await Crypto.find();
        if(cryptodata){
            return res.status(200).json(cryptodata);
        }else{
            return res.status(404).json('No data');
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json('Server error');
    }
})



router.get('/add',async (req,res) =>{
    let {coinName,date, amount, quantity,currency, transactionType} = req.query;
    let name = (await getName("https://moneytracker.vercel.chir.in/api/crypto/id?symbol="+coinName)).data[0].id;
    try{
        let cryptodata= new Crypto({
            coinName,
            date:new Date(date),
            name,
            amount,
            quantity,
            currency,
            transactionType
        });
        await cryptodata.save();
        if(cryptodata){
            return res.status(200).json('Added');
        }else{
            return res.status(404).json('Not Added');
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json('Server error');
    }
})

router.get('/update',async (req,res) =>{
    let {_id,coinName,date, amount, quantity,currency, transactionType} = req.query;
    let name = (await getName("https://moneytracker.vercel.chir.in/api/crypto/id?symbol="+coinName)).data[0].id;
    try{
        let cryptodata = await Crypto.updateOne({_id:_id},{$set:{coinName:coinName,date:date,name:name,amount:amount,quantity:quantity,currency:currency,transactionType:transactionType}})
        if(cryptodata){
            return res.status(200).json('Updated');
        }else{
            return res.status(404).json('Not Updated');
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json('Server error');
    }
})

router.get('/remove',async (req,res) =>{
    let {_id} = req.query;
    try{
        let cryptodata = await Crypto.remove({_id:_id})
        if(cryptodata){
            return res.status(200).json('Removed');
        }else{
            return res.status(404).json('Not Remove');
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json('Server error');
    }
})

module.exports = router;