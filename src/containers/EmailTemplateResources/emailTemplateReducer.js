import React from "react";
import { FormatComponentHtml } from "./emailTemplateDataFormat";
import shortid from "shortid";

export const emailTemplateReducer = (state, action) => {
	const { type, payload = {} } = action;
	let components = [...state.components];

	const getComponentHtml = (component) => new FormatComponentHtml()[component.type](component);

	switch (type) {
		case "PATCH_FIELD":
			return { ...state, ...payload };
		case "ADD_COMPONENT":
			let newComponent = payload;
			newComponent.html = getComponentHtml(newComponent);
			return { ...state, components: [...state.components, newComponent], activeComponentIndex: state.components.length, draggableId: shortid.generate() };
		case "COMPONENT_FIELD_CHANGE":
			components[state.activeComponentIndex][payload.field] = payload.value;
			components[state.activeComponentIndex].text = components[state.activeComponentIndex].text || "";
			components[state.activeComponentIndex].html = getComponentHtml(components[state.activeComponentIndex]);
			return { ...state, components: components };
		case "COMPONENT_STYLE_CHANGE":
			components[state.activeComponentIndex].styles[payload.field] = payload.value;
			components[state.activeComponentIndex].html = getComponentHtml(components[state.activeComponentIndex]);
			return { ...state, components: components };
		case "COPY_COMPONENT":
			components.splice(payload + 1, 0, { ...components[payload], draggableId: shortid.generate() });
			return { ...state, components: components, activeComponentIndex: payload + 1 };
		case "DELETE_COMPONENT":
			components.splice(payload, 1);
			return { ...state, components: components, activeComponentIndex: null };
		case "REORDER_COMPONENT":
			if (payload.destination < components.length && payload.destination >= 0) {
				let component = components.splice(payload.index, 1);
				components.splice(payload.destination, 0, ...component);
			}

			return { ...state, components: components, activeComponentIndex: null };
		default:
			return state;
	}
};
