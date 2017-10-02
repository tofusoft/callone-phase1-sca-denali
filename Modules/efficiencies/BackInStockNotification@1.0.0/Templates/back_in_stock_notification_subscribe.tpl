<button class="back-in-stock-notification-show-form-button" data-action="show-bis-control">
    {{translate 'Email me when item is back in stock'}}
</button>
<div class="dropdown-menu back-in-stock-notification-form-wrapper" data-type="bis-control" {{{isVisible}}}>
    <form novalidate>
        <fieldset>
            <div class="back-in-stock-notification-message back-in-stock-notification-message-success" data-confirm-bin-message=""></div>
            <div class="back-in-stock-notification-message">{{translate 'To be notified when this item is back in stock, please enter your name and email address'}}</div>
            <div class="back-in-stock-notification-control-wrapper" data-validation="control-group">
                <label for="firstname" class="back-in-stock-notification-label">
                    {{translate 'Name'}} <small> {{translate '(required)'}}</small>
                </label>
                <input type="text" name="firstname" id="firstname" class="back-in-stock-notification-input" placeholder="{{translate 'First Name'}}" data-validation="control">
                <input type="text" name="lastname" id="lastname" class="back-in-stock-notification-input" placeholder="{{translate 'Last Name'}}" data-validation="control">
            </div>
            <div class="back-in-stock-notification-control-wrapper" data-validation="control-group">
                <label for="bis-email" class="back-in-stock-notification-label">
                    {{translate 'Email'}} <small>{{translate '(required)'}}</small>
                </label>
                <input type="email" name="email" id="bis-email" class="back-in-stock-notification-input" placeholder="{{translate 'your@email.com'}}" data-validation="control">
            </div>
            <input type="hidden" name="item" id="item" value="{{selectedProduct}}">
            <button type="submit" class="back-in-stock-notification-submit-button">{{translate 'Notify Me!'}}</button>
        </fieldset>
    </form>
</div>
