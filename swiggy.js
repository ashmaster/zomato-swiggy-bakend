const axios = require('axios');
let resArray = [];
async function getSwiggy(lat,long,food){
    await axios.get(`https://www.swiggy.com/dapi/restaurants/search/v2_2?lat=${lat}&lng=${long}&sld=false&non_partner_search=false&submitAction=SUGGESTION&str=${food}`).then((res) => {

        const restaurant = res.data.data.restaurants[0].restaurants;
        restaurant.forEach(item => {
            let obj = {};
            obj["name"] = item.name;
            obj["time"] = item.deliveryTime;
            obj["price"] = item.costForTwo/200;
            obj["source"] = "Swiggy";
            obj["charge"] = item.feeDetails.totalFee/100;
            obj["rating"] = item.avgRating;
            obj["img"] = "https://res.cloudinary.com/swiggy/image/upload/".concat(item.cloudinaryImageId)
            resArray.push(obj);
        });
        
    })
    return resArray
}

exports.getSwiggy = getSwiggy;