define('Facets.Translator.Categories', [
    'Categories',
    'Facets.Translator',
    'underscore'
], function FacetsTranslatorCategories(
    Tree,
    Translator,
    _
) {
    'use strict';

    _.extend(Translator.prototype, {
        // @Custom Facets.Translator.setProductUrl
        setProductUrl: function setProductUrl(product) {
            this.product = product;
        },
        // @Custom Facets.Translator.getProductUrl
        getProductUrl: function getProductUrl() {
            return this.product;
        },
        // @Custom Facets.Translator.getCategory
        getCategory: function getCategory() {
            var cats = this.getCategoryPath();
            return cats && cats[cats.length - 1];
        },
        // @Custom Facets.Translator.getCategoryPath
        getCategoryPath: function getCategoryPath() {
            var facet;
            var value;

            if (typeof this.cachedCategoryPath === 'undefined') {
                facet =  _.findWhere(this.facets, {id: 'category'});
                value = facet && Tree.getBranchLineFromFacetPath(facet.value);

                this.cachedCategoryPath = value || null;
            }

            return this.cachedCategoryPath;
        },
        // @Custom Facet.Translator.isProduct
        isProduct: function isProduct() {
            return !!this.product;
        },

        // @Overrides Facets.Translator.parseUrl
        parseUrl: function parseUrl(pUrl) {
            // We remove a posible 1st / (slash)
            var url = (pUrl[0] === '/') ? pUrl.substr(1) : pUrl;

            // given an url with options we split them into 2 strings (options and facets)
            var facets_n_options = url.split(this.configuration.facetDelimiters.betweenFacetsAndOptions);
            var facets = (facets_n_options[0] && facets_n_options[0] !== this.configuration.fallbackUrl) ? facets_n_options[0] : '';
            var options = facets_n_options[1] || '';
            var category_string;
            var categories;
            var facet_tokens;
            var tmp_options = {};
            var options_tokens;



            // We treat category as the 1st unmaned facet filter, so if you are using categories
            // we will try to take that out by comparing the url with the category tree
            if (this.getFacetConfig('category')) {
                categories = Tree.getBranchLineFromPath(facets) || [];
                if (categories && categories.length) {
                    // We set the value for this facet
                    category_string = categories[categories.length - 1].url;
                    category_string = (category_string[0] === '/') ? category_string.substr(1) : category_string;

                    this.parseFacet('category', categories[categories.length - 1].facetUrl);

                    // And then we just take it out so other posible facets are computed
                    facets = facets.replace(category_string, '');
                }
                // We remove a posible 1st / (slash) (again, it me be re added by taking the category out)
                facets = (facets[0] === '/') ? facets.substr(1) : facets;
            }


            // The facet part of the url gets splited and computed by pairs
            facet_tokens = facets.split(
                new RegExp('[\\' + this.configuration.facetDelimiters.betweenDifferentFacets
                    + '\\' + this.configuration.facetDelimiters.betweenFacetNameAndValue + ']+', 'ig')
            );

            //It COULD be a product. Check for only ONE token left (tokens should come in pairs!) or it's "product" facet (for url's /product/id
            if (facet_tokens.length === 1 || (facet_tokens.length === 2 && facet_tokens[0] === 'product')) {
                this.setProductUrl(facets);
            }

            while (facet_tokens.length > 0) {
                this.parseUrlFacet(facet_tokens.shift(), facet_tokens.shift());
            }

            // The same for the options part of the url
            options_tokens = options.split(
                new RegExp('[\\' + this.configuration.facetDelimiters.betweenOptionNameAndValue + '\\' +
                    this.configuration.facetDelimiters.betweenDifferentOptions + ']+', 'ig')
            );

            while (options_tokens.length > 0) {
                tmp_options[options_tokens.shift()] = options_tokens.shift();
            }

            this.parseUrlOptions(tmp_options);
        },

        // GETURL
        getUrl: function getUrl() {
            var url = '';
            var self = this;


            // Prepares seo limits
            var facets_seo_limits = {};

            if (SC.ENVIRONMENT.jsEnvironment === 'server') {
                facets_seo_limits = {
                    numberOfFacetsGroups: this.configuration.facetsSeoLimits && this.configuration.facetsSeoLimits.numberOfFacetsGroups,
                    numberOfFacetsValues: this.configuration.facetsSeoLimits && this.configuration.facetsSeoLimits.numberOfFacetsValues,
                    options: this.configuration.facetsSeoLimits && this.configuration.facetsSeoLimits.options || false
                };
            }

            if (!_.isNumber(facets_seo_limits.numberOfFacetsGroups)) {
                facets_seo_limits.numberOfFacetsGroups = false;
            }
            if (!_.isNumber(facets_seo_limits.numberOfFacetsValues)) {
                facets_seo_limits.numberOfFacetsValues = false;
            }


            // Adds the category if it's present
            var category = this.getCategory(),
                category_string = category && category.url;

            //Append category. Remove the possible last slash (/)
            if (category_string) {
                url = category_string;
                if (url[url.length - 1] === self.configuration.facetDelimiters.betweenDifferentFacets) {
                    url = url.slice(0, -1);
                }
            }

            var facetRealLength = this.facets.length;
            if(category_string){
                facetRealLength --;
            }

            if (_.isNumber(facets_seo_limits.numberOfFacetsGroups) && facetRealLength> facets_seo_limits.numberOfFacetsGroups) {
                return url;
            }

            // Encodes the other Facets
            var sorted_facets = _.sortBy(this.facets, 'url');

            for (var i = 0; i < sorted_facets.length; i++) {
                var facet = sorted_facets[i];
                // Category should be already added
                if (facet.id === 'category') {
                    continue; // reference bug
                }

                var name = facet.url || facet.id,
                    value = '';

                switch (facet.config.behavior) {
                    case 'range':
                        facet.value = (typeof facet.value === 'object') ? facet.value : {from: 0, to: facet.value};
                        value = facet.value.from + self.configuration.facetDelimiters.betweenRangeFacetsValues + facet.value.to;
                        break;
                    case 'multi':
                        value = facet.value.sort().join(self.configuration.facetDelimiters.betweenDifferentFacetsValues);

                        if (facets_seo_limits.numberOfFacetsValues && facet.value.length > facets_seo_limits.numberOfFacetsValues) {
                            return '#';
                        }

                        break;
                    default:
                        value = facet.value;
                }

                url += self.configuration.facetDelimiters.betweenDifferentFacets + name + self.configuration.facetDelimiters.betweenFacetNameAndValue + value;
            }

            url = (url !== '') ? url : '/' + this.configuration.fallbackUrl;

            // Encodes the Options
            var tmp_options = {}
                , separator = this.configuration.facetDelimiters.betweenOptionNameAndValue;
            if (this.options.order && this.options.order !== this.configuration.defaultOrder) {
                tmp_options.order = 'order' + separator + this.options.order;
            }

            if (this.options.page && parseInt(this.options.page, 10) !== 1) {
                tmp_options.page = 'page' + separator + encodeURIComponent(this.options.page);
            }

            if (this.options.show && parseInt(this.options.show, 10) !== this.configuration.defaultShow) {
                tmp_options.show = 'show' + separator + encodeURIComponent(this.options.show);
            }

            if (this.options.display && this.options.display !== this.configuration.defaultDisplay) {
                tmp_options.display = 'display' + separator + encodeURIComponent(this.options.display);
            }

            if (this.options.keywords && this.options.keywords !== this.configuration.defaultKeywords) {
                tmp_options.keywords = 'keywords' + separator + encodeURIComponent(this.options.keywords);
            }

            var tmp_options_keys = _.keys(tmp_options)
                , tmp_options_vals = _.values(tmp_options);


            // If there are options that should not be indexed also return #
            if (facets_seo_limits.options && _.difference(tmp_options_keys, facets_seo_limits.options).length) {
                return '#';
            }

            url += (tmp_options_vals.length) ?
                this.configuration.facetDelimiters.betweenFacetsAndOptions +
                tmp_options_vals.join(this.configuration.facetDelimiters.betweenDifferentOptions) : '';

            return _(url).fixUrl();
        }

    });

    return Translator;
});