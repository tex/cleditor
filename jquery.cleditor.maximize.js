//by Sergio Drago Sergio Drago <albsteen@gmail.com>

var clmai18n_en = {
    title: "Maximize"
};

if (!clmai18n) {
	var clmai18n = clmai18n_en;
}

(function($) {
$.cleditor.buttons.maximize = {
	name: "maximize",
  	image: "maximize.gif",
	title: clmai18n.title,
	command: "",
	popupName: "",
	buttonClick: maximizeButtonClick
};

$.cleditor.defaultOptions.controls =
$.cleditor.defaultOptions.controls.replace(" source", " source maximize");

$.cleditor.defaultOptions.maximized = false;

function maximizeButtonClick(e, data) {
	var editor = data.editor;

	if (editor.options.maximized == false) {
        editor.options.originalWidth = editor.$main.width();
		editor.options.originalHeight = editor.$main.height();
		$("body").css({ overflow: "hidden" })
		editor.$main.css({ position: "absolute", top: 0, left: 0,
                           width: $(window).width() - 4,
                           height: $(window).height() - 4 });
		editor.$main.offset({ top: 0, left: 0 });
		editor.$main.width($(window).width() - 4);
		editor.options.width = $(window).width() - 4;
		editor.$main.height($(window).height() - 4);
		editor.options.height = $(window).height() - 4;
		editor.options.maximized = true;
		editor.options.scrollto = 0
	} else {

		$("body").css({ overflow: "auto" })
		editor.$main.css({ position: "relative",
                           width: editor.options.originalWidth,
                           height: editor.options.originalHeight });
		editor.$main.width(editor.options.originalWidth);
		editor.options.width = editor.options.originalWidth;
		editor.$main.height(editor.options.originalHeight);
		editor.options.height = editor.options.originalHeight;
		editor.options.maximized = false;
		editor.options.scrollto = editor.$main.position().top
	}

	editor.updateTextArea();
	editor.refresh();
	$(window).scrollTop(editor.options.scrollto)
	if (!$.browser.msie) { editor.focus(); } // don't run with scrollTo in IE
	return false;
}
})(jQuery);
