{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div data-view="Global.BackToTop"></div>
<div class="footer-content">

	<div id="banner-footer" class="content-banner banner-footer" data-cms-area="global_banner_footer" data-cms-area-filters="global"></div>
	
	<div class="footer-content-nav">
		{{#if showFooterNavigationLinks}}
			<ul class="footer-content-nav-list">
				{{#each footerNavigationLinks}}
					<li>
						<a {{objectToAtrributes item}}>
							{{text}}
						</a>
					</li>
				{{/each}}
			</ul>
		{{/if}}
	</div>

	<div class="footer-content-copyright">
		{{translate '&copy; 2008-2015 Company Name'}}
	</div>
</div>