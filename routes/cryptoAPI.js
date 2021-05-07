const express = require('express');
const {Router} = express;
const router = Router();
const axios = require('axios');
const Url = require("./constants");
const getData = async (url, params) => {
    return await axios.get(url, {
        params: params
    })
}

const mapCryptoData = async (data,names) => {
    response={}
    await names.split(',').map((name) => { response[name]=data[name].sell;})
    return response
}

const filterCryptoList = (data, symbol) => {
    return data.filter((data) => data.symbol == symbol.toLowerCase())
}

router.get('/price', async (req, res) => {
    params = {}
    try {
        return await res.status(200).json(await mapCryptoData((await getData(Url.getCoinPrice, params)).data,req.query.list));
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})

router.get('/id', async (req, res) => {

    params = {}
    try {
        return await res.status(200).json(filterCryptoList((await getData(Url.getListCoin, params)).data, req.query.symbol));
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})
module.exports = router;