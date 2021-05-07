const express  = require('express');
const {Router} = express;
const router = Router();
const Page = require('../module/page');

const addSheetPage = async () =>{
    let data = {};
    let page = "Sheets";
    let pagedata = new Page({
        page,
        data,
        date: new Date(),
    });
    await pagedata.save();
    if (pagedata) {
        return 1;
    } else {
        return 0;
    }
}

router.get("/add", async (req,res)=>{
    try{
        let pagedata = await Page.findOne({
            page: "Sheets"
        });
        //console.log(pagedata)
        if (pagedata===null) {
            await addSheetPage();
            pagedata = await Page.findOne({
                page: "Sheets"
            });
        }
        let data ={};
        if(pagedata.data){
            data=pagedata.data;
        }
        data[req.query.id]=req.query.sheetId;
        //console.log(data)
        pagedata = await Page.updateOne({
            page: "Sheets"
        }, {
            $set: {
                data: data
            }
        })
        //console.log(pagedata)
        if (pagedata) {
            return res.status(200).json({status:"Added"});
        } else {
            return res.status(404).json({status:"Not Updated"});
        }
    }catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

router.get("/get", async (req,res)=>{
    try{
        let sheetdata = await Page.findOne({
            page: "Sheets"
        });
        //console.log(pagedata)
        if (sheetdata===null) {
            return res.status(404).json({status:"Sheet Not Found"});
        }else{
            //console.log(sheetdata)
            if(sheetdata.data[req.query.id]){
                return res.status(200).json({sheetId:sheetdata.data[req.query.id]})
            }else{
                return res.status(404).json({status:"Sheet Id Not Found"});
            }
        }
    }catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})
module.exports = router;