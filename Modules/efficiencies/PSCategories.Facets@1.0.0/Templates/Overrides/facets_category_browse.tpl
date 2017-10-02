{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}
<section class="facets-facet-browse">
<div class="facets-category-browse-content">
	<nav class="facets-category-browse-facets">
		<div class="category-navigation" class="facets-category-browse-navigation">
			<div class="facets-category-browse-header">
				<div id="banner-left-top" class="facets-category-browse-banner-left-top"></div>
			</div>
			<div class="facets-category-browse-facets-list-wrapper">
				<div data-view="Facets.FacetedNavigation.Item.Category" data-facet-id="category"></div>
				<div id="banner-left-bottom" class="facets-category-browse-banner-left-bottom"></div>
			</div>
		</div>
	</nav>
	<div class="facets-category-browse-results">
		<header class="facets-facet-browse-header">
		    <section class="category-list-header">
		    	<div class="category-main-description">
						<h1 class="facets-category-browse-title">{{translate categoryItemId}}</h1>
		    			<h3>{{description}}</h3>
		    	</div>
			</section>
		</header>
		<section class="category-list-container" class="facets-category-browse-body">
			<div id="banner-section-top" class="facets-category-browse-banner-top"></div>
			<div data-view="Facets.CategoryCellList"></div>
			<div id="banner-section-bottom" class="facets-category-browse-banner-bottom"></div>
		</section>
	</div>
</div>
</section>