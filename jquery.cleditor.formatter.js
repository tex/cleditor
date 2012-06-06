(function($) {

    var allEmptyHtml = '<p><br></p>';
	var mozillaEmptyHtml = '<p>&nbsp;</p>';

    $.cleditor.defaultOptions.plugins.push(setupPlugin);

    function setupPlugin(editor) {

        // Let it start with a paragraph if empty document.
        formatEmpty(editor);

        $(editor.doc).bind("keydown", $.proxy(keyDown, editor));
        $(editor.doc).bind("keyup", $.proxy(keyUp, editor));
    }

    function keyUp(e) {
        var key = e.keyCode || e.which;

        if (key == 13 && !e.shiftKey && !e.ctrlKey && !e.metaKey)
            return formatNewLine(this, e);

        // Prevent a DELETE key to delete an initial paragraph
        // if selected all.
        if (key == 46)
            return formatEmpty(this);

        return true;
    }

    function keyDown(e) {
        var key = e.keyCode || e.which;

        // Prevent a BACKSPACE key to delete an initial paragraph
        // if document is otherwise empty.
        if (key == 8) {
            var html = $.trim($(this.doc.body).html());
            if (html === allEmptyHtml) {
                if (e.preventDefault)
                    e.preventDefault();
                return false;
            }
            return true;
        }
    }

    function getCurrentNode(editor) {
        if (window.getSelection)
            return editor.getSelection().getRangeAt(0).startContainer;
        else if (document.selection)
            return editor.getSelection();
    }

    function formatNewLine(editor, e) {
        if (e.preventDefault) e.preventDefault();

        element = $(getCurrentNode(editor));
        if ((element.get(0).tagName == 'DIV' || $(element.get(0)).parent().get(0).tagName == 'DIV')
                && (element.html() == '' || element.html() == '<br>'))
        {
            var childs = element.clone().get(0).childNodes;
            newElement = $('<p>').append(childs);
            element.replaceWith(newElement);
            newElement.html('<br />');
            setFocusNode(editor, newElement.get(0));

            return false;
        }

        return true;
    }

    function setFocusNode(editor, node, toStart) {
        var range = editor.doc.createRange();
        var selection = editor.getSelection();
        toStart = toStart ? 0 : 1;

        if (selection !== null)
        {
            range.selectNodeContents(node);
            selection.addRange(range);
            selection.collapse(node, toStart);
        }

        editor.focus();
    }

    function formatEmpty(editor) {
        var html = $.trim($(editor.doc.body).html());
        if ($.browser.mozilla) html = html.replace(/<br>/gi, '');

        if (html === '') {
            var nodehtml = allEmptyHtml;
            if ($.browser.mozilla) nodehtml = mozillaEmptyHtml;

            var node = $(nodehtml).get(0);
            $(editor.doc.body).html(node);
            setFocusNode(editor, node);
            return false;
        }
        return true;
    }

})(jQuery);
