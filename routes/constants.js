require('dotenv').config();
const url = {
    getSheetId: process.env.API_url+"/data/page/sheetid/get",
    addSheetId: process.env.API_url+"/data/page/sheetid/add",
    getListCoin: "https://api.coingecko.com/api/v3/coins/list",
    getCoinPrice: "https://api.wazirx.com/api/v2/tickers"
}
module.exports = url;