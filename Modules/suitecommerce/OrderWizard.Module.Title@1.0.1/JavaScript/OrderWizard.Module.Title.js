/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard
define(
	'OrderWizard.Module.Title'
,	[	'Wizard.Module'

	,	'order_wizard_title.tpl'

	,	'underscore'
	]
,	function (
		WizardModule

	,	order_wizard_title_tpl

	,	_
	)
{
	'use strict';

	//@class OrderWizard.Module.Title @extend WizardModule
	return WizardModule.extend(
	{
		template: order_wizard_title_tpl

		//We override render to just render this module in case the it is active
	,	render: function ()
		{
			if (this.isActive())
			{
				this._render();
			}
			else
			{
				this.$el.empty();
			}
			
			return this.trigger('ready', true);
			
		}

	,	initialize: function (options)
		{
			this.wizard = options.wizard;
			this.title = options.title;
			this.refreshOn = options.refreshOn;
			this.tag = options.tag;
			this.details = options.details;
			this.attributes = options.attributes;

			this.refresh();
		}
	,	refresh: function ()
		{
			if (this.refreshOn)
			{
				if (_(this.refreshOn).isFunction())
				{
					this.refreshOn();
				}
				else
				{
					var self = this;
					this.wizard.model.on(this.refreshOn, function()
					{
						self.render();
					});
				}
			}
		}

	,	getStringifyAttributes: function (obj, prefix)
		{
			var self = this
			,	prefixKey;

			return _.reduce(obj, function (memo, value, key)
			{
				prefixKey = prefix + key;

				if ( _.isObject(value))
				{
					return memo + self.getStringifyAttributes(obj[key], key + '-');
				}
				else if ( _.isArray(value) === true)
				{
					return memo + ' ' + _.escape(prefixKey) + '="' + _.escape(value.join(' ')) + '"';
				}
				else
				{
					return memo + ' ' + _.escape(prefixKey) + '="' + _.escape(value) + '"';
				}

			}, '');
		}

	,	getTag: function ()
		{
			return _(this.tag).isFunction() ? this.tag() : (this.tag || 'h2');
		}

	,	getDetails: function ()
		{
			return _(this.details).isFunction() ? this.details() : (this.details || '');
		}

	,	getTitle: function ()
		{
			return _(this.title).isFunction() ? this.title() : (this.title || '');
		}

		//@method getContext @return {OrderWizard.Module.Title.Context}
	,	getContext: function ()
		{
			//@class OrderWizard.Module.Title.Context
			return {
				//@property {String} tag
				tag: this.getTag()
				//@property {String} attributes
			,	attributes: this.getStringifyAttributes(this.attributes || {})
				//@property {String} details
			,	details: this.getDetails()
				//@property {String} title
			,	title: this.getTitle()
				//@property {Boolean} showDetails
			,	showDetails: !!this.getDetails()
			};
		}
	});
});