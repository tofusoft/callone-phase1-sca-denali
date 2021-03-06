{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-history-return-authorization-header">
	{{#if showLink}}
	<p class="order-history-return-authorization-id">
		{{translate 'Return authorization: <a class="order-history-return-authorization-status-id-link" href="returns/$(1)">#$(0)</a>' model.tranid model.internalid}}
	</p>
	{{/if}}
	<p class="order-history-return-authorization-status">
		{{translate 'Status:'}} <span class="order-history-return-authorization-status-value">{{model.status}}</span>
	</p>
</div>

<table class="order-history-return-authorization-table">
	<thead class="order-history-return-authorization-table-head">
		<th class="order-history-return-authorization-table-header"></th>
		<th class="order-history-return-authorization-table-header">{{translate 'Item'}}</th>
		<th class="order-history-return-authorization-table-header-quantity">{{translate 'Qty'}}</th>
		<th class="order-history-return-authorization-table-header-unit-price">{{translate 'Unit price'}}</th>
		<th class="order-history-return-authorization-table-header-amount">{{translate 'Amount'}}</th>
	</thead>
	<tbody data-view="Items.Collection"></tbody>
</table>