export function get_contrast_color(hex) {
    if (hex == null || hex == "") {
        return "#000000";
    }

    const red = parseInt(hex.slice(1, 3), 16);
    const blue = parseInt(hex.slice(3, 5), 16);
    const green = parseInt(hex.slice(5, 7), 16);

    if ((red * 0.299 + green * 0.587 + blue * 0.114) > 186) {
        return "#000000";
    }
    return "#ffffff";
}

export function clean_text(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}