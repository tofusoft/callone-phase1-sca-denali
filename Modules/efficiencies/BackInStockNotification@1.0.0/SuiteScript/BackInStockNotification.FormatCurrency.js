define('BackInStockNotification.FormatCurrency', function BackInStockNotificationFormatCurrency() {
    'use strict';

    function formatCurrency(value, symbol, settings) {
        var valueFloat = parseFloat(value);
        var isNegative;
        var valueString;
        var theSettings = settings || {};

        var groupseparator = theSettings.groupseparator || ',';
        var decimalseparator = theSettings.decimalseparator || '.';
        var negativeprefix = theSettings.negativeprefix || '(';
        var negativesuffix = theSettings.negativesuffix || ')';

        var decimalPosition;
        var thousandString = '';

        var i;

        var theSymbol = symbol || '$';

        if (isNaN(valueFloat)) {
            // return value;
            valueFloat = parseFloat(0);
        }

        isNegative = valueFloat < 0;
        valueFloat = Math.abs(valueFloat);
        valueFloat = parseInt((valueFloat + 0.005) * 100, 10) / 100;

        valueString = valueFloat.toString();

        valueString = valueString.replace('.', decimalseparator);
        decimalPosition = valueString.indexOf(decimalseparator);

        // if the string doesn't contains a .
        if (!~decimalPosition) {
            valueString += decimalseparator + '00';
            decimalPosition = valueString.indexOf(decimalseparator);
            // if it only contains one number after the .
        } else if (valueString.indexOf(decimalseparator) === (valueString.length - 2)) {
            valueString += '0';
        }

        for (i = valueString.length - 1; i >= 0; i--) {
            // If the distance to the left of the decimal separator is
            // a multiple of 3 you need to add the group separator
            thousandString = (i > 0 && i < decimalPosition &&
                (((decimalPosition - i) % 3) === 0) ? groupseparator : '') + valueString[i] + thousandString;
        }

        valueString = theSymbol + thousandString;

        return isNegative ? (negativeprefix + valueString + negativesuffix) : valueString;
    }

    return formatCurrency;
});
