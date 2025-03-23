
sanitizeNumber = (value) => {
    if (typeof value === "number" && !isNaN(value)) {
        return value;
    }
    return 0;
};
module.exports = { sanitizeNumber };