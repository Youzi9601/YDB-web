// 抓取 cookie 資料
function getCookie(name) {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim(); // 移除多餘的空格
        // 檢查 cookie 是否以指定名稱開頭
        if (cookie.startsWith(name + '=')) {
            // 返回去掉名稱部分的值
            return cookie.substring(name.length + 1);
        };
    };

    return null;
};



