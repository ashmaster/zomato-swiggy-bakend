const axios = require('axios');

async function citySuggest(q){
    let response = {}
    await axios.get(`https://www.zomato.com/webroutes/location/search?q=${q}&is_address_flow=true`).then(res => {
        response = res.data
    })
    return response
}

exports.citySuggest = citySuggest;