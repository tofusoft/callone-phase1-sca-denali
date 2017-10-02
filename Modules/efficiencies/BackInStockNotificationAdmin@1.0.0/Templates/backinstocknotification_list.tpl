<div data-confirm-message class="confirm-message"></div>
<section>
    <header class="back-in-stock-notification-list-header">
        <h2 class="back-in-stock-notification-list-title">{{pageHeader}}</h2>
        {{#if collectionLength}}
            <div data-view="ListHeader"></div>
        {{/if}}
    </header>
    {{#if collectionLength}}
        <table class="back-in-stock-notification-list-table">
            <tbody data-view="BackInStockNotification.ListDetails"></tbody>
        </table>
        {{#if showPagination}}
            <div class="back-in-stock-notification-list-paginator">
                <div data-view="GlobalViews.Pagination"></div>
                {{#if showCurrentPage}}
                    <div data-view="GlobalViews.ShowCurrentPage"></div>
                {{/if}}
            </div>
        {{/if}}
    {{else}}
        {{#unless isLoading}}
            <p class="back-in-stock-notification-list-empty">{{translate 'No back in sotck notifications were found.'}}</p>
        {{/unless}}
    {{/if}}
</section>
