const express = require('express');
const {Router} = express;
const router = Router();
const axios = require('axios');

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


router.get('/price', async (req, res) => {
    url = "https://api.wazirx.com/api/v2/tickers"
    params = {}
    try {
        return await res.status(200).json(await mapCryptoData((await getData(url, params)).data,req.query.list));
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})


module.exports = router;