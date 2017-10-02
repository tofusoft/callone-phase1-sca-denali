/**
 * Created by icorrea on 10/21/2015.
 */
define("MegaMenu.Header.Menu.View", ["Header.Menu.View"], function (HeaderMenuView) {
    _.extend(HeaderMenuView.prototype, {
        events: {
            'click .header-menu-level-container .cont-left li a': "showChildren"
        },


        showChildren: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $this = jQuery(e.currentTarget);
            var className = $this.attr("id");

            $this.parent().parent().find('a').removeClass("active");


            $this.addClass("active");


            jQuery(".cont-right .header-menu-level-container-content").stop().fadeOut();
            jQuery("." + className).stop().fadeIn();

        }
    });

})