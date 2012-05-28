//by Sergio Drago Sergio Drago <albsteen@gmail.com>

(function($) { 
// Define the maximize button 
$.cleditor.buttons.maximize = { 
	name: "maximize", 
  	image: "maximize.gif",
	title: "Maximize", 
	command: "", 
	popupName: "", 
	buttonClick: maximizeButtonClick 
}; 

$.cleditor.defaultOptions.controls = 
$.cleditor.defaultOptions.controls.replace(" source", " source maximize");


function maximizeButtonClick(e, data) { 
	var editor = data.editor; 
	if (!editor.options.originalWidth) { 
		editor.options.originalWidth = editor.options.width; 
		editor.options.originalHeight = editor.options.height; 
		editor.options.maximize = true; 
		editor.options.scrollto = 0; 
	} 

	if (editor.options.maximize == true) { // check current width status 
		$("body").css({ overflow: "hidden" }) 
		editor.$main.css({ position: "absolute", top: 0, left: 0, width: $ 
		(window).width() - 4, height: $(window).height() - 4 }); 
		editor.$main.offset({ top: 0, left: 0 }); 
		editor.$main.width($(window).width() - 4); 
		editor.options.width = $(window).width() - 4; 
		editor.$main.height($(window).height() - 4); 
		editor.options.height = $(window).height() - 4; 
		editor.options.maximize = false; 
		editor.options.scrollto = 0 
	} else { // check current width status 

		$("body").css({ overflow: "auto" }) 
		editor.$main.css({ position: "relative", width: 
		editor.options.originalWidth, height: 
		editor.options.originalHeight }); 
		editor.$main.width(editor.options.originalWidth); 
		editor.options.width = editor.options.originalWidth; 
		editor.$main.height(editor.options.originalHeight); 
		editor.options.height = editor.options.originalHeight; 
		editor.options.maximize = true; 
		editor.options.scrollto = editor.$main.position().top 
	} 

	editor.updateTextArea(); 
	editor.refresh(); 
	$(window).scrollTop(editor.options.scrollto) 
	if (!$.browser.msie) { editor.focus(); } // don't run with scrollTo in IE 
	return false; 
} 
})(jQuery); 
