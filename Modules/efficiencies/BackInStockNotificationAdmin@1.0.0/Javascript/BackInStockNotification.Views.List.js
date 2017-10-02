define('BackInStockNotification.Views.List', [

    'BackInStockNotification.Collection',
    'ListHeader.View',
    'BackInStockNotification.Views.List.Details',
    'SC.Configuration',
    'GlobalViews.Pagination.View',
    'GlobalViews.ShowingCurrent.View',

    'backinstocknotification_list.tpl',

    'Backbone',
    'Backbone.CollectionView',
    'Backbone.CompositeView',
    'underscore',
    'jQuery'

], function BackInStockNotificationViewsList(
    Collection,
    ListHeaderView,
    BackInStockNotificationViewsListDetails,
    Configuration,
    GlobalViewsPaginationView,
    GlobalViewsShowingCurrentView,

    backInStockNotificationListTemplate,

    Backbone,
    BackboneCollectionView,
    BackboneCompsiteview,
    _,
    $
) {
    'use strict';

    return Backbone.View.extend({
        template: backInStockNotificationListTemplate,
        pageHeader: _('Back In Stock Subscriptions').translate(),
        title: _('Back In Stock Subscriptions').translate(),

        events: {
            'click [data-type="backinstock-delete"]': 'deleteNotification'
        },

        initialize: function initialize(options) {
            this.options = options;
            this.options.showCurrentPage = true;
            this.application = options.application;
            this.collection = options.collection;

            this.listenCollection();
            this.setupListHeader();

            BackboneCompsiteview.add(this);
        },

        deleteNotification: function deleteNotification(e) {
            var self = this;
            var $anchor = $(e.target);
            var id = $anchor.data('id');
            var line;

            e.preventDefault();

            if (id) {
                line = this.collection.get(id);

                if (line) {
                    line.destroy().success(function successDestroy() {
                        self.showContent();
                    });
                }
            }
        },

        setLoading: function setLoading(isLoading) {
            this.isLoading = isLoading;
        },

        setupListHeader: function setupListHeader() {
            this.listHeader = new ListHeaderView({
                view: this,
                application: this.application,
                collection: this.collection,
                sorts: this.sortOptions,
                avoidFirstFetch: true,
                hidePagination: true
            });
        },

        showContent: function showContent() {
            this.application.getLayout().showContent(this, 'backinstocknotification', [{
                text: this.title,
                href: '/backinstocknotification'
            }]);
        },

        listenCollection: function listenCollection() {
            this.setLoading(true);
            this.collection.on({
                request: $.proxy(this, 'setLoading', true),
                reset: $.proxy(this, 'setLoading', false)
            });
        },

        getSelectedMenu: function getSelectedMenu() {
            return 'backinstocknotification';
        },

        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: this.title,
                href: '/backinstocknotification'
            }];
        },

        sortOptions: [
            {
                value: 'created',
                name: _('By Date').translate(),
                selected: true
            }, {
                value: 'itemName',
                name: _('By Item').translate()
            }
        ],

        childViews: {
            'ListHeader': function ListHeader() {
                return this.listHeader;
            },

            'BackInStockNotification.ListDetails': function BackInStockNotificationListDetails() {
                return new BackboneCollectionView({
                    childView: BackInStockNotificationViewsListDetails,
                    viewsPerRow: 1,
                    collection: this.collection
                });
            },

            'GlobalViews.Pagination': function GlobalViewsPagination() {
                return new GlobalViewsPaginationView(_.extend({
                    totalPages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
                }, Configuration.defaultPaginationSettings));
            },

            'GlobalViews.ShowCurrentPage': function GlobalViewsShowCurrentPage() {
                return new GlobalViewsShowingCurrentView({
                    items_per_page: this.collection.recordsPerPage,
                    total_items: this.collection.totalRecordsFound,
                    total_pages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
                });
            }
        },

        getContext: function getContext() {
            return {
                collectionLength: this.collection.length,
                isLoading: this.isLoading,
                pageHeader: this.pageHeader,
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                showCurrentPage: this.options.showCurrentPage
            };
        }
    });
});
