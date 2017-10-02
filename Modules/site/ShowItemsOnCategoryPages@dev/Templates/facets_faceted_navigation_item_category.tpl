{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}
{{#if showFacet}}
    <div class="facets-faceted-navigation-item-category-facet-group" id="{{htmlId}}" data-type="rendered-facet" data-facet-id="{{facetId}}">
        {{#if showHeading}}
            {{#if isUncollapsible}}
                <div class="facets-faceted-navigation-item-category-facet-group-expander">
                    <h4 class="facets-faceted-navigation-item-category-facet-group-title">
                        {{facetDisplayName}}
                    </h4>
                </div>
            {{else}}
                <a href="#" class="facets-faceted-navigation-item-category-facet-group-expander" data-toggle="collapse" data-target="#{{htmlId}} .facets-faceted-navigation-item-category-facet-group-wrapper" data-type="collapse" title="{{facetDisplayName}}">
                    <i class="facets-faceted-navigation-item-category-facet-group-expander-icon"></i>
                    <h4 class="facets-faceted-navigation-item-category-facet-group-title">{{facetDisplayName}}</h4>
                </a>
            {{/if}}
        {{/if}}

        <div class="{{#if isCollapsed}} collapse {{else}} collapse in {{/if}} facets-faceted-navigation-item-category-facet-group-wrapper">
            <div class="facets-faceted-navigation-item-category-facet-group-content">
                <ul class="facets-faceted-navigation-item-category-facet-optionlist">
                    {{#each displayValues}}
                        {{#if isBranchActive}}
                        <li>
                            <a class="facets-faceted-navigation-item-category-facet-option {{#if isActive}}option-active{{/if}}" href="{{link}}" title="{{label}}">
                                {{displayName}}
                                <!--
								{{#if isActive}}
									<i class="facets-faceted-navigation-item-category-facet-option-circle"></i>
								{{/if}}
								-->
                            </a>
                            {{#if showChildren}}
                                <div data-view="Facets.HierarchicalFacetedNavigationItem.Item" data-facet-id="hierarchical-child" data-facet-value="{{id}}"></div>
                            {{/if}}

                        </li>
                        {{/if}}
                    {{/each}}
                </ul>
            </div>
        </div>
    </div>
{{/if}}