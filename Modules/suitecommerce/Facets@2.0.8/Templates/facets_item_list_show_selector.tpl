{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<select data-type="navigator" class="facets-item-list-show-selector">
	{{#each options}}
	<option value="{{configOptionUrl}}" class="{{className}}" {{#if isSelected}} selected="" {{/if}} >{{name}}</option>
	{{/each}}
</select>
