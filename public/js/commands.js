console.log("command loaded!");
// throw 'gg'
// JSON 資料
var CommandData = [
    {
        title: "Moderation Commands",
        commands: [
            {
                name: "/ban",
                description: "ban a member",
                advanced: false,
                usage: ["/ban @member"],
            },
            {
                name: "/kick",
                description: "kick a member",
                advanced: false,
                usage: ["/kick @member"],
            },
            {
                name: "/mute",
                description: "mute a member",
                advanced: false,
                usage: ["/mute @member"],
            },
        ],
    },
    {
        title: "General Commands",
        commands: [
            {
                name: "/help",
                description: "Bot's help menu",
                advanced: false,
                usage: ["/help", "/help command:ban"],
            },
            {
                name: "/ping",
                description: "Get bot's host server status & latency",
                advanced: false,
                usage: ["/ping"],
            },
            {
                name: "/invite",
                description: "Invite bot to your server",
                advanced: false,
                usage: ["/invite"],
            },
        ],
    },
    {
        title: "Leveling Commands",
        commands: [
            {
                name: "/leaderboard",
                description: "Get your servers leaderboards",
                advanced: false,
                usage: ["/leaderboard"],
            },
        ],
    },
    {
        title: "Premium Commands",
        commands: [
            {
                name: "/reactionrole",
                description:
                    "start the setup process for creating a reaction role",
                advanced: true,
                usage: ["/reactionrole"],
            },
            {
                name: "/slowmode",
                description: "add slowmode for a channel",
                advanced: true,
                usage: ["/slowmode :time"],
            },
        ],
    },
];

// 生成 HTML 結構

// 創建類別索引
var categoryButtonsDiv = document.getElementById("commands-types-btn");

CommandData.forEach((category, index) => {
    var button = document.createElement("button");
    button.onclick = function () {
        active(this);
    };
    button.id = `CommandsBtn${ index }`;
    button.className = "text-decoration-none btn btn-primary mt-2 my-1 p-2";
    button.innerHTML = `
    <i class="fas ${ getCategoryIcon(index) } ttt"></i>&nbsp;&nbsp; ${ category.title
        }
  `;

    categoryButtonsDiv.appendChild(button);
    function getCategoryIcon(index) {
        switch (index) {
            case 0:
                return "fa-gift";
            case 1:
                return "fa-globe-europe";
            case 2:
                return "fa-hammer-war";
            case 3:
                return "fa-crown";
            default:
                return "";
        }
    }
});

// 類別按鈕功能
function active(elm) {
    var categoryButtons = document.querySelectorAll(".btn.category-button");
    var categorySections = document.querySelectorAll(".commands-section");

    categoryButtons.forEach((button) => {
        button.classList.remove("active");
    });

    categorySections.forEach((section) => {
        section.setAttribute("hidden", "");
    });

    elm.classList.add("active");

    var categoryId = elm.id.replace("CommandsBtn", "");

    if (categoryId === "All") {
        categorySections.forEach((section) => {
            section.removeAttribute("hidden");
        });
    } else {
        var categorySection = document.getElementById(
            `Category${ categoryId }`
        );
        categorySection.removeAttribute("hidden");
    }
}

// 預設設定類別為所有
document.getElementById("CommandsBtnAll").click();

// 組成命令
function generateCommandSections() {
    var commandSectionsContainer = document.getElementById(
        "commands-list-command"
    );

    CommandData.forEach((category, categoryId) => {
        var commandsSection = document.createElement("div");
        commandsSection.classList.add("commands-section");
        commandsSection.id = `Category${ categoryId }`;

        category.commands.forEach((command) => {
            var accordion = document.createElement("div");
            accordion.classList.add("accordion", "accordion-flush", "mt-2");
            accordion.id = `${ command.name.replace("/", "") }`;

            var accordionItem = document.createElement("div");
            accordionItem.classList.add("accordion-item");

            var accordionHeader = document.createElement("h2");
            accordionHeader.classList.add("accordion-header");
            accordionHeader.id = "flush-headingOne";

            var button = document.createElement("button");
            button.classList.add("accordion-button", "collapsed");
            button.setAttribute("data-bs-toggle", "collapse");
            button.setAttribute(
                "data-bs-target",
                `#f${ command.name.replace("/", "") }`
            );
            button.innerHTML = `
        ${ command.advanced
                    ? '<span class="badge badge-vip rounded-pill"><i class="far fa-crown"></i></span>&nbsp;'
                    : ""
                }
        <div class="d-inline-flex">${ command.name }</div>&nbsp;<span class="command-descreption">${ command.description
                }</span>
      `;
            var accordionCollapse = document.createElement("div");
            accordionCollapse.classList.add("accordion-collapse", "collapse");
            accordionCollapse.id = `f${ command.name.replace("/", "") }`;
            accordionCollapse.setAttribute(
                "data-bs-parent",
                `#${ command.name.replace("/", "") }`
            );

            var accordionBody = document.createElement("div");
            accordionBody.classList.add("accordion-body");

            var usageExamples = command.usage
                .map((example) => `<span class="examples">${ example }</span>`)
                .join("<br />");
            accordionBody.innerHTML = `<span>使用示例：</span><br />${ usageExamples }`;

            accordionCollapse.appendChild(accordionBody);
            accordionHeader.appendChild(button);
            accordionItem.appendChild(accordionHeader);
            accordionItem.appendChild(accordionCollapse);
            accordion.appendChild(accordionItem);
            commandsSection.appendChild(accordion);
        });

        commandSectionsContainer.appendChild(commandsSection);
    });
}
generateCommandSections();

// 搜尋資料用命令
function generateSearchJsonData(inputId, commandData = CommandData) {
    var jsonData = commandData.map(category => ({
        title: category.title,
        commands: category.commands.map(command => command.name.replace("/", ""))
    }));

    var inputHtml = `<input id="commands" value='${ JSON.stringify(jsonData) }' hidden="">`;
    document.getElementById(inputId).innerHTML = inputHtml;
}
generateSearchJsonData("search-input-data", CommandData);