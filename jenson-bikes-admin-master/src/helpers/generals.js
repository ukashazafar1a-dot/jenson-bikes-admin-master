export const  htmlDecode = function(input) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = input;
    return textArea.value;
}
export const htmlEncode = function(input) {
    const textArea = document.createElement("textarea");
    textArea.innerText = input;
    return textArea.innerHTML.split("<br>").join("\n");
}