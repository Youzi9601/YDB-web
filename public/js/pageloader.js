pageloader(false)
function pageloader(loaded = false) {
    /**
     * 畫面刷新函式
    */

    // console.log(window.location.pathname)
    function extractContent(content) {
        var headStart = content.indexOf('<head>');
        var headEnd = content.indexOf('</head>');
        var bodyStart = content.indexOf('<body>');
        var bodyEnd = content.indexOf('</body>');

        if (headStart !== -1 && headEnd !== -1 && bodyStart !== -1 && bodyEnd !== -1) {
            var newHead = content.slice(headStart + 6, headEnd);
            var newBody = content.slice(bodyStart + 6, bodyEnd);

            document.head.innerHTML = newHead;
            document.body.innerHTML = newBody;
            pageloader(true)
        } else {
            console.error('導航內容無效');
        }
    }

    document.addEventListener('click', function (event) {
        if (event.target.tagName === 'A' && event.target.classList.contains('navigate')) {
            var href = event.target.getAttribute('href');
            var url = href.split('#')[0];

            if (url !== '' && url !== window.location.pathname) {
                event.preventDefault();
                navigateTo(href);
            }
        }
    });

    function navigateTo(url) {
        if (url !== '' && url !== window.location.pathname) {
            fetch(url)
                .then(response => response.text())
                .then(content => {
                    extractContent(content);

                    // 找到新的 script 標籤，並重新執行
                    var scripts = document.getElementById('htmlIndex').querySelectorAll('script');
                    scripts.forEach(script => {
                        var newScript = document.createElement('script');
                        newScript.textContent = script.textContent;
                        document.getElementById('htmlIndex').appendChild(newScript);
                    });

                    window.history.pushState({}, '', url);
                })
                .catch(error => {
                    console.error('導航發生錯誤:', error);
                });
        }
    }

    window.addEventListener('popstate', function (event) {

        var newUrl = document.location.pathname + window.location.hash;
        fetch(newUrl)
            .then(response => response.text())
            .then(content => {
                if (!loaded)
                    extractContent(content);
                window.history.replaceState({}, '', newUrl);
            })
            .catch(error => {
                console.error('導航發生錯誤:', error);
            });
    });

    /**
     * 小區域刷新用
     */
    // 內容容器設置
    var contentContainer = document.getElementById('htmlIndex');
    /**
     * 讀取頁面
     * @param {String} title 標題名稱
     * @param {String} pagePath HTML位置名稱
     * @param {String} styles CSS樣式
     */
    function loadPage(title, pagePath, styles) {
        var contentContainer = document.getElementById('htmlIndex');
        var xhr = new XMLHttpRequest();

        // 執行換內容
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                contentContainer.innerHTML = xhr.responseText;
                updateTitle(title);
                updateStyle(styles)
            }
        };

        xhr.open('GET', `${ pagePath }.html`, true);
        xhr.send();
    }

    // 刷新標題
    function updateTitle(pageName) {
        document.title = pageName;

        var ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = newTitle;
        }
    }

    // 刷新css樣式
    function updateStyle(style) {
        var styleLink = document.getElementById('style-link');
        styleLink.setAttribute('href', `${ style }.css`);
    }

    /**
     * 腳本載入(通用)
     */
    var scriptData = [
        {
            src: "/public/js/commands.js",
            href: '/home/commands',
            defer: true,
        },
        {
            src: "/public/js/helpers.js",
            defer: true,
        },
        {
            src: "/public/js/alert.js",
            defer: true,

        },
        {
            src: "/public/js/discord/user.js",
            defer: true,

        },
        {
            src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js",
            crossorigin: "anonymous",
            integrity: "sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm",
        },
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js",
        },
        {
            src: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js",
            type: "module",
        },
        {
            src: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js",
            nomodule: true,
        },
    ];

    var fragment = document.createDocumentFragment();

    scriptData.forEach((data) => {
        if (data.href && window.location.pathname != data?.href) {
            console.log('不載入: ' + data.src)
            return;
        }
        var scriptElement = document.createElement("script");
        scriptElement.src = data.src;
        if (data.type) {
            scriptElement.type = data.type;
        }
        if (data.crossorigin) {
            scriptElement.crossOrigin = data.crossorigin;
        }
        if (data.integrity) {
            scriptElement.integrity = data.integrity;
        }
        if (data.nomodule) {
            scriptElement.setAttribute("nomodule", "");
        }
        if (data.defer) {
            scriptElement.setAttribute("defer", "");
        }
        fragment.appendChild(scriptElement);
    });

    document.body.appendChild(fragment);

}