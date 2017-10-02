{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showBackToAccount}}
	<a href="/" class="reorder-items-list-button-back">
		<i class="reorder-items-list-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<div class="reorder-items-list">
	<header class="reorder-items-list-hedaer">
		<h2>{{pageHeader}}</h2>
	</header>

	<div data-view="ListHeader"></div>

	{{#if showItems}}
		 <table class="reorder-items-list-reorder-items-table md2sm">
			<tbody data-view="Reorder.Items">
			</tbody>
		</table>
	{{/if}}
	{{#if itemsNotFound}}
		<p class="reorder-items-list-empty">{{translate 'You bought no items in this time period.'}}</p>
		<p><a class="reorder-items-list-empty-button" href="#" data-touchpoint="home">{{translate 'Shop Now'}}</a></p>
	{{/if}}

	{{#if isLoading}}
		<p class="reorder-items-list-empty">{{translate 'Loading...'}}</p>
	{{/if}}

	{{#if showPagination}}
		<div class="reorder-items-list-paginator">
			<div data-view="GlobalViews.Pagination"></div>
			{{#if showCurrentPage}}
				<div data-view="GlobalViews.ShowCurrentPage"></div>
			{{/if}}
		</div>
	{{/if}}
</div>
