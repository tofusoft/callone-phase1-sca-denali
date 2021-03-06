{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<tr class="recordviews-selectable-row {{#if isChecked}}recordviews-selectable-active{{/if}} {{#unless isActive}}recordviews-selectable-disabled{{/unless}}" data-action="{{actionType}}" data-id="{{id}}">
	<td class="recordviews-selectable-td-selectable">
		<input class="recordviews-selectable-checkbox" type="checkbox" value="{{id}}" data-action="select" {{#if isChecked}}checked{{/if}} {{#unless isActive}}disabled{{/unless}}>
	</td>
	<td class="recordviews-selectable-td-title">
		{{#if isNavigable}}
			<a class="recordviews-selectable-anchor" href="{{{url}}}">
				{{title}}
			</a>
		{{else}}
			<p class="recordviews-selectable-title">
				{{title}}
			</p>
		{{/if}}
	</td>

	{{#each columns}}
		<td class="recordviews-selectable-td recordviews-selectable-td-{{name}} {{#if @last}}recordviews-selectable-td-last{{/if}}" data-name="{{name}}">
			{{#if showLabel}}
				<span class="recordviews-selectable-label">{{label}}</span>
			{{/if}}
			{{#if isComposite}}
				<span data-view="{{compositeKey}}"></span>
			{{else}}
				<span class="recordviews-selectable-value">{{value}}</span>
			{{/if}}
		</td>
	{{/each}}
</tr>