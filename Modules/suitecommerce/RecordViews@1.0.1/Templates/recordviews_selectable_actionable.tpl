{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<tr class="recordviews-selectable-actionable-row {{#if isChecked}}recordviews-selectable-actionable-active{{/if}} {{#unless isActive}}disabled{{/unless}}" data-action="{{actionType}}" data-id="{{id}}">
	<td class="recordviews-selectable-actionable-td-selectable">
		<input class="recordviews-selectable-actionable-checkbox {{#if checkboxIsHidden}}hidden{{/if}}" type="checkbox" value="{{id}}" data-action="select" {{#if isChecked}}checked{{/if}} {{#unless isActive}}disabled{{/unless}}>
	</td>
	<td class="recordviews-selectable-actionable-td-title">
		{{#if isNavigable}}
			<a class="recordviews-selectable-actionable-anchor" href="{{{url}}}" data-toggle="show-in-modal">
				{{title}}
			</a>
		{{else}}
			<p class="recordviews-selectable-actionable-title">
				{{title}}
			</p>
		{{/if}}
	</td>

	{{#each columns}}
		<td class="recordviews-selectable-actionable-td recordviews-selectable-actionable-td-{{name}}" data-name="{{name}}">
			{{#if showLabel}}
				<span class="recordviews-selectable-actionable-label">{{label}}</span>
			{{/if}}
			{{#if isComposite}}
				<span data-view="{{compositeKey}}"></span>
			{{else}}
				<span class="recordviews-selectable-actionable-value">{{value}}</span>
			{{/if}}
		</td>
	{{/each}}

	<td class="recordviews-selectable-actionable-td-action" data-view="Action.View">
	</td>
</tr>
