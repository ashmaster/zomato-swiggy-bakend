
const puppeteer = require('puppeteer');
const axios = require('axios')

function extractItems() {
  const extractedElements = document.querySelectorAll('div.jumbo-tracker');
  const items = [];
  for (let element of extractedElements) {
    var obj = {}
    obj.source = "Zomato";
    obj.url = element.querySelector('a').href.replace('https://www.zomato.com','');
    obj.img = element.querySelector('img').src;

    if(element.querySelectorAll('p')[0].innerText.substr(element.querySelectorAll('p')[0].innerText.length-3) == "OFF"){
        obj.name = element.querySelectorAll('p')[1].innerText;
        let text = element.querySelectorAll('p')[element.querySelectorAll('p').length-1].innerText;
        if(text.substr(0,1) == "₹"){
            obj.price = parseInt(text.substring(1,4));
            obj.time = parseInt(text.substring(text.length-6,text.length-4));
        }
        else{
            obj.price = "";
            obj.time = "";
            obj.note = text;
        }
        items.push(obj)
    }
    else{
        obj.name = element.querySelectorAll('p')[0].innerText
        text = element.querySelectorAll('p')[element.querySelectorAll('p').length-1].innerText;
        if(text.substr(0,1) == "₹"){
            obj.price = parseInt(text.substring(1,4));
            obj.time = parseInt(text.substring(text.length-6,text.length-4));
        }
        else{
            obj.price = "";
            obj.time = "";
            obj.note = text;
        }
        items.push(obj)
    }
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 500,
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) { }
  return items;
}

async function getSwiggy(q){
    let resArray = [];
    console.log(q.food)
    var food = q.food.replace(/%20/g,' ');
    console.log(food)
    let res = await axios.get(`https://www.swiggy.com/dapi/restaurants/search/v2_2?lat=${q.lat}&lng=${q.long}&sld=false&non_partner_search=false&submitAction=SUGGESTION&withMenuItems=true&str=${food}`)
    console.log(res.data)
    const restaurant = res.data.data.restaurants[0].restaurants;
    let x = 0;
    restaurant.forEach(item => {
        var item = JSON.parse(JSON.stringify(item))
        let obj = {};
        if(x==0){
            console.log("Item 0: ",item.feeDetails.totalFee);
        }
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
    ;
    
    
})
    return resArray
}

async function getFood(query) {
  // Set up browser and page.
  console.log(query)
  const items2 = await getSwiggy(query)
  
  const browser = await puppeteer.launch({
    headless:false,
    args: ['--headless'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
  // Navigate to the demo page.
  await page.goto(`https://www.zomato.com/index.php?entity_type=city&entity_id=${query.cityid}&city=${query.cityid}&dishv2_id=${query.foodid}&category=1`,{timeout: 15000});

  // Scroll and extract items from the page.
  const items = await scrapeInfiniteScrollItems(page, extractItems,15);
  
  const resArray = items.concat(items2)
  // Save extracted items to a file.


  // Close the browser.
  await browser.close();
  return resArray
};

exports.getFood = getFood;