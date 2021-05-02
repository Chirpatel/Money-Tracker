const express = require('express');
const {Router} = express;
const router = Router();
const axios = require('axios');

const getData = async (url, params) => {
    return await axios.get(url, {
        params: params
    })
}

const mapCryptoData = (data) => {
    response={}
    data.map((data) => { response[data.id]=data.current_price;  })
    return response
}

const filterCryptoList = (data, symbol) => {
    return data.filter((data) => data.symbol == symbol.toLowerCase())
}

router.get('/price', async (req, res) => {
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        vs_currency: "inr",
        ids: req.query.ids,
        order: "market_cap_desc",
        per_page: req.query.per_page,
        page: req.query.page,
        sparkline: "false"
    }
    try {
        return await res.status(200).json(mapCryptoData((await getData(url, params)).data));
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})

router.get('/id', async (req, res) => {
    url = "https://api.coingecko.com/api/v3/coins/list"
    params = {}
    try {
        return await res.status(200).json(filterCryptoList((await getData(url, params)).data, req.query.symbol));
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
})

module.exports = router;