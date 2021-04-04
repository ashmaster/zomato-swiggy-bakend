const axios = require('axios');

async function zomdets(q){
    const res = await axios.get(`https://www.zomato.com/webroutes/getPage?page_url=${q}`);
    let response = {};
    response = res.data;
    return response;
}

exports.zomdets = zomdets;