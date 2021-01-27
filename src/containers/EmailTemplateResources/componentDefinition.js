import React from "react";

import { TextComponent, LineThroughIcon, UnderlineIcon, ItalicIcon, BoldIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, DividerComponent, ImageComponent, ImageGroupComponent, ButtonComponent, ImageTextComponent, CodeComponent, FooterComponent } from "assets/images/icons/email-template";

//prettier-ignore
let fontStyleButtons = (fieldPrefix) => [
	{
		value: "bold",
		field: `${fieldPrefix}_font_weight`,
		icon: <BoldIcon />
	},
	{
		value: "italic",
		field: `${fieldPrefix}_font_style`,
		icon: <ItalicIcon />
	},
	{
		value: "underline",
		field: `${fieldPrefix}_text_decoration`,
		icon: <UnderlineIcon />
	},
	{
		value: "line-through",
		field: `${fieldPrefix}_text_decoration`,
		icon: <LineThroughIcon />
	}
];

//prettier-ignore
let alignmentButtons = (fieldPrefix) => [
	{
		value: "left",
		field: `${fieldPrefix}_alignment`,
		icon: <AlignLeftIcon />
	},
	{
		value: "center",
		field: `${fieldPrefix}_alignment`,
		icon: <AlignCenterIcon />
	},
	{
		value: "right",
		field: `${fieldPrefix}_alignment`,
		icon: <AlignRightIcon />
	},
	{
		value: "justify",
		field: `${fieldPrefix}_alignment`,
		icon: <AlignJustifyIcon />
	}
];

const buttonSettingSections = [
	{
		label: "",
		settings: [
			{ type: "text", label: "Button Text", field: "text" },
			{ type: "text", label: "Button Url", field: "href" }
		]
	},
	{
		label: "",
		settings: [
			{ type: "color", field: "button_background_color", label: "BUTTON BACKGROUND COLOR" },
			{ type: "color", field: "link_color", label: "Button Font Color" },
			{ type: "buttons", buttons: alignmentButtons("body"), label: "Button Alignment" },
			{ type: "buttons", buttons: fontStyleButtons("body"), label: "Button Font Style" }
		]
	},
	{
		label: "Body Style",
		settings: [
			{ type: "padding", label: "Padding" },
			{ type: "margin", label: "Margin" },
			{ type: "color", label: "Background Color", field: "background_color" }
		],
		elementQuery: null
	}
];

const textSettingSections = [
	{
		label: "Text",
		settings: [{ type: "froala", label: "text" }]
	},
	{
		label: "Body Style",
		settings: [{ type: "color", label: "Background Color", field: "background_color" }, { type: "border" }, { type: "padding", label: "Padding" }, { type: "margin", label: "Margin" }]
	},
	{
		label: "Headers",
		settings: [
			{ type: "font_family", field: "header_font", label: "Font Family" },
			{ type: "buttons", buttons: fontStyleButtons("header"), label: "Font Style" },
			{ type: "color", field: "header_font_color", label: "Font Color" },
			{ type: "buttons", buttons: alignmentButtons("header"), label: "Alignment" }
		]
	},
	{
		label: "Body Text",
		settings: [
			{ type: "font_family", field: "body_font", label: "Font Family" },
			{ type: "buttons", buttons: fontStyleButtons("body"), label: "Font Style" },
			{ type: "color", field: "body_font_color", label: "Font Color" },
			{ type: "buttons", buttons: alignmentButtons("body"), label: "Alignment" },
			{ type: "color", field: "link_color", label: "Link Color", elementQueryOverride: "a" }
		]
	}
];

const standardSettingsSections = [
	{
		label: "Background Color",
		settings: [{ type: "color", label: "Background Color", field: "background_color" }]
	},
	{
		settings: [
			{ type: "padding", label: "Padding" },
			{ type: "margin", label: "Margin" }
		]
	}
];

//These are the different settings available to each type of component
export const componentSettingsDefinition = {
	text: {
		sections: textSettingSections
	},
	code: {
		sections: [{ label: "Code", settings: [{ type: "froala", label: "", codeView: true }] }]
	},
	image: {
		sections: [
			{
				label: "",
				settings: [{ type: "image", label: "Image" }]
			},
			...standardSettingsSections
		]
	},
	image_group: {
		sections: [
			{
				label: "",
				settings: [{ type: "image", label: "Image" }]
			},
			...standardSettingsSections
		]
	},
	image_text: {
		sections: [
			{
				label: "",
				settings: [{ type: "image", label: "Image" }]
			},
			...textSettingSections
		]
	},
	button: {
		sections: buttonSettingSections
	},
	divider: {
		sections: [
			{
				label: "Divider Styles",
				settings: [
					{
						type: "color",
						label: "Divider Color",
						field: "border_top_color"
					},
					{
						type: "pixel",
						label: "Divider Width",
						field: "border_top_width"
					}
				]
			},
			...standardSettingsSections
		]
	}
};
//maps each style to the actual css property
export const componentWrapperCssProperties = {
	background_color: "background-color",
	padding_top: "padding-top",
	padding_bottom: "padding-bottom",
	padding_left: "padding-left",
	padding_right: "padding-right",
	margin_top: "margin-top",
	margin_bottom: "margin-bottom",
	body_font: "font-family",
	body_font_style: "font-style",
	body_font_color: "color",
	body_alignment: "text-align",
	body_text_decoration: "text-decoration",
	border_top: "border-top-style",
	border_bottom: "border-bottom-style",
	border_top_color: "border-top-color",
	border_bottom_color: "border-bottom-color",
	border_top_width: "border-top-width",
	border_bottom_width: "border-bottom-width"
};

export const typeSpecificCssProperties = {
	button: {
		tagQueryList: [
			{
				tagQuery: "a",
				properties: {
					button_background_color: "background-color",
					padding_bottom: "padding-bottom",
					padding_top: "padding-top",
					padding_left: "padding-left",
					padding_right: "padding-right",
					margin_top: "margin-top",
					margin_bottom: "margin-bottom",
					margin_left: "margin-left",
					margin_right: "margin-right"
				}
			}
		],
		wrapperOverrides: ["button_background_color", "padding_bottom", "padding_top", "padding_left", "padding_right", "margin_top", "margin_bottom"]
	},
	divider: {
		tagQueryList: [
			{
				tagQuery: "hr",
				properties: {
					border_top: "border-top-style",
					border_top_color: "border-top-color",
					border_top_width: "border-top-width",
					margin_top: "margin-top",
					margin_bottom: "margin-bottom",
					margin_left: "margin-left",
					margin_right: "margin-right"
				}
			}
		],
		wrapperOverrides: ["border_top", "border_top_color", "border_top_width", "margin_top", "margin_bottom", "margin_left", "margin_right"]
	}
};
export const tagSpecificCssProperties = [
	{
		tagQuery: "a",
		properties: {
			link_color: "color"
		}
	},
	{
		tagQuery: "h1,h2,h3,h4,h5,h6",
		properties: {
			header_font: "font-family",
			header_font_style: "font-style",
			header_font_color: "color",
			header_alignment: "text-align",
			header_text_decoration: "text-decoration"
		}
	},
	{
		tagQuery: "img",
		styles: {
			"max-width": "100%"
		}
	}
];

//define component styles defaults
export const styleDefaults = {
	background_color: "#00000000",
	padding_top: "20",
	padding_bottom: "20",
	padding_left: "15",
	padding_right: "15",
	margin_top: "0",
	margin_bottom: "0",
	margin_left: "0",
	margin_right: "0",
	item_background_color: null,
	item_front_color: "#000",
	body_font: "Montserrat",
	body_font_style: "normal",
	body_font_color: "#000",
	body_alignment: null,
	body_text_decoration: null,
	header_font: "Montserrat",
	header_font_style: "normal",
	header_font_color: "#000",
	header_alignment: null,
	header_text_decoration: null,
	link_color: "#000",
	border_top: "none",
	border_bottom: "none",
	border_top_color: "#000",
	border_bottom_color: "#000",
	border_top_width: "1",
	border_bottom_width: "1",
	button_background_color: "#1ddaff"
};

//this is the default component settings
export const blockTypes = {
	text: {
		type: "text",
		label: "TEXT",
		icon: <TextComponent />,
		text: "<p></p>",
		styles: { ...styleDefaults }
	},
	code: {
		type: "code",
		label: "CODE",
		icon: <CodeComponent />,
		text: "<div>Code Here</div>",
		styles: {}
	},
	image: {
		type: "image",
		label: "IMAGE",
		icon: <ImageComponent />,
		component_resources: [],
		imageLimit: 1,
		styles: { ...styleDefaults, body_alignment: "center" }
	},
	image_group: {
		type: "image_group",
		label: "Image Group",
		component_resources: [],
		icon: <ImageGroupComponent />,
		imageLimit: 2,
		styles: { ...styleDefaults, body_alignment: "center", padding_left: 8, padding_right: 8 }
	},
	// image_text: {
	// 	type: "image_text",
	// 	label: "Image & Text",
	// 	icon: <ImageTextComponent />,
	// 	text: "<p>Lorem ipsum dole whip lol</p>",
	//	imageLimit: 1,
	// 	styles: { ...styleDefaults }
	// },
	divider: {
		type: "divider",
		label: "Divider",
		icon: <DividerComponent />,
		styles: {
			...styleDefaults,
			border_top: "solid"
		}
	},
	button: {
		type: "button",
		label: "Button",
		text: "SkillSuite",
		icon: <ButtonComponent />,
		href: "https://skillsuite.com/",
		styles: {
			...styleDefaults,
			body_alignment: "center",
			padding_bottom: "10",
			padding_top: "10",
			padding_left: "15",
			padding_right: "15",
			margin_top: "10",
			margin_bottom: "10",
			margin_left: "10",
			margin_right: "10",
			link_color: "#fff"
		}
	}
};
