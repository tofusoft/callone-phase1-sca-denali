define('PSCategories.Model', [
    'SC.Model',
    'BigCache',
    'PSCategories.Configuration',
    'underscore'
], function PSCategoriesModel(
    SCModel,
    BigCache,
    CategoriesConfiguration,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'PSCategories',

        isSecure: request.getURL().indexOf('https') === 0,

        fieldsets: {
            bootstrapping: [
                'internalid',
                'name',
                'urlcomponent',
                'url',
                'facetUrl',
                'metataghtml'
            ],
            list: [
                'internalid',
                'name',
                'urlcomponent',
                'briefDescription',
                'thumbnail',
                'storedisplayimage',
                'url',
                'facetUrl'
            ],
            details: [
                'internalid',
                'name',
                'urlcomponent',
                'pageTitle',
                'image',
                'description',
                'metataghtml',
                'url',
                'facetUrl'
            ]
        },

        modes: {
            bootstrapping: [
                'bootstrapping',
                'bootstrapping',
                'bootstrapping'
            ],
            parentChilds: [
                'details',
                'list',
                'bootstrapping'
            ]
        },

        fieldsMapping: {
            internalid: 'internalid',
            itemid: 'name',
            description2: 'briefDescription',
            storedetaileddescription: 'description',
            storedisplaythumbnail: 'thumbnail',
            storedisplayimage: 'image',
            pagetitle: 'pageTitle',
            metataghtml: 'metataghtml',
            urlcomponent: 'urlcomponent'
        },

        getForBootstraping: function getForBootstraping() {
            // Shortcut for Environment bootstraping
            return this._getTreeWithFieldset(this.getFullTree(), this.modes.bootstrapping, 0);
        },

        getFullTree: function getFullTree() {
            var cache = this.getCategoriesCache();
            var cacheTtl = this.isSecure ? CategoriesConfiguration.secureTTL : CategoriesConfiguration.unsecureTTL;
            var cacheKey = 'category-tree-';
            var categories;
            var apiCategoriesResponse;
            var categoriesCache = cache.get(cacheKey);

            if (cacheTtl) {
                try {
                    categories = JSON.parse(categoriesCache);
                } catch(e) {
                    categories = null;
                }
            }

            if (!categories) {
                apiCategoriesResponse = session.getSiteCategoryContents(true);
                categories = this.parseTree(apiCategoriesResponse[0]);
                cache.put(cacheKey, JSON.stringify(categories), cacheTtl);
            }

            return categories;
        },

        _getTreeWithFieldset: function _getTreeWithFieldset(pCategory, mode, depth) {
            var fieldset;
            var category;
            var self = this;

            // Pick the correct fieldset for the response. It depends on the nesting level
            fieldset = this.fieldsets[mode[(depth > 2) ? 2 : depth]];

            // Filter out unneeded fields
            category = _.pick(pCategory, fieldset);

            // Children object with key: urlcomponent, value: children category
            category.categories = {};

            // Recursively call children
            _.each(pCategory.categories, function eachTreeWithFieldset(sub) {
                var cSub = self._getTreeWithFieldset(sub, mode, depth + 1);
                category.categories[cSub.urlcomponent] = cSub;
            });

            return category;
        },

        list: function list(internalid, levels) {
            var hash = this.getHash();
            var cat = hash[internalid.toString()];

            this._objectify(hash, cat, levels, 1);

            return this._getTreeWithFieldset(cat, this.modes.parentChilds, 0);
        },

        _objectify: function _objectify(hash, category, maxLevels, level) {
            var categories = [];
            var self = this;

            if (!maxLevels || maxLevels > level) {
                _.each(category.categories, function eachObjectify(c) {
                    self._objectify(hash, hash[c], maxLevels, level + 1);
                    categories.push(hash[c]);
                });

                category.categories = categories;
            }
        },

        generateHash: function generateHash(category, hash) {
            var self = this;
            var categoriesIds = [];

            if (category.categories) {
                _.each(category.categories, function eachGenerateHash(value) {
                    self.generateHash(value, hash);
                    categoriesIds.push(value.internalid);
                });
                category.categories = categoriesIds;
            }
            hash[category.internalid.toString()] = category;
        },

        parseTree: function parseTree(category, url, facetUrl, pLevelCount) {
            var c = {};
            var self = this;
            var nextUrl;
            var levelCount = pLevelCount || 0;

            // convert names
            _.each(this.fieldsMapping, function eachParseTree(value, key) {
                c[value] = category[key];
            });

            // add missing urlcomponents to default
            c.urlcomponent = c.urlcomponent || c.name;

            // add tab value
            if (c.internalid > 0) {
                c.url = (url ? url + '/' + c.urlcomponent : '/' + c.urlcomponent);
            } else {
                c.url = '';
            }

            nextUrl = (CategoriesConfiguration.siteBuilderCategoryPaths && levelCount > 1) ? url : c.url;

            c.facetUrl  = (facetUrl ? facetUrl + c.urlcomponent : c.urlcomponent) + '/';

            // subcategories
            c.categories = {};
            if (category.categories) {
                _.each(category.categories, function eachParseTreeSub(value) {
                    var subTree = self.parseTree(value, nextUrl, c.facetUrl, levelCount + 1);
                    c.categories[subTree.urlcomponent] = subTree;
                });
            }

            return c;
        },

        getHash: function getHash() {
            var cache = this.getCategoriesCache();
            var cacheTtl = this.isSecure ? CategoriesConfiguration.secureTTL : CategoriesConfiguration.unsecureTTL;
            var cacheKey = 'category-hash-';
            var hash;
            var hashCache = cache.get(cacheKey);

            if (cacheTtl) {
                try {
                    hash = JSON.parse(hashCache);
                } catch(e) {
                    hash = null;
                }
            }

            if (!hash) {
                hash = {};
                this.generateHash(this.getFullTree(), hash);
                cache.put(cacheKey, JSON.stringify(hash), cacheTtl);
            }
            return hash;
        },

        getCategoriesCache: function getCategoriesCache() {
            var siteId = session.getSiteSettings(['siteid']).siteid;
            var isSecureKey = this.isSecure ? 'secure' : 'unsecure';
            var languageLocale = session.getShopperLanguageLocale();

            return new BigCache(
                isSecureKey + 'PS-Categories-' + siteId + '-' + languageLocale,
                CategoriesConfiguration.chunkSize
            );
        },
        getConfig: function getConfig() {
            return {
                siteBuilderCategoryPaths: CategoriesConfiguration.siteBuilderCategoryPaths
            };
        }
    });
});