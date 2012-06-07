(function($) {

    $.cleditor.defaultOptions.plugins.push(setupPlugin);

    function setupPlugin(editor) {
        $(editor.doc).bind("keydown", $.proxy(keyDown, editor));
    }

    function keyDown(e) {
        var key = e.keyCode || e.which;

        if (key == 9) {
            if (e.preventDefault)
                e.preventDefault();
            var cmd = (e.shiftKey) ? "outdent" : "indent";
            this.execCommand(cmd);
            return false;
        }
        return true;
    }

})(jQuery);
