const axios = require("axios");
const cheerio = require("cheerio")

async function getZomato(cityid,foodid,lat,long,food){
    let resArray = []
    await axios.get(`https://www.zomato.com/index.php?entity_type=city&entity_id=${cityid}&city=${cityid}&dishv2_id=${foodid}&category=1`).then((res) => {
        const $ = cheerio.load(res.data, {xmlMode: false});
        const elems = $('div.jumbo-tracker');
        var rests = $('script').get()[4].children[0].data
        var links = $('script').get()[3].children[0].data
        rests = JSON.parse(rests)
        links = JSON.parse(links)
        rests["item"].forEach(item => {
            let obj = {};
            obj["name"] = item["name"];
            obj["img"] = item["image"];
            obj["source"] = "Zomato";
            resArray.push(obj);
        });
        var x = 0;
        links["itemListElement"].forEach(item => {
            let obj = {};
            resArray[x]["url"] = item["url"];
            x++;
        });
        for(var i=0;i<rests["item"].length;i++){
                const time = $(elems[i]).find('p').last()
                const price = $(elems[i]).find('span');
                if($(time).text().replace($(price).text(),'').substring(3) == "min") {
                    resArray[i]["price"] = parseInt($(price).text().substring(1,4));
                    resArray[i]["time"] = parseInt($(time).text().replace($(price).text(),'').substring(0,2));
                }
                else{
                    resArray[i]["price"] = parseInt($(price).text().substring(1,4));
                    resArray[i]["time"] = '';
                    resArray[i]["note"] = $(time).text().replace($(price).text(),'');
                }
                
        }
        
        

    }).then(async (res) => {
        await axios.get(`https://www.swiggy.com/dapi/restaurants/search/v2_2?lat=${lat}&lng=${long}&sld=false&non_partner_search=false&submitAction=SUGGESTION&withMenuItems=true&str=${food}`).then((res) => {

        const restaurant = res.data.data.restaurants[0].restaurants;
        let x = 0;
        restaurant.forEach(item => {
            var item = JSON.parse(JSON.stringify(item))
            let obj = {};
            obj["name"] = item.name;
            obj["time"] = item.deliveryTime;
            obj["price"] = item.costForTwo /200;
            obj["source"] = "Swiggy";
            obj["charge"] = item.feeDetails;
            obj["rating"] = item.avgRating;
            obj["menu"] = item.menuItems;
            obj["img"] = "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/".concat(item.cloudinaryImageId)
            obj["url"] = `https://www.swiggy.com/restaurants/${item.slugs.restaurant}-${item.slugs.city}-${item.id}`
            resArray.push(obj);
            x++;
        });
        
    })
    })
    return resArray
}

exports.getZomato = getZomato;
