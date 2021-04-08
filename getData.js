const zom = require('./zomato');

//zom.getZomato('11290','ccd1f4ec156515f311f96e40734e5a6e_2')


const getData = async(req) => {
    let resArray = []
    resArray = await zom.getZomato(req.cityname,req.foodid,req.lat,req.long,req.food)
    return resArray
}

exports.getData = getData;

