const axios = require('axios');

async function getMenu(url){
    let response = {}
    try{
    await axios.get('https://www.zomato.com/webroutes/getPage?page_url='+url).then(res => {
        response = res.data.page_data.order.menuList.menus[0].menu.categories[0].category.items;
    })}
    catch(err){
        response = "Error Occured"
    }
    return response;
}

exports.getMenu = getMenu;