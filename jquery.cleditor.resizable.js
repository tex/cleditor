(function($) {

    $.cleditor.defaultOptions.plugins.push(setupPlugin);

    function setupPlugin(editor) {

        if (editor.options.resizable === false) {
            return;
        }

        var handles = editor.options.resizable === true ?
            "e, s, se" : editor.options.resizable;

        editor.$main.resizable({minWidth: '350', minHeight: '150', handles: handles,
            resize:
            function(event, ui) {
                var $toolbar = editor.$toolbar;
                $group = $toolbar.children("div:last");

                // Resize the toolbar
                var hgt = $group.offset().top + $group.outerHeight() - $toolbar.offset().top + 1;
                $toolbar.height(hgt);
            },
            start:
            function(event, ui) {
                editor.$main.sourceMode = editor.sourceMode();
                if (editor.$main.sourceMode) {
                    editor.updateFrame();
                    editor.$area.hide();
                } else {
                    editor.updateTextArea(true);
                    editor.$frame.hide();
                }
            },
            stop:
            function(event, ui) {
                editor.options.width='auto';
                editor.options.height='auto';
                editor.refresh();
                editor.focus();
            }
        });

    }

})(jQuery);
