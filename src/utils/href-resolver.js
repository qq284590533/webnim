// 解析地址中的参数

function getParamsFromHref(href) {
    const params = {}
    href.split('?')[1].split('&').forEach(item => {
        let itemArr = item.split('=');
        params[itemArr[0]] = itemArr[1];
    });
    return params;
}

export default getParamsFromHref
