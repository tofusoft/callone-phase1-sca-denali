define('ItemViews.Price.View.Site', [
    'ItemViews.Price.View',
    'underscore'], function (
        ItemViewsPriceView,
        _
    ) {
        _.extend(ItemViewsPriceView.prototype, {
            getContext: _.wrap(ItemViewsPriceView.prototype.getContext,
                function wrapgetContext(fn) {
                    var self = this;
                    var result = fn.apply(this, _.toArray(arguments).slice(1));
                    result.isCellView = self.options.origin == 'ITEMCELL';
                    result.savedPrice = ((result.comparePrice ? result.comparePrice : 0) - (result.price ? result.price : 0)).toFixed(2);
                    return result;
                })
            });
        });
