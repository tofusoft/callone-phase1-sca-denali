{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showBackToAccount}}
	<a href="/" class="receipt-list-button-back">
		<i class="receipt-list-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="receipt-list">
	<header class="receipt-list-header">
		<h2>{{pageHeader}}</h2>
	</header>
	<div data-view="List.Header"></div>
	<div class="receipt-list-records-container">
		{{#if areItemsToShow}}

			<table class="receipt-list-receipts-list-table">
				<thead class="receipt-list-content-table">
					<tr class="receipt-list-content-table-header-row">
						<th class="receipt-list-content-table-header-row-title">
							<span>{{translate 'Receipt No.'}}</span>
						</th>
						<th class="receipt-list-content-table-header-row-date">
							<span>{{translate 'Date'}}</span>
						</th>
						<th class="receipt-list-content-table-header-row-currency">
							<span>{{translate 'Amount'}}</span>
						</th>
						<th class="receipt-list-content-table-header-row-status">
							<span>{{translate 'Status'}}</span>
						</th>
					</tr>
				</thead>
				<tbody data-view="Receipt.List.Item"></tbody>
			</table>
			
		{{else}}
			{{#if isLoading}}
				<p class="receipt-list-empty">{{translate 'Loading'}}</p>
			{{else}}
				<p class="receipt-list-empty">{{translate 'No receipts were found'}}</p>
			{{/if}}
		{{/if}}
	</div>

</section>
