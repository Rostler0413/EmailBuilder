import React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { getComponentStyles, applyStyles } from "../emailTemplateDataFormat";
import insertIcon from "assets/images/icons/insert-icon.svg";
// Require Editor JS files.
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/code_beautifier.min.js";
import "froala-editor/js/plugins/code_view.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/paragraph_style.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/quick_insert.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/fullscreen.min.js";

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/themes/dark.min.css";
import "froala-editor/css/plugins/code_view.min.css";
import "froala-editor/css/plugins/colors.min.css";
import "froala-editor/css/plugins/draggable.min.css";
import "froala-editor/css/plugins/emoticons.min.css";
import "froala-editor/css/plugins/fullscreen.min.css";
// import "froala-editor/css/plugins/video.min.css";
import "froala-editor/css/plugins/table.min.css";
import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/plugins/quick_insert.min.css";

// Require Font Awesome.
import "font-awesome/css/font-awesome.css";

import FroalaEditorComponent from "react-froala-wysiwyg";
import FroalaEditor from "froala-editor";

let defaultToolbarButtons = {
	moreText: {
		buttons: ["bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "fontFamily", "fontSize", "textColor", "backgroundColor", "inlineStyle", "clearFormatting"],
		align: "left",
		buttonsVisible: 3
	},

	moreParagraph: {
		buttons: ["alignRight", "alignCenter", "alignLeft", "alignJustify", "formatOL", "formatUL", "paragraphFormat", "paragraphStyle", "lineHeight", "outdent", "indent", "quote"],
		align: "right",
		buttonsVisible: 3
	},

	moreRich: {
		buttons: ["insertLink", "insertTable", "fontAwesome", "insertImage", "insertHR"],
		align: "left",
		buttonsVisible: 3
	},

	moreMisc: {
		buttons: ["mergeFieldDropdown", "html", "fullscreen", "selectAll", "undo", "redo"],
		align: "right",
		buttonsVisible: 3
	}
};

//prettier-ignore
export const fontFamilyList = [
	"Ariel",
	"Montserrat",
	"Georgia",
	"Helvetica",
	"Times New Roman",
	"Palatino Linotype",
	"Comic Sans MS",
	"Impact",
	"Lucida Sans Unicode",
	"Tahoma",
	"Trebuchet MS",
	"Verdana",
	"Courier New",
	"Lucida Console"
];

const globalStylesToApply = [
	{
		attribute: "box-sizing",
		value: "border-box"
	},
	{
		attribute: "line-height",
		value: "1.4"
	}
];
const pTagStyles = [
	{
		attribute: "margin",
		value: "0 0 15px"
	}
];

const elementStylesToApply = [
	{
		selector: "p",
		styles: [...pTagStyles]
	},
	{
		selector: "div",
		styles: [
			{
				attribute: "display",
				value: "block"
			}
		]
	},
	{
		selector: "img",
		styles: [
			{
				attribute: "max-width",
				value: "100%"
			}
		]
	}
];

const applyElementStyles = (element, styleList) => {
	for (let i = 0; i < styleList.length; i++) {
		if (!element.style[styleList[i].attribute]) {
			element.style[styleList[i].attribute] = styleList[i].value;
		}
	}
};

const applyTagStyles = () => {
	elementStylesToApply.forEach((type) => {
		let tagElements = document.querySelectorAll(`.email-template-builder .fr-element ${type.selector}`);
		tagElements.forEach((element) => applyElementStyles(element, type.styles));
	});
};

const applyGlobalStyles = () => {
	const globalElements = document.querySelectorAll(".email-template-builder .fr-element *");
	globalElements.forEach((element) => applyElementStyles(element, globalStylesToApply));
};

function applyAllStyles() {
	applyGlobalStyles();
	applyTagStyles();
}

const frolaWrapperCssProperties = {
	background_color: "background-color",
	body_font: "font-family",
	body_font_style: "font-style",
	body_font_color: "color",
	body_alignment: "text-align",
	body_text_decoration: "text-decoration"
};

const EmailTemplateFroalaEditor = (props) => {
	const { onModelChange, component, config, events = {}, placeholder, merge_fields } = props;

	const userData = useSelector(({ auth }) => auth.userData);
	function initializedEvent() {
		applyAllStyles();
		window.froalaInstance = this;
		if (events.initialized) events.initialized(this);
	}
	function froalaBlurEvent() {
		applyAllStyles();
		if (events.blur) events.blur(this);
	}
	const myEvents = { ...events, initialized: initializedEvent, blur: froalaBlurEvent };

	let mergeFieldDropdown = {};
	let froalaEditorSelectors = ".email-template-builder .fr-box.fr-basic .fr-element";
	
	if (merge_fields && merge_fields.length > 0) {
		mergeFieldDropdown = {
			title: "Insert Merge Field",
			icon: `<img src="${insertIcon}" alt="insert merge field" />`,
			options: {},
			type: "dropdown",
			focus: false,
			undo: false,
			refreshAfterCallback: true,
			callback: function(cmd, val) {
				this.html.set(this.html.get() + val);
			},
			// Callback on dropdown show.
			refreshOnShow: function() {
				console.log("do refresh when show");
			},
			refresh: function($btn) {
				console.log("do refresh");
			}
		};
		merge_fields.forEach((field) => {
			mergeFieldDropdown.options[field.field] = field.name;
		});
		FroalaEditor.RegisterCommand("mergeFieldDropdown", mergeFieldDropdown);
	}
	const myConfig = {
		key: process.env.REACT_APP_FROALA_KEY,
		toolbarButtons: defaultToolbarButtons,
		theme: "royal",
		toolbarVisibleWithoutSelection: true,
		attribution: false,
		placeholderText: placeholder,
		imageUpload: true,
		imageAddNewLine: true,
		toolbarSticky: false,
		imageUploadRemoteUrls: false,
		imageAllowedTypes: ["jpeg", "jpg", "png", "svg", "raw"],
		events: myEvents,
		fontFamily: _.zipObject(fontFamilyList, fontFamilyList),
		customDropdowns: { mergeFieldDropdown: mergeFieldDropdown },
		...config
	};

	
	applyStyles(component, document.querySelector(".email-template-builder .fr-element"));

	return (
		<div className="col-12 p-0">
			<style>{`${froalaEditorSelectors}{ ${getComponentStyles(component, frolaWrapperCssProperties)} }`}</style>
			<FroalaEditorComponent onModelChange={(newModelState) => onModelChange(newModelState)} model={component.text} config={myConfig} />
		</div>
	);
};

export default EmailTemplateFroalaEditor;
