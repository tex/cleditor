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
                    "<label>Float:</label>" +
                        "<select id='float'>" +
                            "<option value='left'>Left</option>" +
                            "<option value='right'>Right</option>" +
                            "<option value=''>None</option>" +
                        "</select><br>" +
                    "<label>Width:</label>" +
                        "<input id='width'><br>" +
                    "<label>Keep Aspect Ratio:</label>" +
                        "<input type='checkbox' id='keep_ratio' checked><br>" +
                    "<label>Height:</label>" +
                        "<input id='height'><br>" +
                    "<label>Margin</label><br>" +
                    "<label>Left:</label>" +
                        "<input id='margin-left'><br>" +
                    "<label>Right:</label>" +
                        "<input id='margin-right'><br>" +
                    "<label>Top:</label>" +
                        "<input id='margin-top'><br>" +
                    "<label>Bottom:</label>" +
                        "<input id='margin-bottom'><br>" +
                    "</form></div>");

            $("#float", $di).val($image.css("float"));
            $("#width", $di).val($image.width());
            $("#height", $di).val($image.height());
            $("#margin-left", $di).val($image.css("margin-left").replace(/px/gi, ''));
            $("#margin-right", $di).val($image.css("margin-right").replace(/px/gi, ''));
            $("#margin-top", $di).val($image.css("margin-top").replace(/px/gi, ''));
            $("#margin-bottom", $di).val($image.css("margin-bottom").replace(/px/gi, ''));

            $("#width", $di).bind("keyup", function() {
                that = $(this).parent();
                if ($("#keep_ratio", that).is(":checked")) {
                    $("#height", that).val($("#width", that).val()*ratio);
                }
            });
            $("#height", $di).bind("keyup", function() {
                that = $(this).parent();
                if ($("#keep_ratio", that).is(":checked")) {
                    $("#width", that).val($("#height", that).val()/ratio);
                }
            });

            $di.dialog({
                modal: true,
                title: "Edit Image Properties",
                buttons: {
                    OK: function() {
                            $image.css("float", $("#float", this).val());
                            $image.width($("#width", this).val());
                            $image.height($("#height", this).val());
                            $image.css("margin-left", $("#margin-left", this).val() + 'px');
                            $image.css("margin-right", $("#margin-right", this).val() + 'px');
                            $image.css("margin-top", $("#margin-top", this).val() + 'px');
                            $image.css("margin-bottom", $("#margin-bottom", this).val() + 'px');

                            $(this).dialog("close");
                        },
                    Cancel: function() {
                            $(this).dialog("close");
                        }
                }
            });
    }

})(jQuery);
