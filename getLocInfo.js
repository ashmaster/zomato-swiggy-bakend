const axios = require('axios');
async function getLocInfo(lat,long,pid){
    let response = {}
    try{
    await axios.get(`https://www.zomato.com/webroutes/location/get?lat=${lat}&lon=${long}&userDefinedLatitude=${lat}&userDefinedLongitude=${long}&placeId=${pid}&placeType=GOOGLE_PLACE&isOrderLocation=1&is_address_flow=true`).then(res => {
        response = res.data
    })}
    catch(err){
        response = "Error Occured"
    }
    return response
}

exports.getLocInfo = getLocInfo;