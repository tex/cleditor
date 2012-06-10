var climi18n_en = {
    float: "Float",
    left: "Left",
    right: "Right",
    none: "None",
    width: "Width",
    keep_aspect_ratio: "Keep Aspect Ratio",
    height: "Height",
    margin: "Margin",
    top: "Top",
    bottom: "Bottom",
    image_properties_title: "Edit Image Properties",
    ok: "OK",
    cancel: "Cancel",
};

if (!climi18n) {
	var climi18n = climi18n_en;
}

(function($) {

    $.cleditor.defaultOptions.plugins.push(setupPlugin);

    function setupPlugin(editor) {
        observeImages(editor);
    }

    function observeImages(editor) {

        // Interval to attach resizeImage on images that will be
        // added into editor by user using regular add or paste.

        setInterval(
            function() {
                $(editor.doc).find('img').each(
                    function(i, s) {
                        resizeImage(editor, s);
                    });
            }, 1000);
    }

    function resizeImage(editor, image) {

        // Prevent reassign to the image if it is already
        // beeing watched.

        if ($(image).data('cleditor.image')) {
            return;
        }
        $(image).data('cleditor.image', 1);

        var clicked = false;
        var clicker = false;
        var start_x;
        var start_y;
        var ratio = $(image).width()/$(image).height();

        var min_w = 20;
        var min_h = 20;

        $(image).hover(
                function() {
                    $(image).css('cursor', 'nw-resize');
                },
                function() {
                    $(image).css('cursor','default');
                    clicked = false;
                });

        $(image).mousedown(function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }

            clicked = true;
            clicker = true;

            start_x = Math.round(e.pageY - $(image).eq(0).offset().left);
            start_y = Math.round(e.pageX - $(image).eq(0).offset().top);
        });

        $(image).mouseup($.proxy(function(e) {
            clicked = false;
        }, this));

        $(image).click($.proxy(function(e) {
            if (clicker) {
                editImage($(e.target), ratio);
            }
        }, this));

        $(image).mousemove(function(e) {
            if (clicked) {
                clicker = false;

                var mouse_x = Math.round(e.pageY - $(image).eq(0).offset().left) - start_x;
                var mouse_y = Math.round(e.pageX - $(image).eq(0).offset().top) - start_y;

                var div_h = $(image).height();

                var new_h = parseInt(div_h)+mouse_y;
                var new_w = new_h*ratio;

                if (new_w > min_w) { $(image).width(new_w); }
                if (new_h > min_h) { $(image).height(new_h); }

                start_x = Math.round(e.pageY - $(image).eq(0).offset().left);
                start_y = Math.round(e.pageX - $(image).eq(0).offset().top);
            }
        });
    }

    function editImage($image, ratio) {
            var $di = $("<div><form>" +
                    "<label>"+climi18n.float+":</label>" +
                        "<select id='float'>" +
                            "<option value='left'>"+climi18n.left+"</option>" +
                            "<option value='right'>"+climi18n.right+"</option>" +
                            "<option value=''>"+climi18n.none+"</option>" +
                        "</select><br>" +
                    "<label>"+climi18n.width+":</label>" +
                        "<input id='width'><br>" +
                    "<label>"+climi18n.keep_aspect_ratio+":</label>" +
                        "<input type='checkbox' id='keep_ratio' checked><br>" +
                    "<label>"+climi18n.height+":</label>" +
                        "<input id='height'><br>" +
                    "<label>"+climi18n.margin+":</label><br>" +
                    "<label>"+climi18n.left+":</label>" +
                        "<input id='margin-left'><br>" +
                    "<label>"+climi18n.right+":</label>" +
                        "<input id='margin-right'><br>" +
                    "<label>"+climi18n.top+":</label>" +
                        "<input id='margin-top'><br>" +
                    "<label>"+climi18n.bottom+":</label>" +
                        "<input id='margin-bottom'><br>" +
                    "</form></div>");

            $("#float", $di).val($image.css("float"));
            $("#width", $di).val($image.width());
            $("#height", $di).val($image.height());
            $("#margin-left", $di).val($image.css("margin-left").replace(/px/gi, ''));
            $("#margin-right", $di).val($image.css("margin-right").replace(/px/gi, ''));
            $("#margin-top", $di).val($image.css("margin-top").replace(/px/gi, ''));
            $("#margin-bottom", $di).val($image.css("margin-bottom").replace(/px/gi, ''));

            $("#width", $di).bind("change", function() {
                that = $(this).parent();
                if ($("#keep_ratio", that).is(":checked")) {
                    var width = $("#width", that);
                    var height = $("#height", that);
                    if (width.val().indexOf("%") != -1) {
                        height.val(width.val());
                        return;
                    }
                    if (!isNaN(width.val() / ratio)) {
                        height.val(width.val() / ratio);
                    }
                }
            });
            $("#height", $di).bind("change", function() {
                that = $(this).parent();
                if ($("#keep_ratio", that).is(":checked")) {
                    var height = $("#height", that);
                    var width = $("#width", that);
                    if (height.val().indexOf("%") != -1) {
                        width.val(height.val());
                        return;
                    }
                    if (!isNaN(height.val() / ratio)) {
                        width.val(height.val() / ratio);
                    }
                }
            });

            $di.dialog({
                modal: true,
                title: climi18n.image_properties_title,
                buttons: [
                    {text: climi18n.ok,
                     click: function() {
                            $image.css("float", $("#float", this).val());
                            $image.width($("#width", this).val());
                            $image.height($("#height", this).val());
                            $image.css("margin-left", $("#margin-left", this).val() + 'px');
                            $image.css("margin-right", $("#margin-right", this).val() + 'px');
                            $image.css("margin-top", $("#margin-top", this).val() + 'px');
                            $image.css("margin-bottom", $("#margin-bottom", this).val() + 'px');

                            $(this).dialog("close");
                        }
                    },{
                    text: climi18n.cancel,
                    click: function() {
                            $(this).dialog("close");
                        }
                    }]
            });
    }

})(jQuery);
