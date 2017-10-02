<tr>
    <td class="back-in-stock-notification-td-first">
        <div class="back-in-stock-notification-thumbnail">
            <img src="{{resizeImage item._thumbnail.url 'thumbnail'}}" alt="{{item._thumbnail.altimagetext}}">
        </div>
    </td>
    <td class="back-in-stock-notification-td-middle">
        <div class="back-in-stock-notification-name">
            <span class="back-in-stock-notification-name-viewonly">{{itemName}}</span>
        </div>
        <div class="back-in-stock-notification-price">
            <span class="back-in-stock-notification-price-lead">{{itemPrice}}</span>
        </div>
        <div class="back-in-stock-notification-data">
            <span class="back-in-stock-notification-data-label">{{translate 'Date'}}: </span>
            <span class="back-in-stock-notification-data-value">{{created}}</span>
        </div>
        <div class="back-in-stock-notification-data">
            <span class="back-in-stock-notification-data-label">{{translate 'Contact'}}: </span>
            <span class="back-in-stock-notification-data-value">{{firstName}} {{lastName}} &lt;{{email}}&gt;</span>
        </div>
    </td>
    <td class="back-in-stock-notification-td-last">
        <div class="back-in-stock-notification-button-container">
            <button class="back-in-stock-notification-delete" data-type="backinstock-delete" data-id="{{internalId}}">{{translate 'Delete'}}</button>
        </div>
    </td>
</tr>
