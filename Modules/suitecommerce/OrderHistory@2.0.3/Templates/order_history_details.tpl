{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<a href="/ordershistory" class="order-history-details-back-btn">{{translate '&lt; Back to Order History'}}</a>
<section>
	<header>
		<h2 class="order-history-details-order-title">
			{{translate 'Order <b>#<span class="order-history-details-order-number">$(0)</span></b>' model.order_number}}
			<span class="order-history-details-total-formatted">
				{{model.summary.total_formatted}}
			</span>
		</h2>
	</header>

	<div data-type="alert-placeholder"></div>

	{{#if showReturnAuthorizations}}
		<div class="order-history-details-message-warning" data-action="go-to-returns">
			{{translate 'You have returns associated with this order. <a href="#">View Details</a>'}}
		</div>
	{{/if}}

	<!-- HEADER INFORMATION -->
	<div class="order-history-details-header-information">
		<div class="order-history-details-header-row">
			<div class="order-history-details-header-col-left">
				<p class="order-history-details-header-date-info">
					{{translate '<strong>Date: </strong> <span class="order-history-details-header-date">$(0)</span>' model.date}}
				</p>
			</div>
			<div class="order-history-details-header-col-right">
				<p class="order-history-details-header-status-info">
					{{translate '<strong>Status: </strong> <span class="order-history-details-header-status">$(0)</span>' model.status}}
				</p>
			</div>
			<div class="order-history-details-header-amount">
				<p class="order-history-details-header-amount-info">
					{{translate '<strong>Amount: </strong> <span class="order-history-details-header-amount-number">$(0)</span>' model.summary.total_formatted}}
				</p>
			</div>

		</div>
	</div>

	<div class="order-history-details-row">
		<div class="order-history-details-content-col">

			{{#if showOrderShipAddress}}
				<div class="order-history-details-shipping-information" data-id="{{model.shipaddress}}">
					<div class="order-history-details-info-card-container">
						<!-- SHIPPING INFORMATION -->
						<div class="order-history-details-info-card">
							<h5 class="order-history-details-info-card-title">
								{{translate 'Shipping Address'}}
							</h5>
							<div class="order-history-details-info-card-info-shipping">
								<div data-view="Shipping.Address.View"></div>
							</div>
						</div>
						<div class="order-history-details-info-card">
							<h5 class="order-history-details-info-card-title">
								{{translate 'Delivery Method'}}
							</h5>
							<div class="order-history-details-info-card-info">
								<div class="order-history-details-info-card-delivery-method">
									{{#if showDeliveryMethod}}
										{{deliveryMethodName}}
									{{else}}
										{{translate 'No Delivery Method Selected'}}
									{{/if}}
								</div>
							</div>
						</div>
					</div>
			{{/if}}
			<!-- FULFILLMENT UNFULLFILED -->

			{{#if showUnfulfilledItems}}
				<div class="order-history-details-accordion-divider">
					<div class="order-history-details-accordion-head">
						<a class="order-history-details-accordion-head-toggle collapsed" data-toggle="collapse" data-target="#unfulfilled-items" aria-expanded="true" aria-controls="unfulfilled-items">
						{{#if unfulfilledItemsLengthGreaterThan1}}
							{{translate 'Products pending shipment ($(0))' unfulfilledItems.length}}
						{{else}}
							{{translate 'Product pending shipment ($(0))' unfulfilledItems.length}}
						{{/if}}
						<i class="order-history-details-accordion-toggle-icon"></i>
						</a>
					</div>
					<div class="order-history-details-accordion-body collapse" id="unfulfilled-items" role="tabpanel" data-target="#unfulfilled-items">
						<div class="order-history-details-accordion-container" data-content="order-items-body">
							<table class="order-history-details-unfulfilled-items-table md2sm">
								<tbody data-view="UnfulfilledItems"></tbody>
							</table>
						</div>
					</div>
				</div>
			{{/if}}
			<!-- FULLFILLMENT UNFULLFILED ENDS -->


			<!-- SHIPPING GROUPS -->
			<div class="order-history-details-shipping-groups" data-view="ShippingGroups"></div>
			<!-- SHIPPING GROUPS ENDS -->

			{{#if showOrderShipAddress}}
				</div>
			{{/if}}
			<!-- NON-SHIPPABLE -->
			{{#if showNonShippableItems}}
			<div class="order-history-details-accordion-divider">
				<div class="order-history-details-accordion-head">
					<a class="order-history-details-accordion-head-toggle-secondary collapsed" data-toggle="collapse" data-target="#products-not-shipp" aria-expanded="true" aria-controls="products-not-shipp">{{#if nonShippableItemsLengthGreaterThan1}}
							{{translate 'Products that don\'t require shipping ($(0))' nonShippableItems.length}}
						{{else}} 
							{{translate 'Product that doesn\'t require shipping ($(0))' nonShippableItems.length}}
						{{/if}}
					<i class="order-history-details-accordion-toggle-icon-secondary"></i>
					</a>
				</div>
				<div class="order-history-details-accordion-body collapse" id="products-not-shipp" role="tabpanel" data-target="#products-not-shipp">
					<div class="order-history-details-accordion-container" data-content="order-items-body">
						<table class="order-history-details-non-shippable-table">
							<tbody data-view="NonShippableItems"></tbody>
						</table>
					</div>
				</div>
			</div>
			{{/if}}
			<!-- NON-SHIPPABLE ENDS -->

			<!-- PAYMENT INFORMATION -->
			<div class="order-history-details-accordion-divider">
				<div class="order-history-details-accordion-head">
					<a class="order-history-details-accordion-head-toggle-secondary collapsed" data-toggle="collapse" data-target="#order-payment-info" aria-expanded="true" aria-controls="order-payment-info">{{translate 'Payment Information'}}
					<i class="order-history-details-accordion-toggle-icon-secondary"></i>
					</a>
				</div>
				<div class="order-history-details-accordion-body collapse" id="order-payment-info" role="tabpanel" data-target="#order-payment-info">
						<div class="order-history-details-accordion-container" data-content="order-items-body">
							<div class="order-history-details-info-card">
								<h5 class="order-history-details-info-card-title">
									{{translate 'Payment Method'}}
								</h5>
								<div class="order-history-details-info-card-info">
									<div data-view='FormatPaymentMethod'></div>
								</div>
							</div>
							
							<div class="order-history-details-info-card">
								<h5 class="order-history-details-info-card-title">
									{{translate 'Bill to'}}
								</h5>
								<div class="order-history-details-info-card-info-billing">
									<div data-view="Billing.Address.View"></div>
								</div>
							</div>
							<div class="order-history-details-payment-transactions">
									{{#if showPaymentTransactions}}
									<table class="order-history-details-payment-transactions-table">
										<thead class="order-history-details-payment-transactions-table-header">
											<th class="order-history-details-payment-transactions-table-header-payment-transaction">
											{{translate 'Payment Transactions'}}
											</th>
											<th class="order-history-details-payment-transactions-table-header-date">
											{{translate 'Date'}}
											</th>
											<th class="order-history-details-payment-transactions-table-header-amount">
											{{translate 'Amount'}}
											</th>
										</thead>
										{{#each paymentTransactions}}
										<tr data-type="{{dataType}}" data-id="{{internalid}}">
											<td data-type='link' class="order-history-details-payment-transactions-table-body-payment-transaction">
												{{#if isInvoice}}
													{{#if showLink}}
														{{translate 'Invoice: <a href="$(1)">#$(0)</a>' order_number link}}
													{{else}}
														{{translate 'Invoice: #$(0)' order_number}}
													{{/if}}
												{{else}}
													{{translate 'Receipt: <a href="$(1)">#$(0)</a>' order_number link}}
												{{/if}}
											</td>
											<td data-type="payment-date" class="order-history-details-payment-transactions-table-body-date">
												<span class="order-history-details-payment-transactions-table-body-date-label">{{translate 'Date: '}}</span>
												<span class="order-history-details-payment-transactions-table-body-date-value">{{date}}</span>
											</td>
											<td data-type="payment-total" class="order-history-details-payment-transactions-table-body-amount">
												<span class="order-history-details-payment-transactions-table-body-amount-label">{{translate 'Amount: '}}</span>
												<span class="order-history-details-payment-transactions-table-body-amount-value">{{summary.total_formatted}}</span>
											</span>
										</tr>
										{{/each}}
									</table>
									{{/if}}
							</div>
							
						</div>

				</div>
			</div>
					

			<!-- PAYMENT INFORMATION ENDS -->

			{{#if showReturnAuthorizations}}
				<!-- RETURNS AUTHORIZATIONS -->
				<div class="order-history-details-accordion-divider">
					<div class="order-history-details-accordion-head collapsed">
						<a class="order-history-details-accordion-head-toggle-secondary" data-toggle="collapse" data-target="#returns-authorizations" aria-expanded="true" aria-controls="returns-authorizations">
						{{translate '<span>Returns ($(0))</span>' returnAuthorizations.totalLines}}
						<i class="order-history-details-accordion-toggle-icon-secondary"></i>
						</a>
					</div>
					<div class="order-history-details-accordion-body collapse" id="returns-authorizations" role="tabpanel" data-target="#returns-authorizations">
						<div class="order-history-details-accordion-container" data-content="order-items-body">
							<div data-view="ReturnAutorization"></div>
						</div>
					</div>
				</div>
				<!-- RETURNS AUTHORIZATIONS ENDS -->
			{{/if}}
		</div>

		<div class="order-history-details-summary-col">
			<div class="order-history-details-summary-container">
				<!-- SUMMARY -->
				<h3 class="order-history-details-summary-title">
					{{translate 'SUMMARY'}}
				</h3>
				<div class="order-history-details-summary-subtotal">
					<p class="order-history-details-summary-grid-float">
						<span class="order-history-details-summary-amount-subtotal">
							{{model.summary.subtotal_formatted}}
						</span>
						{{translate 'Subtotal'}}
					
					</p>
				</div>

				{{#if showSummaryDiscount}}
					<p class="order-history-details-summary-grid-float">
						<span class="order-history-details-summary-amount-discount">
							{{model.summary.discounttotal_formatted}}
						</span>
						{{translate 'Discount'}}
					</p>
				{{/if}}

				{{#if showSummaryShippingCost}}
					<p class="order-history-details-summary-grid-float">
						<span class="order-history-details-summary-amount-shipping">
							{{model.summary.shippingcost_formatted}}
						</span>
						{{translate 'Shipping Total'}}
					</p>
				{{/if}}

				{{#if showSummaryHandlingCost}}
					<p class="order-history-details-summary-grid-float">
						<span class="order-history-details-summary-amount-handling">
							{{model.summary.handlingcost_formatted}}
						</span>
						{{translate 'Handling Total'}}
					</p>
				{{/if}}

				{{#if showSummaryGiftCertificateTotal}}
					<p class="order-history-details-summary-grid-float">
						<span class="order-history-details-summary-amount-certificate">
							{{model.summary.giftcertapplied_formatted}}
						</span>
						{{translate 'Gift Cert Total'}}
					</p>
				{{/if}}

				{{#if showSummaryPromocode}}
					<p class="order-history-details-summary-grid-float">
						<span class="order-history-details-summary-amount-promocode">
							{{model.promocode.code}}
						</span>
						{{translate 'Promo Code'}}
					</p>
				{{/if}}

				<p class="order-history-details-summary-grid-float">
					<span class="order-history-details-summary-amount-tax">
						{{model.summary.taxtotal_formatted}}
					</span>
					{{translate 'Tax Total'}}
				</p>
				<div class="order-history-details-summary-total">
					<p class="order-history-details-summary-grid-float">
						<span class="order-history-details-summary-amount-total">
							{{model.summary.total_formatted}}
						</span>
						{{translate 'Total'}}
					</p>
				</div>
			</div>

			<div class="order-history-details-row-fluid">
				{{#if showReorderAllItemsButton}}
					<!-- REORDER ALL ITEMS -->
					<a href="/reorderItems?order_id={{model.internalid}}&order_number={{model.order_number}}" class="order-history-details-button-reorder">
						{{translate 'Reorder All Items'}}
					</a>
				{{/if}}

				<!-- DOWNLOAD AS PDF -->
				<a href="{{pdfUrl}}" target="_blank" class="order-history-details-button-download-pdf">
					{{translate 'Download PDF'}}
				</a>

				{{#if showRequestReturnButton}}
				<!-- REQUEST RETURN -->
					<a data-permissions="transactions.tranRtnAuth.2" href="/returns/new/order/{{model.internalid}}" class="order-history-details-button-request-return">
						{{translate 'Request a Return'}}
					</a>
				{{/if}}
			</div>
		</div>
	</div>
</section>
