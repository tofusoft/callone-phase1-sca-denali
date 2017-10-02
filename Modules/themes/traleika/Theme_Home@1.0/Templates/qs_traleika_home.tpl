{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="home">
	<div class="home-slider-container">
		<div class="home-image-slider">
			<ul data-slider class="home-image-slider-list">
				{{#each carouselImages}}
					<li>
						<div class="home-slide-main-container">
							<a href="/search">
								<img src="{{resizeImage this ../imageHomeSize}}" alt="" /> 
							</a>
							<div class="home-slide-caption">
								<h2 class="home-slide-caption-title">SAMPLE HEADLINE</h2>
								<p>Example descriptive text displayed on multiple lines.</p>
								<div class="home-slide-caption-button-container">
									<a href="/search" class="home-slide-caption-button">Shop Now</a>
								</div>
							</div>
						</div>
					</li>
				{{/each}}
			</ul>
		</div>
	</div>

	<div class="home-banner-main">
		{{#each bottomBannerImages}}
      <div class="home-banner-main-cell-nth{{@index}}">
      	<div class="home-banner-main-cell-bg">
        	<img src="{{resizeImage this ../imageHomeSizeBottom}}" alt="" >
        	<div class="home-banner-main-cell-text">EXAMPLE TEXT</div>
        </div>
      </div>
    {{/each}}
	</div>

	<div class="home-merchandizing-zone">
		<div data-id="your-merchandising-zone" data-type="merchandising-zone"></div>
	</div>
	
</div>