const axios = require('axios');

async function citySuggest(q){
    let response = {}
    try{
    await axios.get(`https://www.zomato.com/webroutes/location/search?q=${q}&is_address_flow=true`).then(res => {
        response = res.data
    })}
    catch(err){
        response = err
    }
    return response
}

exports.citySuggest = citySuggest;