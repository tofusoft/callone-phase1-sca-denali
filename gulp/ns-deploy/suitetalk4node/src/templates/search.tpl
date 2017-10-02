<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope {{> _namespaces}}>
	<SOAP-ENV:Header>
		{{> _passport }}
		{{> _searchPreferences}}
	</SOAP-ENV:Header>
	<SOAP-ENV:Body>
		<nsmessages:search>
			<nsmessages:searchRecord xsi:type="nstx:{{RecordType}}Search" xmlns:nstx="urn:sales_2015_1.transactions.webservices.netsuite.com">

				<basic xsi:type="nscommon:{{RecordType}}SearchBasic">
					{{searchBasicFilterPrint filters}}
				</basic>

				{{#each joins }}
				<{{recordType}}Join xsi:type="nscommon:{{RecordType}}SearchBasic">
					{{searchBasicFilterPrint filters}}
				</{{recordType}}Join>
				{{/each}}

			</nsmessages:searchRecord>
		</nsmessages:search>
	</SOAP-ENV:Body>
</SOAP-ENV:Envelope>