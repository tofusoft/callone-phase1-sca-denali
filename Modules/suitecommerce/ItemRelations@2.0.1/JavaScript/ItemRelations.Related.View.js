/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemRelations
define('ItemRelations.Related.View'
,	[	'Backbone.CollectionView'
	,	'ItemViews.RelatedItem.View'
	,	'ItemRelations.Related.Collection'
	,	'SC.Configuration'

	,	'item_relations_related.tpl'
	,	'item_relations_row.tpl'
	,	'item_relations_cell.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	,	'Utils'

	]
,	function (
		BackboneCollectionView
	,	ItemViewsRelatedItemView
	,	ItemRelationsRelatedCollection
	,	Configuration

	,	item_relations_related_tpl
	,	item_relations_row_tpl
	,	item_relations_cell_tpl

	,	jQuery
	,	Backbone
	,	_
	)
{
	'use strict';

	// @class ItemRelations.Related.View @extends Backbone.CollectionView
	return BackboneCollectionView.extend({

		initialize: function ()
		{
			var application = this.options.application
			,	is_sca_advance = application.getConfig('siteSettings.sitetype') === 'ADVANCED'
			,	collection = is_sca_advance ? new ItemRelationsRelatedCollection({itemsIds: this.options.itemsIds}) : new Backbone.Collection()
			,	self = this;

			BackboneCollectionView.prototype.initialize.call(this, {
				collection: collection
			,	viewsPerRow: Infinity
			,	cellTemplate: item_relations_cell_tpl
			,	rowTemplate: item_relations_row_tpl
			,	childView: ItemViewsRelatedItemView
			,	template: item_relations_related_tpl
			});

			if (is_sca_advance)
			{
				this.options.application.getLayout().once('afterAppendView', function ()
				{
					self.collection.fetchItems()
					.done(function ()
					{
						self.render();

						var carousel = self.$el.find('[data-type="carousel-items"]');

						if(_.isPhoneDevice() === false && application.getConfig('siteSettings.imagesizes'))
						{
							var img_min_height = _.where(application.getConfig('siteSettings.imagesizes'), {name: application.getConfig('imageSizeMapping.thumbnail')})[0].maxheight;

							carousel.find('.item-views-related-item-thumbnail').css('minHeight', img_min_height);
						}

						_.initBxSlider(carousel, Configuration.bxSliderDefaults);
					});
				});
			}
		}
	});
});
