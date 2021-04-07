const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
 
axiosCookieJarSupport(axios);
 
const cookieJar = new tough.CookieJar();

async function citySuggest(q){
    let response = {}
    try{
    await axios.get(`https://www.zomato.com/webroutes/location/search?q=${q}&is_address_flow=true`,{
        jar: cookieJar, // tough.CookieJar or boolean
        withCredentials: true, // If true, send cookie stored in jar
      }).then(res => {
        response = res.data
    })}
    catch(err){
        response = err
    }
    return response
}

exports.citySuggest = citySuggest;