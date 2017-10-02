define('ResolveAssetUrlUtils', [
    'underscore',
    'jQuery',
    'Utils'
], function UtilsAdditions(
    _,
    jQuery,
    Utils
) {
    'use strict';

    var UtilsAdd;
    var getAbsoluteUrlOriginal = Utils.getAbsoluteUrl;
    var localUrlRoot;

    function getLocalBasePath() {
        var referenceFile;
        var root = '';
        var $script;
        if (SC.isDevelopment) {
            if (localUrlRoot) {
                root = localUrlRoot;
            } else {
                referenceFile = 'javascript/require.js';
                $script = jQuery('script[src$="' + referenceFile + '"]');
                root = $script.attr('src').replace(referenceFile, '{{file}}');
                localUrlRoot = root;
            }
        }
        return root;
    }

    function getLocalUrl(file) {
        var baseUrl = Utils.getLocalBasePath();
        var fileReplace = file ? file : '';
        return baseUrl ? baseUrl.replace('{{file}}', fileReplace) : file;
    }

    function getAbsoluteUrl(file, useLocal) {
        var url;
        if (!useLocal || !SC.isDevelopment) {
            url = getAbsoluteUrlOriginal.call(Utils, file);
        } else {
            url = Utils.getLocalUrl(file);
        }
        return url;
    }

    /**
     * Get absolute path to provided relative path from the hosting root
     * @param file Relative path to file from hosting root
     * @returns string
     */
    function getHostingRootUrl(file, useLocal) {
        var url;
        if (!useLocal || !SC.isDevelopment) {
            url = Utils.getAbsoluteUrl('../' + file);
        } else {
            url = Utils.getLocalUrl('hosting-root-files/' + file);
        }
        return url;
    }

    UtilsAdd = {
        getAbsoluteUrl: getAbsoluteUrl,
        getHostingRootUrl: getHostingRootUrl,
        getLocalBasePath: getLocalBasePath,
        getLocalUrl: getLocalUrl
    };

    _.extend(Utils, UtilsAdd);
    _.extend(SC.Utils, UtilsAdd);
    _.mixin(UtilsAdd);

    return Utils;
});