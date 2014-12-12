
var Functions = function () {

    const unit = 37.795;

    this.toNumber = function (value) {
        if (typeof value === 'string') {
            value = parseFloat(value.replace(',', '.'));
        }
        return value;
    };

    this.toUnit = function (value) {
        return (this.toNumber(value) / unit).toFixed(2);
    };

    this.fromUnit = function (value) {
        return parseFloat(this.toNumber(value)) * unit;
    };
};