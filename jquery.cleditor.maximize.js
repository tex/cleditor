//by Sergio Drago Sergio Drago <albsteen@gmail.com>
//updated and fixed by Milan Svoboda <milan.svoboda@centrum.cz>

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
    var b = $("body");
    var m = editor.$main;

	if (editor.options.maximized == false) {
        editor.options.orig = {
            overflow: b.css("overflow"),
            position: m.css("position"),
            width: m.css("width"),
            height: m.css("height"),
            offset: m.offset()
        };

		b.css({ overflow: "hidden" })
		m.css({ position: "absolute", top: 0, left: 0,
                width: $(window).width() - 4,
                height: $(window).height() - 4 });
		m.width($(window).width() - 4);
		m.height($(window).height() - 4);
		m.offset({ top: 0, left: 0 });

		editor.options.maximized = true;
		editor.options.scrollto = 0
	} else {
        var orig = editor.options.orig;

		b.css({ overflow: orig.overflow })
		m.css({ position: orig.position, top: orig.offset.top, left: orig.offset.left,
                width: orig.width,
                height: orig.height });
		m.width(orig.width);
		m.height(orig.height);
		m.offset(orig.offset);
 
		editor.options.maximized = false;
		editor.options.scrollto = m.position().top
	}

	editor.updateTextArea();
	editor.refresh();
	$(window).scrollTop(editor.options.scrollto)
	if (!$.browser.msie) { editor.focus(); } // don't run with scrollTo in IE
	return false;
}
})(jQuery);
