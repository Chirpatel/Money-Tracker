const {json} = require('express');
const express = require('express');
const {Router} = express;
const router = Router();
const {google} = require('googleapis');
require('dotenv').config();
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
        const opt = {
            spreadsheetId: process.env.google_sheet_id,
            range: req.query.range
        }
        let data = await gsapi.spreadsheets.values.get(opt)
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