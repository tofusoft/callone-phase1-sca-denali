var _ = require('underscore')
,	Tool = require('./tool')
,	suitetalk = require('../../suitetalk4node/src/index')
,	Q = require('q'); 
; 

// @module suitetalk4node.uploader @class Tool 

function Tool(){}

module.exports = Tool; 

_.extend(Tool.prototype, {

	// @method getFileNamed given a folder internalid and a file name it will search for a file with exactly that name. 
	// @param targetFolderInternalId @param fileName 
	// @param doGet if tru it will first search and then get so the contents will be given
	// @return {Deferred}
	getFileNamed: function(targetFolderInternalId, fileName, doGet, isFolder)
	{
		var deferred = Q.defer()
		,	recordType = isFolder ? 'folder' : 'file'
		,	filters = {
				folder: {
					type: 'SearchMultiSelectField'
				,	operator: 'anyOf'
				,	searchValue: [{
						type: 'RecordRef'
					,	internalId: targetFolderInternalId
					}]
				}
			,	name: {
					operator: 'is'
				,	searchValue: fileName
				}
			}; 
		if (isFolder)
		{
			filters.parent = filters.folder;
			delete filters.folder;
		}
		suitetalk.searchBasic({
			recordType: recordType
		,	filters: filters
		})
		.then(function(response)
		{
			//TODO: check errors
			var records = response.searchResponse[0].searchResult[0].recordList[0].record || []; 
			if(records.length===0)
			{
				deferred.resolve(); 
			}
			else
			{
				if(!doGet)
				{					
					deferred.resolve(records[0]); 
				}
				else
				{
					suitetalk.get({
						recordType: recordType
					,	internalId: records[0].$.internalId
					}).then(function(response)
					{
						var record = response.getResponse[0].readResponse[0].record[0];
						deferred.resolve(record); 
					})
					.catch(function(error)
					{
						console.log('getFileNamedgeterror', error.stack); 
						deferred.reject(error); 
					}); 
				}
			}
		})
		.catch(function(error)
		{
			console.log('getFileNamedsearcherror', error.stack); 
			deferred.reject(error); 
		}); 

		return deferred.promise; 
	}

,	addOrUplodateFile: function(parentFolderId, fileName, fileContents, fileType)
	{
		var deferred = Q.defer(), self = this; 
		suitetalk
		.add({
			recordType: 'file'
		,	fields: [
				{name: 'name', value: fileName}
			,	{name: 'fileType', value: fileType||'_PLAINTEXT'}
			,	{name: 'content', value: new Buffer(fileContents).toString('base64')} 
			,	{name: 'folder', nstype: 'RecordRef', internalId: parentFolderId}
			]
		})
		.then(function(responseBody)
		{
			var writeResponse = responseBody.addResponse[0].writeResponse[0];

			if (writeResponse.status[0].$.isSuccess === 'false')
			{
				if(writeResponse.status[0].statusDetail[0].code[0] === 'USER_ERROR')
				{
					// error because we are trying to "A folder with the same name already exists in the selected folder."
					// so we update
					console.log('error because exists. Updating');
					deferred.resolve(self.updateFile(parentFolderId, fileName, fileContents, fileType)); 
				}
			}
			else
			{
				deferred.resolve(responseBody)
			}
		})
		//TODO: catch

		return deferred.promise; 
	}

,	updateFile: function(parentFolderId, fileName, fileContents, fileType)
	{		
		fileType = fileType || '_PLAINTEXT';
		return suitetalk.upsert({
			recordType: 'file'
		,	externalId: fileName
		,	fields: [
				{name: 'name', value: fileName}
			,	{name: 'fileType', value: fileType}
			,	{name: 'content', value: new Buffer(fileContents).toString('base64')}
			,	{name: 'folder', nstype: 'RecordRef', internalId: aFolderInternalId}
			]
		}); 
	}


	// @method mkdir will ensure the existing of a folder by returning its reference if 
	// exists or creating it otherwise @return {Deferred<RecordRef>}
,	mkdir: function (parentFolderId, folderName)
	{
		var deferred = Q.defer(); 
		suitetalk.searchBasic({
			recordType: 'folder'
		,	filters: {
				parent: {
					type: 'SearchMultiSelectField'
				,	operator: 'anyOf'
				,	searchValue: [{
						type: 'RecordRef' 
						, internalId: parentFolderId
					}]
				}
			,	name: {operator: 'is', searchValue: folderName}
			}
		})
		.then(function(response)
		{
			// TODO: check errors
			if (parseInt(response.searchResponse[0].searchResult[0].totalRecords[0]) !== 0)
			{
				deferred.resolve(response.searchResponse[0].searchResult[0].recordList[0].record[0].$)
			}
			else
			{
				suitetalk.add({
					recordType: 'folder'
				,	fields: [
						{name: 'name', value: folderName}
					,	{name:'parent', nstype: 'RecordRef', type: 'folder', internalId: parentFolderId}
					]
				}).then(function(response)
				{
					//TODO: check errors
					deferred.resolve(response.addResponse[0].writeResponse[0].baseRef[0].$);
				}).catch(function(err)
				{
					deferred.reject(err)
				})
			}
		})
		.catch(function(error)
		{
			console.log('mkdirERROR', error, error.stack); 
		}); 
		return deferred.promise;
	}
}); 
