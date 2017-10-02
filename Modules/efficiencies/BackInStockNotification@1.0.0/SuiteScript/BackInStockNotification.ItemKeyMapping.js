/* ItemKeyMapping works as a similar concept to the one in frontend
* Given a context (language, currency), returns the correct value.
* It's important that you fix the properties that you changed in frontend
* For example, if you use a custom field for the name, you should change the name key.
* For images, it uses the image 0
* For urlcomponent, it can generate urls with the ?child= for deep linking to the sku.
* For translated fields, it tries to translate the field first
* It also resolves the fact that some attributes are on parents and not on child items (images!)
* You could put custom code to make the image match your SKU image, using your naming convention
* */
define('BackInStockNotification.ItemKeyMapping', function itemKeyMapperDefine() {
    'use strict';

    function itemKeyMapper(context, obj, key) {
        var value;

        if (key === 'name') {
            // My store display name
            return itemKeyMapper(context, obj, 'storedisplayname') ||
                // My Parent's store display name. Webstore uses this for matrix item name.
                (obj.matrix_parent && itemKeyMapper(context, obj.matrix_parent, 'storedisplayname')) ||
                // My display name
                itemKeyMapper(context, obj, 'displayname') ||
                (obj.matrix_parent && itemKeyMapper(context, obj.matrix_parent, 'displayname')) ||
                itemKeyMapper(context, obj, 'itemid');
        }

        if (key === 'price' || key === 'price_formatted') {
            // one price
            if (obj.price[key]) {
                value = obj.price[key];
            } else {
                // multicurrency
                value = obj.price[context.currency][key];
            }
        }

        if (key === 'urlcomponent') {
            if (obj.matrix_parent) {
                value = itemKeyMapper(context, obj.matrix_parent, 'urlcomponent');
            } else {
                if (obj.urlcomponent) {
                    value = obj.urlcomponent;
                } else {
                    value = 'product/' + obj.internalid;
                }
            }

            if (obj.matrix_parent) {
                value = value + '?child=' + obj.internalid;
            }
        }

        // Images
        if (key === 'imageurl') {
            value = obj.images && obj.images[0] && obj.images[0].url;
        }

        if (key === 'imagealt') {
            value = obj.images && obj.images[0] && obj.images[0].alt;
        }

        // Translatable field field
        if (obj.translations && obj.translations[context.language] && obj.translations[context.language][key]) {
            value = obj.translations[context.language][key];
        }

        if (!value) {
            value =  obj[key];
        }

        if (!value && obj.matrix_parent) {
            value = itemKeyMapper(context, obj.matrix_parent, key);
        }

        return value;
    }

    return itemKeyMapper;
});
