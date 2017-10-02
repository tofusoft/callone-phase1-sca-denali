/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Home
define(
	'Home.View.Title'
,	[
		'SC.Configuration'
	,	'Home.View'
	,	'Utilities.ResizeImage'

	,	'home.tpl'

	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	,	'Utils'
	]
,	function (
		Configuration
	,	HomeView
	,	resizeImage
	,	home_tpl

	,	Backbone
	,	jQuery
	,	_
	,	Utils
	)
{
	'use strict';

	//@module Home.View @extends Backbone.View
	return _.extend(HomeView.prototype,{
		title: _('CallOne:  Real People, Real Service').translate(),
		page_header: _('CallOne:  Real People, Real Service').translate()
	});



});
