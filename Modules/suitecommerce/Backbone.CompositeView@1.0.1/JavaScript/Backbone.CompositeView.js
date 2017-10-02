/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module BackboneExtras
#Composite Views
See @?ref Backbone.CompositeView
@module Backbone.CompositeView @class Backbone.CompositeView
The module Backbone.CompositeView adds support for Backbone Views composition.

First, the parent view needs to declare a place holder element in its template to render the children
in it. Children are referenced by name, given in the data-view HTML attribute:

	<div data-view="Promocode"></div>

The parent view must also declare how its sub views will be created. For doing so it declares the childViews property
which is an object with properties that can be either functions or Backbone.View subclasses. Each defined function must return
an instance of a Backbone.View. For instance

	childViews: {
		'Promocode': function()
		{
			return new PromocodeView({model: this.model.get('promocode')});
		}
	,	'SomeWidget': SomeWidget
	}


The function callback takes as an arguments the data attributes of the element placeholder. For example if a placeholder
element contains a data attribute named color

<div data-view="Rectangle.View" data-color="#FF0000"></div>

The function callback will have an key named color using that value.

	childViews: {
		'Rectangle.View': function(options)
		{
			return new RectangleView({ color: options.color });
		}
	}

In the case of Backbone.View subclasses in the childViews properties the options are passed to the initialize function.
So the previous example could be written as

	childViews: {
		'Rectangle.View': RectangleView
	}

So in summary, the parent view has all the responsibility of declaring the location of the child
views in the markup and to instantiate its child views by name. Also has the responsibility of
destroying its children and this is done automatically.

For making a Backbone.View to be a CompositeView, we must inherit like this:

	var CompositeView = require('Backbone.CompositeView');
	var MyView = new backbone.View.extend({
		initialize: function()
		{
			CompositeView.add(this);
			//now this view is a composite view!
		}
	});

Children constructor functions and children instances are available in the parent view, but there
aren't children to parent references, only a boolean hasParent.
*/

define(
	'Backbone.CompositeView'
,	[
		'Backbone'
	,	'jQuery'
	,	'underscore'
	,	'Utils'
	,	'Backbone.CollectionView'
	,	'PluginContainer'
	,	'Backbone.View'
	,	'Backbone.View.render'
	]
,	function(
		Backbone
	,	jQuery
	,	_
	,	Utils
	,	BackboneCollectionView
	,	PluginContainer
	)
{
	'use strict';

	// @module Backbone @class Backbone.View
	// @property {PluginContainer} afterCompositeViewRender Plugins registered here will be called when
	// a composite view finish rendering it self and all its children.
	Backbone.View.afterCompositeViewRender = new PluginContainer();

	// @class Backbone.CompositeView
	return {

		// @method add install makes the passed view a Composite View. Views that want to be composite should call this method at initialize @static
		// @param {Backbone.View} view the view instance we want to transform in a CompositeView.
		add: function (view)
		{
			view.childViews = view.childViews || {};
			view.childViewInstances = view.childViewInstances || {};
			var self = this;

			view.renderChilds = function (fn)
			{
				// call super.render() - then interate on [data-view] placeholders and render the children inside.
				var result = fn ? fn.apply(this, Array.prototype.slice.call(arguments)) : this;

				this.$el.find('[data-view]').each(function ()
				{
					view.renderChild(this, true);
				});

				// @event beforeCompositeViewRender triggered just before a view's children finish rendering in the DOM
				this.trigger('beforeCompositeViewRender', this);

				Backbone.View.afterCompositeViewRender.executeAll(this);

				// @event afterCompositeViewRender triggered when a view's children finish rendering in the DOM
				this.trigger('afterCompositeViewRender', this);

				return result;
			};

			//@method Renders the child view specified in elementOrViewName. Appends content if flag append is true
			//@param {DOM element or String} elementOrViewName. DOM element or View name as registered in childViews. Used to get the actual child view
			//@param {boolean} append. Flag to append content or empty the view before rendering the child.
			view.renderChild = function (elementOrViewName, append)
			{
				var element;
				if(typeof(elementOrViewName) === 'string')
				{
					element = this.$el.find('[data-view="' + elementOrViewName + '"]');
				}
				else
				{
					element = elementOrViewName;
				}

				element = jQuery(element);


				var element_data = element.data()
				,	child_name = element_data && element_data.view;

				if (!view.childViews[child_name])
				{
					return;
				}

				var child_view = view.childViewInstances[child_name];

				if(!append && child_view)
				{
					// soft destroys view (preserves div element)
					child_view._destroy(true);
				}

				var childViewGenerator = view.childViews[child_name];

				if(childViewGenerator.extend === Backbone.View.extend)
				{
					// special case of 'Some.View': SomeView
					child_view = view.childViewInstances[child_name] = new childViewGenerator(element_data);
				}
				else
				{
					// common case 'Some.View': function() { ... }
					child_view = view.childViewInstances[child_name] = view.childViews[child_name].call(view, element_data);
				}

				if(!child_view)
				{
					// if the childViews returned a null (or undefined reference) cancel the whole thing.
					return;
				}

				child_view.hasParent = true;
				child_view.placeholderData = element_data || {};

				if (child_view instanceof BackboneCollectionView)
				{
					// Override template if collection views
					self._setCustomTemplate(element, child_view, 'cell');
					self._setCustomTemplate(element, child_view, 'row');
					self._setCustomTemplate(element, child_view, 'child');
				}
				else
				{
					// Default template extension point
					self._setCustomTemplate(element, child_view);
				}

				self._finishRender(child_view, element);

				return child_view;
			};

			view.render = _.wrap(view.render, view.renderChilds);

			// @method destroyChilds destroy() the children views of this view but not self.
			// @param {boolean} softDestroy. Flag to empty child views, leaving the container div instead of deleting it.
			view.destroyChilds = function (softDestroy)
			{
				_(this.childViewInstances).each(function (child)
				{
					child.destroy(softDestroy);
				});

				if(!softDestroy)
				{
					this.childViewInstances = null;
				}
			};

			// overrides destroy() so we first destroy its children and then ourself.
			view.destroy = _.wrap(view.destroy, function (fn)
			{
				_(view.childViewInstances).each(function (child)
				{
					child && child.destroy();
				});
				fn.apply(this, Array.prototype.slice.call(arguments));
			});

			// @method visitChildren recursively visit all the children @param {Function} visitor
			view.visitChildren = function (visitor)
			{
				_(view.childViewInstances).each(function (child)
				{
					visitor(child);
					if (child.visitChildren)
					{
						child.visitChildren(visitor);
					}
				});
			};
		}

		// @method _setCustomTemplate Select the best templated based on the current view port with and set it to the child view
		// @param {jQuery} placeholder Element container of the child. This is the div that contains the tag data-view="..."
		// @param {Backbone.View} child_view Instance of the child view to be inserted
		// @param {String} template_prefix Prefix of the templates. This is used with Collections Views that have multiples data templates, like data-row-template, data-cell-template, etc
	,	_setCustomTemplate: function (placeholder, child_view, template_prefix)
		{
			template = template || '';
			var data_template_prefix = template_prefix ? template_prefix + '-' : ''
			,	template_name = child_view.placeholderData[data_template_prefix + 'template'];

			var definitive_template_name = Utils.selectByViewportWidth({
				phone: child_view.placeholderData[data_template_prefix + 'phoneTemplate'] //remember that data-phone-template get's converted in phoneTemplate when we use jQuery.data()
			,	tablet: child_view.placeholderData[data_template_prefix + 'tabletTemplate']
			,	desktop: template_name
			}, template_name);

			if (definitive_template_name)
			{
				// IMPORTANT: we are require()ing the template dynamically! In order to this to work, the template should
				// be ALREADY loaded. This take importance when doing unit tests!
				var template = Utils.requireModules(definitive_template_name + '.tpl');
				child_view[template_prefix ? template_prefix + 'Template' : 'template'] = template;
			}

		}

		// @method _finishRender Render the chidlview and insert its result into the placeholder
		// @param {Backbone.View} child_view Instance of the view to be inserted
		// @param {jQuery} $placeholder Element container of the child. This is the div that contains the tag data-view="..."
	,	_finishRender: function (child_view, $placeholder)
		{
			//HEADS UP! we use the placeholder as the children view's container element ($el)
			child_view.$el = $placeholder;

			// keep the placeholder classes
			var placeholder_class = $placeholder.attr('class');
			child_view.className = (child_view.className||'') + ' ' + (placeholder_class||'');

			child_view.render();
		}
	};

});