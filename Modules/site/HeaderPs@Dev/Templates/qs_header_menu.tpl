{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<nav class="header-menu-secondary-nav">

    <ul class="header-menu-level1">

        {{#each categories}}
            <li>
                <a class="{{class}}" {{objectToAtrributes this}}
                    {{#if categories}}
                        data-toggle="dropdown"
                        data-cms-refresh
                    {{/if}}>
                    {{text}}
                </a>
                {{#if categories}}
                    <div class="header-menu-level-container header-menu-level2">
                                {{#if detailed}}
                                    <div class="cont-left">
                                        <ul class="content">
                                    {{#each categories}}
                                        <li>
                                            <a class="{{class}}" {{objectToAtrributes this}} data-cms-refresh>{{text}}</a>
                                        </li>

                                    {{/each}}
                                        </ul>
                                    </div>
                                    <div class="cont-right">
                                        {{#each categories}}
                                            <div class="header-menu-level-container-content {{class}}">
                                                <div
                                                    data-cms-area="{{class}}"
                                                    data-cms-area-filters="global">
                                                </div>
                                            </div>
                                        {{/each}}
                                    </div>

                                {{else}}
                                    <ul class="nocontent"  data-cms-area="{{text}}"
                                        data-cms-area-filters="global">

                                    </ul>
                                {{/if}}

                    </div>
                {{/if}}
            </li>
        {{/each}}

    </ul>

</nav>
