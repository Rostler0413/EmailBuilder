import React from "react";
import _ from "lodash";
import { componentWrapperCssProperties, tagSpecificCssProperties, typeSpecificCssProperties, styleDefaults, blockTypes } from "./componentDefinition";
import imagePlaceholder from "assets/images/icons/email-template";
import shortid from "shortid";

export const getComponentStyles = (component, cssProperties) => {
	let staticWrapperStyles = "box-sizing: border-box;display: block;";

	let styleString = _.map(Object.keys(component.styles), (key) => {
		if (component.styles[key] && _.has(cssProperties, key)) {
			return `${cssProperties[key]}:${!isNaN(component.styles[key]) ? `${component.styles[key]}px` : component.styles[key]};`;
		}
		return "";
	}).join("");

	return styleString + staticWrapperStyles;
};

export const applyStyles = (component, html) => {
	const applyCssToElements = (propertyList) => {
		propertyList.forEach((tag) => {
			let elements = html && tag.tagQuery ? html.querySelectorAll(tag.tagQuery) : [];
			elements.forEach((element) => {
				//properties that are defined on the backend
				if (tag.properties) {
					Object.keys(tag.properties).forEach((property) => {
						if (component.styles[property] && !element.style[tag.properties[property]]) element.style[tag.properties[property]] = !isNaN(component.styles[property]) ? `${component.styles[property]}px` : component.styles[property];
					});
				}

				if (tag.styles) {
					//default css styles for element types
					Object.keys(tag.styles).forEach((property) => {
						if (!element.style[property]) element.style[property] = tag.styles[property];
					});
				}
			});
		});
	};
	applyCssToElements(tagSpecificCssProperties);

	if (typeSpecificCssProperties[component.type]) {
		applyCssToElements(typeSpecificCssProperties[component.type].tagQueryList);
	}
};

const getWrapperStyles = (component) => {
	let wrapperCssProperties = { ...componentWrapperCssProperties };
	if (typeSpecificCssProperties[component.type] && typeSpecificCssProperties[component.type].wrapperOverrides) {
		typeSpecificCssProperties[component.type].wrapperOverrides.forEach((property) => delete wrapperCssProperties[property]);
	}

	return getComponentStyles(component, wrapperCssProperties);
};

export class FormatComponentHtml {
	constructor() {
		this.text = this.Text;
		this.button = this.Button;
		this.code = this.Code;
		this.image = this.Image;
		this.image_group = this.Image;
		this.divider = this.Divider;
	}

	Text = (component) => {
		let wrapperStyles = getWrapperStyles(component);
		let html = `<div style="${wrapperStyles}">${component.text}</div>`;
		let temporaryElement = document.createElement("div");
		temporaryElement.innerHTML = html;
		applyStyles(component, temporaryElement);

		return temporaryElement.innerHTML;
	};

	Button = (component) => {
		let wrapperStyles = getWrapperStyles(component);
		let html = `<div style="${wrapperStyles}"><a href="${component.href}" target="_blank" style="line-height: 1;border-radius: 3px;text-decoration: none;text-transform: uppercase;display: inline-block; text-align: center;">${component.text}</a></div>`;
		let temporaryElement = document.createElement("div");
		temporaryElement.innerHTML = html;
		applyStyles(component, temporaryElement);

		return temporaryElement.innerHTML;
	};

	Code = (component) => {
		return component.text;
	};

	Image = (component) => {
		let wrapperStyles = getWrapperStyles(component);
		let imageList = [];
		if (component.imageLimit > 1) wrapperStyles += "flex: 1 1 50%;max-width: 50%;";

		for (let i = 0; i < component.imageLimit; i++) {
			let image = `<div style="${wrapperStyles}"><svg xmlns="http://www.w3.org/2000/svg" width="244.424" height="213.87" viewBox="0 0 244.424 213.87">
							<path id="Icon_metro-image" data-name="Icon metro-image" d="M231.691,19.132a.244.244,0,0,1,.028.028V202.422a.248.248,0,0,1-.028.028H17.874a.214.214,0,0,1-.027-.028V19.16a.244.244,0,0,1,.027-.027Zm.028-15.276H17.847A15.321,15.321,0,0,0,2.571,19.132V202.449a15.321,15.321,0,0,0,15.277,15.276H231.719A15.321,15.321,0,0,0,247,202.449V19.132A15.321,15.321,0,0,0,231.719,3.856ZM201.166,57.323a22.915,22.915,0,1,1-22.915-22.915,22.915,22.915,0,0,1,22.915,22.915Zm15.277,129.849H33.124V156.62L86.592,64.962,147.7,141.344h15.277l53.468-45.829Z" transform="translate(-2.571 -3.856)" fill="#e4e6e6"/>
						</svg></div>
						`;

			if (component.component_resources[i] && component.component_resources[i].resource_file) {
				image = `<div style="${wrapperStyles}"><img src="${component.component_resources[i].resource_file}" alt="skillsuite image" /></div>`;
			}
			imageList.push(image);
		}

		let html = imageList.join("");
		if (component.imageLimit > 1) html = `<div style="display: flex;justify-content: space-around;padding-left: ${component.styles.padding_left}px;padding-right: ${component.styles.padding_right}px;background-color: ${component.styles.background_color};">${html}</div>`;

		let temporaryElement = document.createElement("div");
		temporaryElement.innerHTML = html;
		applyStyles(component, temporaryElement);

		return temporaryElement.innerHTML;
	};

	Divider = (component) => {
		let wrapperStyles = getWrapperStyles(component);
		let html = `<div style="${wrapperStyles}"><hr style="max-width: 100%;box-sizing: border-box;" /></div>`;
		let temporaryElement = document.createElement("div");
		temporaryElement.innerHTML = html;
		applyStyles(component, temporaryElement);

		return temporaryElement.innerHTML;
	};
}

export const buildEmailHtml = (state) => {
	let defaultModelStart = `
	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
	<head>
	<link rel="preconnect" href="https://fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
	</head>
	<body style="display: block;margin: 0 auto; padding: 0;box-sizing: border-box;padding: 60px 20px; background-color: #f9f9f7;max-width: 900px; font-family: 'Montserrat';font-size: 15px;font-weight: 400;">
	<span style="display: none;">${state.preview_text || ""}</span>
	<div style="margin: 0 auto;padding: 0;box-sizing: border-box;display: block;position: relative; max-width: 600px;background-color: ${state.background_color};">
	`;

	let defaultModelEnd = `
	</div>
	<footer style="margin: 0 auto;max-width: 600px;display: block;font-size: 9px;text-align: center;padding: 30px 20px;">
		<p style="margin: 0 0 15px;display: block;font-size: inherit;text-align: inherit;font-family: 'Montserrat';font-weight: 400;color: #000;">Powered by SkillSuite LLC.</p>
	</footer>
	</body>
	</html>
	`;

	let componentHtmlFormatter = new FormatComponentHtml();
	let components = [...state.components];

	let componentsHtml = _.map(components, (component) => {
		component.html = componentHtmlFormatter[component.type](component);
		return component.html;
	}).join("");

	return defaultModelStart + componentsHtml + defaultModelEnd;
};


export const formatComponentToPost = (component, index, templateId) => {
			return {
				text: component.text ? component.text : "",
				html: component.html,
				type: component.type,
				component_resources: _.map(component.component_resources, (resource) => {
					return { resource: resource.resource, ...(resource.id && { id: resource.id }) };
				}),
				index,
				email_template: templateId,
				...(component.id && { id: component.id }),
				...component.styles
			};
	};
export const formatDataToPost = (state) => {


	return {
		body: buildEmailHtml(state),
		label: state.label,
		description: state.description,
		preview_text: state.preview_text,
		password_reset: false,
		background_color: state.background_color,
		is_single_use: false,
		org_node: state.org_node,
		entity: state.entity,
		subject: state.subject
	};
};

export const formatDataFromBackend = (data) => {
	let styleKeys = Object.keys(styleDefaults);
	const formatComponents = () => {
		return _.map(data.components, (component) => {
			let styles = {};
			styleKeys.forEach((key) => {
				styles[key] = component[key];
				delete component[key];
			});
			return { ...blockTypes[component.type], ...component, styles: { ...styles }, text: component.text ? component.text : "" };
		});
	};
	return {
		...data,
		components: formatComponents(),
		background_color: data.background_color || "#fff"
	};
};
