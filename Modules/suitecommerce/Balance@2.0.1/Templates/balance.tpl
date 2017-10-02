{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showBackToAccount}}
	<a href="/" class="balance-button-back">
		<i class="balance-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="balance">
	<div class="balance-content">
		<h2 class="balance-billing-header">
			{{translate 'Account Balance'}}
		</h2>

		<div class="balance-billing-account-balance">
			

			<div class="balance-indicator">

				<div class="balance-indicator-body">
					
					<div class="balance-indicator-title">
						{{#if showCompany}}
							<span class="balance-indicator-title-value">{{company}}</span>
						{{/if}}
					</div>

					<div class="balance-indicator-bar">
						<div class="balance-indicator-bar-progress" style="width: {{percentage}}%;"></div>
					</div>
					
					<div class="balance-indicator-details">
						<div class="balance-indicator-details-outstanding-balance">
							<span class="balance-indicator-details-outstanding-reference"></span>
							<span class="balance-indicator-details-outstanding-label">
								{{translate 'Outstanding Balance'}}
							</span>
							<span class="balance-indicator-details-outstanding-value">{{balanceFormatted}}</span>
						</div>
						<div class="balance-indicator-details-available-credit">
							<span class="balance-indicator-details-available-credit-reference"></span>
							<span class="balance-indicator-details-available-credit-label">
								{{translate 'Available'}}
							</span>
							<span class="balance-indicator-details-available-credit-value">
								{{balanceAvailableFormatted}}
							</span>
						</div>
					</div>
				</div>

				<div class="balance-indicator-summary">
					<p class="balance-indicator-summary-credit-limit">
						{{translate 'Credit Limit: <span class="balance-indicator-summary-credit-limit-value">$(0)</span>' creditLimitFormatted}}
					</p>
				</div>
			</div>

			<div class="balance-credit-and-account">
				<div class="balance-summary-credits">
					<div class="balance-summary-credits-card">
						<div class="balance-summary-credits-body">
							<p class="balance-summary-credits-title">
								{{ translate 'Credits'}}
							</p>
							<div class="balance-summary-credits-deposits">
								 
								<span class="balance-summary-credits-deposits-label">{{translate 'Deposits: '}}</span>
								<span class="balance-summary-credits-deposits-value">{{depositsRemainingFormatted}}</span>
							</div>
							<div class="balance-summary-credits-credit-memos">
								<span class="balance-summary-credits-credit-memos-label">{{translate 'Other Credits: ' }}</span>
								<span class="balance-summary-credits-credit-memos-value">{{creditMemosRemainingFormatted}}</span>
							</div>
						</div>
					</div>
				</div>

				<div class="balance-summary-account-details">
					<div class="balance-summary-account-details-card">
						<div class="balance-summary-account-details-body">
							<p class="balance-summary-account-details-title">
								{{ translate 'Account Details'}}
							</p>
							<div class="balance-summary-account-terms">
								<span class="balance-summary-account-terms-label">{{translate 'Term: '}}</span>
								<span class="balance-summary-account-terms-value">{{paymentTermsName}}</span>
							</div>
							<div class="balance-summary-account-currency">
								<span class="balance-summary-account-currency-label">{{translate 'Currency: '}}</span>
								<span class="balance-summary-account-currency-value">{{shopperCurrencyCode}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
	<div class="balance-actions">
		<div class="balance-actions-proceed">
			{{#if livePaymentHaveInvoices}}
				<a data-permissions="transactions.tranCustPymt.2, transactions.tranCustInvc.1" href="/make-a-payment" class="balance-continue-button">
					{{translate 'Continue to Payment'}}
				</a>
			{{else}}
				<button data-permissions="transactions.tranCustPymt.2, transactions.tranCustInvc.1" class="balance-continue-button" disabled>
					{{translate 'No Payment Due'}}
				</button>
			{{/if}}
		</div>
		<div class="balance-actions-print">
			<a href="/printstatement" data-permissions="transactions.tranStatement.2" class="balance-print-button">
				{{translate 'Print a Statement'}}
			</a>
		</div>
	</div>
</section>
