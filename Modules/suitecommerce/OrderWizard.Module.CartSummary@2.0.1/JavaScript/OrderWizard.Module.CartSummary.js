/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderWizard.Module.CartSummary
define(
	'OrderWizard.Module.CartSummary'
,	[
		'Wizard.Module'
	,	'OrderWizard.Module.TermsAndConditions'
	,	'ErrorManagement'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'Cart.PromocodeForm.View'
	,	'GlobalViews.FormatPaymentMethod.View'
	,	'GlobalViews.Message.View'
	,	'ItemViews.Cell.Navigable.View'

	,	'order_wizard_cart_summary.tpl'
	,	'cart_summary_gift_certificate_cell.tpl'
	,	'item_views_cell_navigable.tpl'

	,	'underscore'
	,	'jQuery'
	,	'jQuery.serializeObject'
	,	'Utils'
	]
,	function (
		WizardModule
	,	TermsAndConditions
	,	ErrorManagement
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	CartPromocodeFormView
	,	GlobalViewsFormatPaymentMethodView
	,	GlobalViewsMessageView
	,	ItemViewsCellNavigableView

	,	order_wizard_cart_summary_tpl
	,	cart_summary_gift_certificate_cell_tpl
	,	item_views_cell_navigable_tpl

	,	_
	,	jQuery
	)
{
	'use strict';

	// @class OrderWizard.Module.CartSummary @extends Wizard.Module
	return WizardModule.extend({
		//@property {Function} template
		template: order_wizard_cart_summary_tpl
		//@property {String} className
	,	className: 'OrderWizard.Module.CartSummary'
		//@property {Object}
	,	attributes: {
			'id': 'order-wizard-layout'
		,	'class': 'order-wizard-layout'
		}
		//@property {Object} events
	,	events: {
			'submit form[data-action="apply-promocode"]': 'applyPromocode'
		,	'click [data-action="remove-promocode"]': 'removePromocode'
		,	'shown [data-type="promo-code-container"]' : 'onPromocodeFormShown'
		,	'click [data-toggle="show-terms-summary"]' : 'showTerms' //only for "Show terms and cond" in the Order Summary
		,	'click [data-action="change-status-multishipto-sidebar"]' : 'changeStatusMultiShipTo'
		}
		//@method initialize
	,	initialize: function (options)
		{
			var self = this;

			this.wizard = options.wizard;
			this.currentStep = options.currentStep;

			//on change model we need to refresh summary
			this.wizard.model.on('sync change:summary', function ()
			{
				if (!_.isArray(self.wizard.model.get('lines')))
				{
					self.render();
				}
			});

			BackboneCompositeView.add(this);
		}
		//@method render
	,	render: function()
		{
			if (this.state === 'present')
			{
				this._render();
				this.trigger('ready', true);
			}
		}

		// @method changeStatusMultiShipTo
	,	changeStatusMultiShipTo: function()
		{
			this.wizard.model.trigger('update-multi-ship-to-status');
		}

		// @method getContinueButtonLabel @returns {String}
	,	getContinueButtonLabel: function ()
		{
			var current_step = this.wizard.getCurrentStep();
			return current_step ?
					current_step.changedContinueButtonLabel || current_step.continueButtonLabel || _('Place Order').translate() :
					_('Place Order').translate();
		}

		// @method getHideItems @returns {Array}
	,	getHideItems: function ()
		{
			return _.isFunction(this.options.hideSummaryItems) ? this.options.hideSummaryItems() : this.options.hideSummaryItems;
		}

		// @method applyPromocode Handles the submit of the apply promo code form
	,	applyPromocode: function (e)
		{
			var self = this
			,	$target = jQuery(e.target)
			,	options = $target.serializeObject();

			e.preventDefault();

			this.$('[data-type=promocode-error-placeholder]').empty();

			// disable navigation buttons
			this.trigger('change_enable_continue', false);

			// disable inputs and buttons
			$target.find('input, button').prop('disabled', true);

			this.wizard.model.save({ promocode: { code: options.promocode } }).fail(
				function (jqXhr)
				{
					self.wizard.model.unset('promocode');
					jqXhr.preventDefault = true;
					var message = ErrorManagement.parseErrorMessage(jqXhr, self.wizard.application.getLayout().errorMessageKeys);
					var global_view_message = new GlobalViewsMessageView({
						message: message
					,	type: 'error'
					,	closable: true
					});

					self.$('[data-type=promocode-error-placeholder]').html(global_view_message.render().$el.html());
					$target.find('input[name=promocode]').val('').focus();
				}
			).always(
				function ()
				{
					// enable navigation buttons
					self.trigger('change_enable_continue', true);
					// enable inputs and buttons
					$target.find('input, button').prop('disabled', false);

					self.wizard.model.trigger('promocodeUpdated', 'applied');
				}
			);
		}

		// @method removePromocode Handles the remove promocode button
	,	removePromocode: function (e)
		{
			var self = this;

			e.preventDefault();

			// disable navigation buttons
			this.trigger('change_enable_continue', false);

			this.wizard.model.save({ promocode: null }).always(function ()
			{
				// enable navigation buttons
				self.trigger('change_enable_continue', true);

				self.wizard.model.trigger('promocodeUpdated', 'removed');
			});
		}

		// @method onPromocodeFormShown Handles the shown of promocode form
	,	onPromocodeFormShown: function(e)
		{
			jQuery(e.target).find('input[name="promocode"]').focus();
		}

		// @method showTerms only for "Show terms and conditions" in the Order Summary
	,	showTerms: TermsAndConditions.prototype.showTerms

		//@property {Object} childViews
	,	childViews: {
			'Cart.PromocodeForm': function ()
			{
				var promocode = this.wizard.model.get('promocode');
				return new CartPromocodeFormView({promocode : promocode});
			}
		,	'Items.Collection': function ()
			{
				return new BackboneCollectionView({
						collection: this.wizard.model.get('lines')
					,	childView: ItemViewsCellNavigableView
					,	cellTemplate: item_views_cell_navigable_tpl
					,	viewsPerRow: 1
					,	childViewOptions: {
							navigable: false

						,	cellClassName: 'lg2sm-first'

						,	detail1Title: _('Qty:').translate()
						,	detail1: 'quantity'

						,	detail2Title: _('Unit price').translate()
						,	detail2: 'rate_formatted'

						,	detail3Title: _('Amount:').translate()
						,	detail3: 'total_formatted'
						}
				});
			}
		,	'GiftCertificates': function ()
			{

				var	gift_certificates = this.wizard.model.get('paymentmethods').where({type: 'giftcertificate'}) || [];

				return new BackboneCollectionView({
						collection: gift_certificates
					,	cellTemplate: cart_summary_gift_certificate_cell_tpl
					,	viewsPerRow: 1
					,	childView: GlobalViewsFormatPaymentMethodView
					,	rowTemplate: null
				});
			}
		}
		//@method getContext @returns OrderWizard.Module.CartSummary.Context
	,	getContext: function ()
		{
			var	model = this.wizard.model
			,	summary = model.get('summary')
			,	promocode = model.get('promocode')
			,	item_count = _.countItems(model.get('lines'))
			,	is_promocode_valid = promocode && promocode.isvalid;

			//@class OrderWizard.Module.CartSummary.Context
			return {
					model: model
					//@property {Boolean} requireTermsAndConditions
				,	requireTermsAndConditions: this.wizard.application.getConfig('siteSettings.checkout.requiretermsandconditions') === 'T'
					//@property {Boolean} allowRemovePromocode
				,	allowRemovePromocode: !!this.options.allow_remove_promocode
					//@property {String} continueButtonLabel
				,	continueButtonLabel: this.getContinueButtonLabel() || ''
					//@property {Boolean} showContinueButton
				,	showContinueButton: !this.options.hide_continue_button
					//@property {Boolean} showCartTerms
				,	showCartTerms: !this.options.hide_cart_terms
					//@property {Boolean} isMultiShipTo
				,	isMultiShipTo: !!model.get('ismultishipto')
					//@property {Number} itemCount
				,	itemCount: item_count
					//@property {Boolean} itemCountGreaterThan1
				,	itemCountGreaterThan1: item_count > 1
					//@property {Boolean} showPromocode
				,	showPromocode: !!is_promocode_valid
					//@property {Array} giftCertificates
				,	giftCertificates: model.get('paymentmethods').where({type: 'giftcertificate'}) || []
					//@property {Boolean} showGiftCertificates
				,	showGiftCertificates: !!summary.giftcertapplied
					//@property {Boolean} showDiscount
				,	showDiscount: !!summary.discounttotal
					//@property {Boolean} showHandlingCost
				,	showHandlingCost: !!summary.handlingcost
					//@property {Boolean} showPromocodeForm
				,	showPromocodeForm: !!(!is_promocode_valid && this.options.show_promocode_form)
					//@property {Boolean} showItems
				,	showItems: !this.getHideItems()
					//@property {Boolean} showEditCartButton
				,	showEditCartButton: !!this.options.show_edit_cart
					//@property {Boolean} showRemovePromocodeButton
				,	showRemovePromocodeButton: !!this.options.allow_remove_promocode
					//@property {Boolean} showOpenedAccordion
				,	showOpenedAccordion:  _.isTabletDevice() || _.isDesktopDevice()
					//@property {Boolean} showEditCartMST
				,	showEditCartMST: this.wizard.isMultiShipTo() && !this.options.isConfirmation
			};
		}

	});
});