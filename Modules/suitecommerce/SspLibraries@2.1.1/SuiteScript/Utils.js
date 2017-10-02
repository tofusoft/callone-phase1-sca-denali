/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ssp.libraries
define('Utils'
,	[	'Application'
	,	'underscore'
	]
,	function (
		Application
	,	_
	)
{
	'use strict';

	// @class Utils contain global utility methods from high level API for searching records, format currencies, record type meta information, etc
	var Utils = {

		// @method mapSearchResult  
		// @param {Array<nlobjSearchColumn>} 
		// @param {nlobjSearchColumn} apiElement columns 
		// @returns {Object}
		mapSearchResult: function mapSearchResult (columns, apiElement)
		{
			var element = {};
			columns.forEach(function (column)
			{
				var col = column.searchColumn;
				var name = col.getName();
				var value = apiElement.getValue(name, col.getJoin(), col.getSummary());
				if (name === 'image' && !!value)
				{
					var imageRecord = nlapiLoadFile(value);
					if(!!imageRecord)
					{
						element[column.fieldName] = imageRecord.getURL();
					} 
					else 
					{
						element[column.fieldName] = '';
					}
				} 
				else 
				{
					element[column.fieldName] = value;
					var text = apiElement.getText(name, col.getJoin(), col.getSummary());
					if (!!text)
					{
						element[column.fieldName + '_text'] = text;
					}
				}
			});
			return element;
		}


		
		// @method mapSearchResults Extracts search results to a JSON-friendly format.
		// @param {Array<nlobjSearchColumn>} searchColumns
		// @param {Array<nlobjSearchResult>} searchResults
		// @return {Array<nlobjSearchResult>} mapped results
		// @private		
	,	mapSearchResults: function mapSearchResults (searchColumns, searchResults)
		{
			if(!searchColumns || !searchResults)
			{
				return [];
			}

			var nameToCol = {}; // mapping columnName -> columns with that name
			var columns = []; // array of { searchColumn: (nlobjSearchColumn), fieldName: (name in result) }
			// detech columns with the same name
			_.each(searchColumns, function (col)
			{
				var name = col.getName();
				columns.push({
					searchColumn: col
				});
				nameToCol[name] = (nameToCol[name] || 0) + 1;
			});
			// sets fieldNames for each column
			_.each(columns, function(column){
				var searchColumn = column.searchColumn;
				var isANameClash = nameToCol[searchColumn.getName()] > 1;
				column.fieldName = searchColumn.getName();
				if (isANameClash)
				{
					column.fieldName += '_' + searchColumn.getJoin();
				}
			});

			return searchResults.map(function(apiElement)
			{
				return Utils.mapSearchResult(columns, apiElement);
			});
		}

		// @method mapLoadResult 
		// @param {Array<nlobjSearchColumn>} columns
		// @param {nlobjRecord} record
		// @return {Object} 
	,	mapLoadResult: function mapLoadResult (columns, record)
		{
			var record_info = {};
			columns.forEach( function (name)
			{
				var value = record.getFieldValue(name);
				if(name === 'image' && !!value)
				{
					var imageRecord = nlapiLoadFile(value);
					if(!!imageRecord)
					{
						record_info[name] = imageRecord.getURL();
					} else {
						record_info[name] = '';
					}
				} else {
					record_info[name] = value;
				}
			});
			return record_info;
		}

		// @method loadAndMapSearch 
		// @param {String}searchName
		// @param {Array<nlobjSearchFilter>} filters
		// @return {Array<nlobjSearchResult>} mapped results
	,	loadAndMapSearch: function loadAndMapSearch(searchName, filters)
		{
			if (!filters)
			{
				filters = [];
			}

			var savedSearch;
			try {
				savedSearch = nlapiLoadSearch(null, searchName);
			} catch(err) {
				console.log('Unable to load search ' + searchName, err);
				return [];
			}
			var	searchResults = nlapiSearchRecord(null, searchName, filters);
			return Utils.mapSearchResults(savedSearch.getColumns(), searchResults);
		}


		/**
		 * @method mapOptions @param {String} record_options
		 */
	,	mapOptions: function mapOptions (record_options)
		{
			var options_rows = record_options.split('\u0004');
			var options_items = options_rows.map(function (row)
			{
				return row.split('\u0003');
			});
			var options = {};
			options_items.forEach(function (item)
			{
				options[item[0]] = {
					name: item[0]
				,	desc: item[2]
				,	value: item[3]
				};
			});
			return options;
		}

		/**
		 * @method makeid @param {Number} maxLength
		 */
	,	makeid: function makeid(maxLength)
		{
			return Math.random().toString(36).substring(2, (maxLength + 2) || 5);
		}

		/**
		 * @method getMolecule
		 * @param {nlobjRequest} request
		 * @returns {String}
		 *		''		system
		 *		'f'		system.f
		 *		'p'		system.p
		 *		'na1.f'	system.na1.f
		 */
	,	getMolecule: function getMolecule(request)
		{
			var	regex = /https:\/\/system(.*)\.netsuite\.com/;
			var molecule = request.getURL().match(regex);
			return molecule && molecule[1] || '';
		}

		// @method formatReceiptCurrency @param {String|Number} value
	,	formatReceiptCurrency: function formatReceiptCurrency (value)
		{
			var parsedValue = parseFloat (value);
			if (parsedValue < 0)
			{
				if (value.substring)
				{
					return '($ ' + value.substring(1) + ')';
				}

				return '($ ' + value.toFixed(2).substring(1) + ')';
			}

			return '$ ' + parsedValue.toFixed(2);
		}

		// @method formatCurrency @param {String} value @param {String} symbol
	,	formatCurrency: function (value, symbol)
		{
			var value_float = parseFloat(value);

			if (isNaN(value_float))
			{
				value_float = parseFloat(0); //return value;
			}

			var negative = value_float < 0;
			value_float = Math.abs(value_float);
			value_float = parseInt((value_float + 0.005) * 100, 10) / 100;

			var value_string = value_float.toString()

			,	groupseparator = ','
			,	decimalseparator = '.'
			,	negativeprefix = '('
			,	negativesuffix = ')'
			,	settings = SC && SC.ENVIRONMENT && SC.ENVIRONMENT.siteSettings ? SC.ENVIRONMENT.siteSettings : {};

			if (window.hasOwnProperty('groupseparator'))
			{
				groupseparator = window.groupseparator;
			}
			else if (settings.hasOwnProperty('groupseparator'))
			{
				groupseparator = settings.groupseparator;
			}

			if (window.hasOwnProperty('decimalseparator'))
			{
				decimalseparator = window.decimalseparator;
			}
			else if (settings.hasOwnProperty('decimalseparator'))
			{
				decimalseparator = settings.decimalseparator;
			}

			if (window.hasOwnProperty('negativeprefix'))
			{
				negativeprefix = window.negativeprefix;
			}
			else if (settings.hasOwnProperty('negativeprefix'))
			{
				negativeprefix = settings.negativeprefix;
			}

			if (window.hasOwnProperty('negativesuffix'))
			{
				negativesuffix = window.negativesuffix;
			}
			else if (settings.hasOwnProperty('negativesuffix'))
			{
				negativesuffix = settings.negativesuffix;
			}

			value_string = value_string.replace('.',decimalseparator);
			var decimal_position = value_string.indexOf(decimalseparator);

			// if the string doesn't contains a .
			if (!~decimal_position)
			{
				value_string += decimalseparator + '00';
				decimal_position = value_string.indexOf(decimalseparator);
			}
			// if it only contains one number after the .
			else if (value_string.indexOf(decimalseparator) === (value_string.length - 2))
			{
				value_string += '0';
			}

			var thousand_string = '';
			for (var i = value_string.length - 1; i >= 0; i--)
			{
				//If the distance to the left of the decimal separator is a multiple of 3 you need to add the group separator
				thousand_string = (i > 0 && i < decimal_position && (((decimal_position-i) % 3) === 0) ? groupseparator : '') + value_string[i] + thousand_string;
			}

			if (!symbol)
			{
				if (typeof session !== 'undefined' && session.getShopperCurrency)
				{
					symbol = session.getShopperCurrency().symbol;
				}
				else if (settings.shopperCurrency)
				{
					symbol = settings.shopperCurrency.symbol;
				}
				else if (SC && SC.ENVIRONMENT && SC.ENVIRONMENT.currentCurrency)
				{
					symbol = SC.ENVIRONMENT.currentCurrency.symbol;
				}

				if(!symbol)
				{
					symbol = '$';
				}
			}

			value_string  = symbol + thousand_string;

			return negative ? (negativeprefix + value_string + negativesuffix) : value_string;
		}

		// @method isLoggedIn @returns{Boolean} true i current user is logged in. This is a workaround to buggy WP session.isLoggedIn
	,	isLoggedIn: function ()
		{
			// MyAccount (We need to make the following difference because isLoggedIn is always false in Shopping)
			if (request.getURL().indexOf('https') === 0)
			{
				return session.isLoggedIn();
			}
			else // Shopping
			{
				return parseInt(nlapiGetUser() + '', 10) > 0 && !session.getCustomer().isGuest();
			}
		}

		// @method toCurrency @param {String} amount @return {Number}
	,	toCurrency: function (amount)
		{
			var r = parseFloat(amount);

			return isNaN(r) ? 0 : r;
		}

		// @method recordTypeExists returns true if and only if the given record type name is present in the current account - useful for checking if a bundle is installed or not in this account. 
		// @param {String} record_type_name @return{Boolean}
	,	recordTypeExists: function (record_type_name)
		{
			try
			{
				nlapiCreateRecord(record_type_name);
			}
			catch (error)
			{
				return false;
			}
			return true;
		}

		// @method recordTypeHasField returns true if and only if the given field_name exists on the given record_type_name.
		// @param {String} record_type_name @param {String} field_name @return {Boolean} 
	,	recordTypeHasField: function (record_type_name, field_name)
		{
			try
			{
				var record = nlapiCreateRecord(record_type_name);
				return _.contains(record.getAllFields(), field_name);
			}
			catch (error)
			{
				return false;
			}
		}





		//@method getItemOptionsObject Parse an item string options into an object
		//@param {String} options_string String containg all item options
		//@return {Utils.ItemOptionsObject} Returns an object with the properties: id, name, value, displayvalue and mandatory
	,	getItemOptionsObject: function (options_string)
		{
			var options_object = [];

			if (options_string && options_string !== '- None -')
			{
				var split_char_3 = String.fromCharCode(3)
				,	split_char_4 = String.fromCharCode(4);

				_.each(options_string.split(split_char_4), function (option_line)
				{
					option_line = option_line.split(split_char_3);
					//@class Utils.ItemOptionsObject
					options_object.push({
						//@property {String} id
						id: option_line[0]
						//@property {String} name
					,	name: option_line[2]
						//@property {String} value
					,	value: option_line[3]
						//@property {String} displayValue
					,	displayvalue: option_line[4]
						//@property {String} mandatory
					,	mandatory: option_line[1]
					});
					//@class Utils
				});
			}

			return options_object;
		}

		// @method setPaymentMethodToResult @param {nlobjRecord} record @param {Object} result
	,	setPaymentMethodToResult: function (record, result)
		{
			var paymentmethod = {
				type: record.getFieldValue('paymethtype')
			,	primary: true
			};

			if (paymentmethod.type === 'creditcard')
			{
				paymentmethod.creditcard = {
					ccnumber: record.getFieldValue('ccnumber')
				,	ccexpiredate: record.getFieldValue('ccexpiredate')
				,	ccname: record.getFieldValue('ccname')
				,	internalid: record.getFieldValue('creditcard')
				,	paymentmethod: {
						ispaypal: 'F'
					,	name: record.getFieldText('paymentmethod')
					,	creditcard: 'T'
					,	internalid: record.getFieldValue('paymentmethod')
					}
				};
			}

			if (record.getFieldValue('ccstreet'))
			{
				paymentmethod.ccstreet = record.getFieldValue('ccstreet');
			}

			if (record.getFieldValue('cczipcode'))
			{
				paymentmethod.cczipcode = record.getFieldValue('cczipcode');
			}

			if (record.getFieldValue('terms'))
			{
				paymentmethod.type = 'invoice';

				paymentmethod.purchasenumber = record.getFieldValue('otherrefnum');

				paymentmethod.paymentterms = {
						internalid: record.getFieldValue('terms')
					,	name: record.getFieldText('terms')
				};
			}

			if (paymentmethod.type === 'creditcard' && !paymentmethod.creditcard.internalid)
			{
				paymentmethod.type = null;
				delete paymentmethod.creditcard;
			}

			result.paymentmethods = [paymentmethod];
		}
	};

	// @class Application @property {Utils} Utils
	Application.Utils = Utils;

	return Utils;
});
