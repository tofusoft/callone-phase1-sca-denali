{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<a href="/invoices" class="invoice-details-back-btn">{{translate '&lt; Back to Invoices'}}</a>
<section class="invoice-details">
	<div class="content invoice-details-view">
		{{#unless showInModal}}
			<header>
				<h2 class="invoice-details-invoice-title">
				 	{{translate 'Invoice <span class="invoice-details-invoice-number">#$(0)</span>' model.order_number}}
					<span class="invoice-details-invoice-amount">
						{{#if isOpen}}
							<span class="invoice-details-amount">{{model.amountDue_formatted}}</span>
						{{else}}
							<span class="invoice-details-amount">{{model.summary.total_formatted}}</span>
						{{/if}}
					</span>
				</h2>
			</header>
		{{/unless}}

		<div class="invoice-details-header-information">
			<div class="invoice-details-header-row">
				<div class="invoice-details-header-col-left">
					<p class="invoice-details-header-date-info">
						<span class="invoice-details-header-date-label">{{translate 'Invoice Date: '}}</span>
						<span class="invoice-details-header-date-value">{{model.date}}</span>
					</p>
					{{#if showCreatedFrom}}
						<p class="invoice-details-header-created-from">
							<span class="invoice-details-header-created-from-label">{{translate 'Created from: '}}</span>
							 <a href="/ordershistory/view/{{model.createdfrom.id}}" class="invoice-details-header-created-from-value"> 
							 	{{model.createdfrom.name}}
							 </a>
						</p>
					{{/if}}
					<p class="invoice-details-header-due-date-info">
						{{#if showDueDate}}
							<span class="invoice-details-header-due-date-label">{{translate 'Due Date: '}}</span>
							<span class="invoice-details-header-due-date-value">{{ model.dueDate}}</span>
						{{else}}
							<span class="invoice-details-header-due-date-label">{{translate 'Due Date: '}}</span>
							<span class="invoice-details-header-due-date-value">{{translate ' N/A'}}</span>
						{{/if}}
						
					</p>
				</div>
				<div class="invoice-details-header-col-right">
					<p class="invoice-details-header-status-info">
						<span class="invoice-details-header-status-label">{{translate 'Status: '}}</span>
						<span class="invoice-details-header-status-value">{{ model.status}}</span>
					</p>
				</div>
				<div class="invoice-details-header-amount">
					<p class="invoice-details-header-amount-info">
						{{#if isOpen}}
						<span class="invoice-details-header-amount-label">{{translate 'Amount:'}}</span>
							{{ model.amountDue_formatted}}
						{{else}}
						<span class="invoice-details-header-amount-label">{{translate 'Amount:'}}</span>
							{{ model.summary.total_formatted}}
						{{/if}}
					</p>
				</div>
			</div>
		</div>

		<div class="invoice-details-row" name="invoice-content-layout">
			{{#unless showInModal}}
				<div class="invoice-details-content-col">
					<div class="invoice-details-accordion-divider">
						<div class="invoice-details-accordion-head">
							<a class="invoice-details-accordion-head-toggle" data-toggle="collapse" data-target="#invoice-details-products" aria-expanded="true" aria-controls="invoice-details-products">{{#if linesLengthGreaterThan1}}
									{{translate 'Products ($(0))' lines.length}}
							{{else}}
								{{translate 'Product ($(0))' lines.length}}
							{{/if}}
							<i class="invoice-details-accordion-toggle-icon"></i>
							</a>
						</div>
						<div class="invoice-details-accordion-body collapse in" id="invoice-details-products" role="tabpanel" data-target="#invoice-details-products">
							<div data-content="items-body">
									<table class="invoice-details-products-table">
										<thead class="invoice-details-table-products-header">
											<th class="invoice-details-table-products-header-image"></th>
											<th class="invoice-details-table-products-header-product">{{translate 'Product'}}</th>
											<th class="invoice-details-table-products-header-qty">{{translate 'Qty'}}</th>
											<th class="invoice-details-table-products-header-unit-price">{{translate 'Unit price'}}</th>
											<th class="invoice-details-table-products-header-amount">{{translate 'Amount'}}</th>
										</thead>
										<tbody data-view="Items.Collection"></tbody>
									</table>	
							</div>
						</div>
					</div>
				
					
					<!-- SALES REP -->
					{{#if showSaleRep}}
					<div class="invoice-details-accordion-divider">
						<div class="invoice-details-accordion-head">
							<a class="invoice-details-accordion-head-toggle-secondary collapsed" data-toggle="collapse" data-target="#invoice-salesrep" aria-expanded="true" aria-controls="invoice-salesrep">
								{{translate 'Sales Rep'}}
								<i class="invoice-details-accordion-toggle-icon-secondary"></i>
							</a>
						</div>
						<div class="invoice-details-accordion-body collapse" id="invoice-salesrep" role="tabpanel" data-target="#invoice-salesrep">
							<div class="invoice-details-accordion-container">
								<div class="invoice-details-row">
									<div class="invoice-details-info-card-grid">
										<div class="invoice-details-info-card">
											<p class="invoice-details-info-card-name-title">{{model.salesrep.name}}</p>
											<p>{{siteName}}</p>
										</div>
									</div>
									<div class="invoice-details-info-card-grid">
										<div class="invoice-details-info-card">
										{{#if showSaleRepPhone}}
										<p class="invoice-details-info-card-tel-title">{{translate 'Tel:'}}</p>
										<p>{{model.salesrep.phone}}</p>
										{{/if}}

										{{#if showSaleRepEmail}}
											<p class="invoice-details-info-card-email-title">{{translate 'Email:'}}</p>
											<p>{{model.salesrep.email}}</p>
										{{/if}}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{{/if}}

					<!-- BILLING -->
					<div class="invoice-details-accordion-divider">
						<div class="invoice-details-accordion-head">
							<a class="invoice-details-accordion-head-toggle-secondary collapsed" data-toggle="collapse" data-target="#invoice-billing" aria-expanded="true" aria-controls="invoice-billing">
								{{translate 'Billing'}}
								<i class="invoice-details-accordion-toggle-icon-secondary"></i>
							</a>
						</div>
						<div class="invoice-details-accordion-body collapse" id="invoice-billing" role="tabpanel" data-target="#invoice-billing">
							<div class="invoice-details-accordion-container">
								<div class="invoice-details-row">
									<div class="invoice-details-info-card-grid">
										{{#if showBillingAddress}}
											<div data-view="Billing.Address"></div>
										{{/if}}
									</div>
									<div class="invoice-details-info-card-grid">
										<div class="invoice-details-info-card">
											<div class="invoice-details-info-card-terms-container">
												<p class="invoice-details-info-card-terms-title">{{translate 'Terms:'}}</p>
												{{#if showTerms}}
													<span> {{termsName}}</span>
													{{else}}
													<span>{{translate 'N/A'}}</span>
												{{/if}}
											</div>
													
											{{#if showMemo}}
												<div class="invoice-details-info-card-memo-container">
													<p class="invoice-details-info-card-memo-title">{{translate 'Memo:'}}</p>
													<span>{{model.memo}}</span>
												</div>
											{{/if}}
										</div>
									</div>
								</div>
							</div>
						</div> 
					</div> 
				</div>
			{{/unless}}


			<div class="{{#if showInModal}}invoice-details-summary-col-modal{{else}}invoice-details-summary-col{{/if}}" name="summary-container">
				<div class="invoice-details-row-fluid">
					<div class="invoice-details-summary-container">
						<h3 class="invoice-details-summary-title">
							{{translate 'SUMMARY'}}
						</h3>
						<p class="invoice-details-summary-grid-float">
							<span class="invoice-details-summary-items-number">
								{{model.summary.subtotal_formatted}}
							</span>
								{{translate 'Items ($(0))' model.lines.length}}
						</p>

						<p class="invoice-details-summary-grid-float">
							<span class="invoice-details-summary-tax-total">
								{{model.summary.taxtotal_formatted}}
							</span>
								{{translate 'Tax Total'}}
						</p>

						<p class="invoice-details-summary-grid-float">
							<span class="invoice-details-summary-shipping-cost">
								{{model.summary.shippingcost_formatted}}
							</span>
								{{translate 'Shipping'}}
						</p>
						<p class="invoice-details-summary-grid-float">
							<span class="invoice-details-summary-handling-value">
								{{model.summary.handlingcost_formatted}}
							</span>
							{{translate 'Handling'}}
						</p>

						{{#if showGiftcerticate}}
							<p class="invoice-details-summary-grid-float">
								<span class="invoice-details-summary-gift-certificate">
									{{model.summary.giftcertapplied_formatted}}
								</span>
									{{translate 'Gift Certificate'}}
							</p>
						{{/if}}

						{{#if showAdjustments}}
							<p class="invoice-details-summary-grid-float">
								<span class="invoice-details-summary-subtotal">
									{{model.summary.total_formatted}}
								</span>
									{{translate 'Subtotal'}}
							</p>

							<div class="invoice-details-adjustments-title">
								<h5>
									{{translate 'ADJUSTMENTS'}}
								</h5>
							</div>
							{{#if showPayments}}
								<!-- PAYMENTS -->
								{{#each payments}}
									<p class="invoice-details-summary-grid-float">
										<span class="invoice-details-summary-payment">
											({{appliedtoforeignamount_formatted}})
										</span>
										<a href="/transactionhistory/customerpayment/{{internalid}}" data-action="update-layout">
											{{translate 'Payment #$(0)' tranid}}
										</a>
									</p>
								{{/each}}
							{{/if}}

							{{#if showCreditMemos}}
								<!-- CREDIT MEMOS -->
								{{#each creditMemos}}
									<p class="invoice-details-summary-grid-float">
										<span class="invoice-details-summary-credit-memo">
											({{appliedtoforeignamount_formatted}})
										</span>
										<a href="/transactionhistory/creditmemo/{{internalid}}" data-action="update-layout">
											{{translate 'Credit Memo #$(0)' tranid}}
										</a>
									</p>
								{{/each}}
							{{/if}}

							<!-- DEPOSIT APPLICATIONS -->
							{{#if showDepositApplications}}
								{{#each depositApplications}}
									<p class="invoice-details-summary-grid-float">
										<span class="invoice-details-summary-deposit">
											({{appliedtoforeignamount_formatted}})
										</span>
										<a href="/transactionhistory/depositapplication/{{internalid}}" data-action="update-layout">
											{{translate 'Deposit Applications #$(0)' tranid}}
										</a>
									</p>
								{{/each}}
							{{/if}}
							
						{{/if}}

						<p class="invoice-details-summary-grid-float">
							<span class="invoice-details-summary-amount-due">
								{{model.amountDue_formatted}}
							</span>
								{{translate 'Amount Due'}}
						</p>
					</div>
				</div>

				<div class="invoice-details-buttons-container">
					{{#if showMakeAPaymentButton}}
						<div class="invoice-details-button-make-a-payment-container">
							<a data-permissions="{{makeAPaymentPermissions}}" href="/make-a-payment" data-type="make-a-payment" class="invoice-details-button-make-a-payment">
								{{translate 'Make a Payment'}}
							</a>
						</div>
					{{/if}}

					{{#if showInModal}}
					<a href="invoices/{{model.internalid}}" class="invoice-details-link-goto" data-action="update-layout">{{translate 'Go to detailed page'}}</a>						
						<a href="#" class="invoice-details-button-close" data-dismiss="modal">{{translate 'Close'}}</a>
					{{else}}
							<a target="_blank" class="invoice-details-button-download-as-pdf" href="{{donwloadPdfUrl}}">
								{{translate 'Download as PDF'}}
							</a>
						{{#if showRequestReturnButton}}
							<a href="/returns/new/invoice/{{model.internalid}}" class="invoice-details-button-request" data-permissions="transactions.tranRtnAuth.2">
								{{translate 'Request Return'}}
							</a>
						{{/if}}
					{{/if}}

				</div>
			</div>
		</div>
	</div>
</section>
