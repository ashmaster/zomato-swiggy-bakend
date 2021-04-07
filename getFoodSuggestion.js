const axios = require('axios');

async function getFoodSuggestion(searchParams){
    let response = {}
    try{
    await axios.get(`https://www.zomato.com/webroutes/search/autoSuggest?entityId=${searchParams.entityId}&entityType=subzone&locationType=&isOrderLocation=0&cityId=${searchParams.cityId}&latitude=${searchParams.lat}&longitude=${searchParams.long}&userDefinedLatitude=${searchParams.lat}&userDefinedLongitude=${searchParams.long}&cityName=${searchParams.cityName}&countryId=1&countryName=India&o2Serviceable=true&placeId=${searchParams.deliveryId}&deliverySubzoneId=${searchParams.deliveryId}&placeType=DSZ&isO2City=true&fetchFromGoogle=false&fetchedFromCookie=false&&isO2OnlyCity=false&addressBlocker=0&&otherRestaurantsUrl=&q=${searchParams.food}&context=delivery`).then(res => {
        response = res.data
    })
    }
    catch(err){
        response = "Error Occured"
    }
    return response;
}

exports.getFoodSuggestion = getFoodSuggestion;