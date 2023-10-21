var alertPlaceholder = document.getElementById(
    "AlertMessagesPlaceholder" // 訊息警告區
);
if (!alertPlaceholder) {
    alertPlaceholder = document.createElement('div');
    alertPlaceholder.id = "AlertMessagesPlaceholder";
    alertPlaceholder.classList.add("p-2")
    alertPlaceholder.style.position = "fixed"
    alertPlaceholder.style.bottom = 0;
    alertPlaceholder.style.right = 0;
    document.body.append(alertPlaceholder)
}
/**
 * 
 * @param {String} title 標題
 * @param {String} message 訊息
 * @param {String} time 時間
 * @param {'success'|'info'|'error'|'warning'} type 訊息類別
 */
var appendAlert = (
    title = "錯誤",
    message = "無法得知錯誤",
    time = "",
    type = "info"
) => {
    var wrapper = document.createElement("div");
    var emoji = "";
    switch (type) {
        case "success":
            emoji = "✔";
            break;
        case "info":
            emoji = "💬";
            break;
        case "error":
            emoji = "❌";
            break;
        case "warning":
            emoji = "⚠";
            break;
        default:
            emoji = "💬";
            break;
    }
    wrapper.innerHTML = [
        `<div class="toast-container position-static">`,
        `<div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">`,
        `<div class="toast-header custom-cursor-default-hover">`,
        `<div class="rounded me-2">${ emoji }</div>`,
        `<strong class="me-auto">${ title }</strong>`,
        `<small class="text-body-secondary">${ time }</small>`,
        `<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`,
        `</div>`,
        `<div class="toast-body custom-cursor-default-hover">`,
        `${ message }`,
        `</div>`,
        `</div>`,
    ].join("");

    alertPlaceholder.append(wrapper);
};
