(function($) {

    $.cleditor.defaultOptions.plugins.push(setupPlugin);

    function setupPlugin(editor) {

        if (editor.options.resizable === false) {
            return;
        }

        var handles = editor.options.resizable === true ?
            "e, s, se" : editor.options.resizable;

        // Get the random id.
        var id = new Date();
        id = id.getTime();

        // Answer to "resize and iframe problem":
        // http://stackoverflow.com/questions/8687232/jquery-resizable-object-does-not-retract

        $('<div id="'+id+'" style="position:absolute;top:0;width:0;margin:0;padding:0;width:100%;height:100%;display:none;"></div>')
            .appendTo(editor.$main);

        editor.$main.resizable({minWidth: '350', minHeight: '150', handles: handles,
            resize:
            function(event, ui) {
                if (handles.indexOf("e") || handles.indexOf("w")) {
                    var $toolbar = editor.$toolbar;
                    $group = $toolbar.children("div:last");

                    // Resize the toolbar
                    var hgt = $group.offset().top + $group.outerHeight() - $toolbar.offset().top + 1;
                    $toolbar.height(hgt);
                }
            },
            start:
            function(event, ui) {
                $("#"+id).css("display", "block");
            },
            stop:
            function(event, ui) {
                $("#"+id).css("display", "none");
            }
        });

    }

})(jQuery);
