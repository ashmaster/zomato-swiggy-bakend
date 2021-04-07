const axios = require('axios');

async function zomdets(q){
    let response = {};
    try{
    const res = await axios.get(`https://www.zomato.com/webroutes/getPage?page_url=${q}`);
    
    response = res.data;
    }
    catch(err){
        response="Error"
    }
    return response;
}

exports.zomdets = zomdets;