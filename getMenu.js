const axios = require('axios');

async function getMenu(url){
    let response = {}
    await axios.get('https://www.zomato.com/webroutes/getPage?page_url='+url).then(res => {
        response = res.data.page_data.order.menuList.menus[0].menu.categories[0].category.items;
    })
    return response;
}

exports.getMenu = getMenu;