define('ItemsKeyMapping.Site', [
    'ItemsKeyMapping',
    'underscore'
], function (
    ItemsKeyMapping,
    _
) {
    _.extend(ItemsKeyMapping, {
        getKeyMapping: _.wrap(ItemsKeyMapping.getKeyMapping, function(fn){
            var self = this;
            var params = _.toArray(arguments).slice(1);
            var result = fn.apply(this, params);
            // Compare with MSRP, which is List Price in Netsuite
            result._comparePriceAgainst = function (item) {
                return item.get('pricelevel1');
            };

            result._comparePriceAgainstFormated = function (item) {
                return item.get('pricelevel1_formatted');
            };
            return result;
        })
    });
});
