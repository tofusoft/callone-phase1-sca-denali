{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<a href="/returns" class="return-authorization-detail-back">{{translate '&lt; Back to Returns'}}</a>

<article class="return-authorization-detail">
	<header>
		<h2 class="return-authorization-detail-title">
			{{{pageHeader}}}
			<span class="return-authorization-detail-header-total"> {{totalFormatted}} </span>
		</h2>
	</header>

	<div data-type="alert-placeholder"></div>

	<div class="return-authorization-detail-header-info">
		<div class="return-authorization-detail-header-row">
			<div class="return-authorization-detail-header-info-left">
				{{#if showCreatedFrom}}
				<p class="return-authorization-detail-header-info-from">
					<span class="return-authorization-detail-header-info-from-label">
						{{translate 'From:'}} 
					</span>
					
					{{#if createdFromURL}}
						<a href="{{createdFromURL}}"> {{translate '$(0) #$(1)' createdFromLabel createdFromTranId}}</a>
					{{else}}
						{{translate '$(0) #$(1)' createdFromLabel createdFromTranId}}
					{{/if}}
				</p>
				{{/if}}
				<p class="return-authorization-detail-header-info-return-date">
					{{translate 'Date of request:'}} 
					<span class="return-authorization-detail-header-info-return-date-value">{{date}}</span>
				</p>
				<p class="return-authorization-detail-header-info-amount">
					{{translate 'Amount: <span class="return-authorization-detail-header-info-amount-value">$(0)</span>' totalFormatted}}
				</p>
			</div>
			<div class="return-authorization-detail-header-info-right">
				<p class="return-authorization-detail-status">
					{{translate '<strong>Status: </strong> <span class="return-authorization-detail-header-info-status-value">$(0)</span>' status}}
				</p>
			</div>
		</div>
	</div>

	<div class="return-authorization-detail-row" name="return-content-layout">
		<div class="return-authorization-detail-content-col">

			<div class="return-authorization-detail-accordion-divider">
				<div class="return-authorization-detail-accordion-head">	
					<a href="#" class="return-authorization-detail-head-toggle" data-toggle="collapse" data-target="#return-products" aria-expanded="true" aria-controls="return-products">
						{{#if linesLengthGreaterThan1}}
							{{translate 'Products ($(0))' linesLength}}
						{{else}}
							{{translate 'Product'}}
						{{/if}}
						<i class="return-authorization-detail-head-toggle-icon"></i>
					</a>
				</div>
				<div class="return-authorization-detail-body collapse {{#if showOpenedAccordion}}in{{/if}}" id="return-products" role="tabpanel" data-target="#return-products">

					<table class="return-authorization-detail-products-table">
						<thead class="return-authorization-detail-headers">
					        <tr>
					          	<th class="return-authorization-detail-headers-image"></th>
								<th class="return-authorization-detail-headers-product">{{translate 'Product'}}</th>
								<th class="return-authorization-detail-headers-quantity">{{translate 'Qty'}}</th>
								<th class="return-authorization-detail-headers-reason">{{translate 'Reason'}}</th>
								<th class="return-authorization-detail-headers-amount">{{translate 'Amount'}}</th>
					        </tr>
				      	</thead>
				      	<tbody data-view="Items.Collection"></tbody>
					</table>
				</div>
			</div>

			<div class="return-authorization-detail-comments-row">
				<div class="return-authorization-detail-comments">
					<p>{{translate 'Comments:'}}</p>
					<blockquote>{{comment}}</blockquote>
				</div>
			</div>
		</div>

		<div class="return-authorization-detail-summary-col">
			<div class="return-authorization-detail-summary-container">
				<h3 class="return-authorization-detail-summary-title">
					{{translate 'SUMMARY'}}
				</h3>

				<p class="return-authorization-detail-summary-grid-float">
					<span class="return-authorization-detail-summary-amount-tax">
						{{taxTotalFormatted}}
					</span>
						{{translate 'Tax Total'}}
				</p>

				<p class="return-authorization-detail-summary-grid-float">
					<span class="return-authorization-detail-summary-amount-shipping">
						{{shippingAmountFormatted}}
					</span>
						{{translate 'Shipping & Handling'}}
				</p>
				
				<div class="return-authorization-detail-summary-total">
					<p class="return-authorization-detail-summary-grid-float">
						<span class="return-authorization-detail-summary-amount-total">
							{{totalFormatted}}
						</span>
						{{translate 'TOTAL'}}
					</p>
				</div>
			</div>
				<!-- DOWNLOAD AS PDF -->
				<div class="return-authorization-detail-summary-pdf">
					<a class="return-authorization-detail-summary-pdf-download-button" data-stdnav target="_blank" href="{{downloadPDFURL}}">
						{{translate 'Download as PDF'}}
					</a>
				</div>

				{{#if isCancelable}}
				<div class="return-authorization-detail-summary-cancel-request">
					<button class="return-authorization-detail-summary-cancel-request-button" data-action="cancel">{{translate 'Cancel Request'}}</button>
				</div>
				{{/if}}
			</div>
	</div>
</div>
