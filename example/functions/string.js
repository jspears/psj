function capitalize(val) {
    if (!val)
        return;
    return val.substring(0, 1).toUpperCase() + val.substring(1);
}

function title(val) {
    if (!val) return;
    return val.split(/\s*/).map(capitalize).join(' ');
}


module.exports = {
    capitalize: capitalize,
    title: title
}
