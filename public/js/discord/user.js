/**
 * 使用者
 */
//#region 尚未登入
// 處理Discord使用者問題
var url = '';
fetch('/auth/urls')
	.then(result => result.json())
	.then(response => {
		url = response.discordAuthUrl;
	});

var loginBtns = document.getElementsByName("discord-login")
var accessToken = getCookie('access_token');

if (loginBtns) {
	loginBtns.forEach(loginBtn => {
		loginBtn.addEventListener("click", function () {
			loginBtn.innerHTML = `<div class="spinner-border text-secondary spinner-border-sm" role="status"><span class="visually-hidden">讀取中</span></div> 登入`
			// 執行產生隨機代碼
			var randomString = generateRandomString();
			localStorage.setItem('oauth-state', randomString);
			// 設定網址添加識別
			url += `&state=${ btoa(randomString) }`;

			var popupUrl = url;
			var popupOptions = "width=400,height=500,scrollbars=yes";
			window.open(popupUrl, "_blank", popupOptions);

			// 確保阻止預設的連結行為，以免導致頁面跳轉
			event.preventDefault();
		});
	});

	if (accessToken) {

		// 檢查是否被盜
		if (btoa(localStorage.getItem('oauth-state')) !== atob(decodeURIComponent(getCookie('oauth-state')))) {
			if (appendAlert) appendAlert('警告', '此登入的資料可能被監控！', '', 'warning');
		}
		var access_token = atob(getCookie('access_token'));
		fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${ 'Bearer' } ${ access_token }`,
			},
		})
			.then(result => result.json())
			.then(response => {
				// var { id, username, discriminator, avatar, banner_color, email } = response;
				// var fullName = ` ${ username }${ discriminator == 0 ? '' : `#${ discriminator }` }`;
				console.debug(response);
			})
			.catch(console.error);

	}

}

// 安全檢查用
function generateRandomString() {
	var randomString = '';
	var randomNumber = Math.floor(Math.random() * 10);

	for (var i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

//#endregion

