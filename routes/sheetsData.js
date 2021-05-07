const Url = require('./constants');
const express = require('express');
const axios = require('axios');
const {Router} = express;
const router = Router();
const {google} = require('googleapis');
require('dotenv').config();

const getCall = async (url) => {return await axios.get(url)}

let user = 0;
const client = new google.auth.JWT(
    process.env.google_client_email,
    null,
    process.env.google_private_key.replace(/\\n/gm, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    null,
    process.env.google_private_key_id
)

const userAuthorize = async () => {
    await client.authorize(async (error, tokens) => {
        if (error) {
            console.log(error);
            return
        } else {
            console.log("User Authorised!");
        }
    })
}

const columnMapper = (data, columns) => {
    return data.map((data) => {
        let newData = {}
        columns.split(',').map((column, index) => {
            newData[column] = data[index]
        })
        return newData;
    })
}


router.get('/', async (req, res) => {

    try {
        if (user == 0) {
            await userAuthorize();
            user = 1;
        }

        let gsapi = google.sheets({
            version: 'v4',
            auth: client
        });
        let sheetId = (await getCall(Url.getSheetId+`?id=`+req.query.sheetId)).data.sheetId;
        let data = await gsapi.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: req.query.range
        })
        //console.log(data.data.values)
        //console.log(columnMapper(data.data.values,"a,b,c,d,e,f"))
        return res.status(200).json(columnMapper(data.data.values, req.query.columns));
    } catch (err) {
        user = 0;
        console.error(err);
        res.status(500).json({
            ServerError: err
        });
    }
})

module.exports = router;