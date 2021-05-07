const express  = require('express');
const {Router} = express;
const router = Router();
const Page = require('../module/page');
const axios = require('axios');
const Url = require('./constants');

const getCall = async (url) => {return await axios.get(url)}

router.get('/', async (req, res) => {
    try {
        let pagedata = await Page.find();
        //console.log(pagedata)
        if (pagedata) {
            return res.status(200).json(pagedata);
        } else {
            return res.status(404).json('No data');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})
router.get('/get', async (req, res) => {
    try {
        //console.log(req.query["page"])
        let pagedata = await Page.findOne({
            page: req.query["page"]
        });
        //console.log(pagedata)
        if (pagedata) {
            return res.status(200).json(pagedata);
        } else {
            return res.status(404).json('No data');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})


router.post('/add', async (req, res) => {
    //console.log(req.body);

    try {
        let data = req.body.data;
        data.table = data.table.map((data) =>{
            let url = Url.addSheetId+`?id=${data.tableName}_${data.field}&sheetId=${data.sheetId}`
            getCall(url);
            return {
                ...data, sheetId:data.tableName+"_"+data.field
            }
        })
        let page = req.body.page;
        let pagedata = new Page({
            page,
            data,
            date: new Date(),
        });
        await pagedata.save();
        if (pagedata) {
            return res.status(200).json('Added');
        } else {
            return res.status(404).json('Not Added');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})

router.post('/update', async (req, res) => {
    try {
        let pagedata = await Page.updateOne({
            page: req.body.page
        }, {
            $set: {
                data: req.body.data
            }
        })
        if (pagedata) {
            return res.status(200).json('Updated');
        } else {
            return res.status(404).json('Not Updated');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})

router.get('/remove', async (req, res) => {
    let {
        _id
    } = req.query;
    try {
        let pagedata = await Page.deleteOne({
            page: req.query.page
        })
        if (pagedata) {
            return res.status(200).json('Removed');
        } else {
            return res.status(404).json('Not Remove');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})

module.exports = router;