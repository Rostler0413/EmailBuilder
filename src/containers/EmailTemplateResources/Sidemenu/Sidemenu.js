import React, { useState } from "react";
import _ from "lodash";
import { blockTypes } from "../componentDefinition";
import ComponentSettingsMenu from "./ComponentSettingsMenu";
import { BlockPicker } from "react-color";
import { ReactComponent as ColorIcon } from "assets/images/icons/color-picker.svg";
import OwnerSelect from "containers/OwnerSelect/OwnerSelect";
import shortid from "shortid";

const EmailSidemenu = ({ state, dispatch }) => {
	const [showColorPicker, setShowColorPicker] = useState(false);

	const colorChangeHandler = (color) => {
		if (color.hex && color.hex !== state.background_color) dispatch({ type: "PATCH_FIELD", payload: { background_color: color.hex || state.background_color } });
	};

	const renderComponentSettingsMenu = () => {
		const component = state.components[state.activeComponentIndex];
		return (
			<div className="email-component-settings-wrapper">
				<div className="close-email-submenu" onClick={() => dispatch({ type: "PATCH_FIELD", payload: { activeComponentIndex: null } })}></div>
				<ComponentSettingsMenu component={component} state={state} dispatch={dispatch} />
				<div className="text-right">
					<button type="button" className="btn btn-small mr-0" onClick={() => dispatch({ type: "PATCH_FIELD", payload: { activeComponentIndex: null } })}>
						Close
					</button>
				</div>
			</div>
		);
	};

	const ownerSelectCallback = (event) => {
		let object = { ...state };
		let objectType = "org_node";
		if (event.type === "branch") objectType = "entity";
		object.entity = null;
		object.org_node = null;
		object[objectType] = event.id;

		dispatch({ type: "PATCH_FIELD", payload: { org_node: object.org_node, entity: object.entity } });
	};
	return (
		<div className="email-side-menu">
			<div className={`email-side-menu-inner${state.activeComponentIndex === null ? " active" : ""}`}>
				<div className="email-settings-input-wrapper mb-3">
					<h3 className="side-menu-section-header mb-1">Label</h3>
					<p className="side-menu-description">What would you like to call this saved email?</p>
					<input maxLength="150" defaultValue={state.label} onChange={(e) => dispatch({ type: "PATCH_FIELD", payload: { label: e.target.value } })} />
					<div className="input-character-limit">150 characters</div>
				</div>
				<div className="email-settings-input-wrapper mb-3">
					<h3 className="side-menu-section-header mb-1">Description</h3>
					<p className="side-menu-description">What is this saved email for?</p>
					<input maxLength="150" defaultValue={state.description} onChange={(e) => dispatch({ type: "PATCH_FIELD", payload: { description: e.target.value } })} />
					<div className="input-character-limit">150 characters</div>
				</div>
				<hr />
				<div className="email-settings-input-wrapper mb-3">
					<h3 className="side-menu-section-header mb-1">Subject</h3>
					<p className="side-menu-description">What is the subject line for this campaign?</p>
					<input maxLength="150" defaultValue={state.subject} onChange={(e) => dispatch({ type: "PATCH_FIELD", payload: { subject: e.target.value } })} />
					<div className="input-character-limit">150 characters</div>
				</div>
				<div className="email-settings-input-wrapper">
					<h3 className="side-menu-section-header mb-1">Preview Text</h3>
					<input maxLength="150" defaultValue={state.preview_text} onChange={(e) => dispatch({ type: "PATCH_FIELD", payload: { preview_text: e.target.value } })} />
					<div className="input-character-limit">150 characters. Preview text appears in the inbox after the subject line.</div>
				</div>
				<hr />
				<OwnerSelect defaultOpen={state.org_node ? true : false} defaultType={state.org_node ? "tier" : "branch"} defaultObject={state.entity_label || state.org_node_label ? { label: state.entity_label || state.org_node_label, id: state.entity || state.org_node, value: state.entity || state.org_node } : null} permission="" title={false} callback={ownerSelectCallback} />
				<hr />
				<div className="email-background-color">
					<h3 className="side-menu-section-header">Email Background Color</h3>
					{showColorPicker ? <div className="close-email-color-picker" onClick={() => setShowColorPicker(false)}></div> : null}
					<div style={{ ...(showColorPicker && { zIndex: 5000, position: "relative" }) }} className="email-setting-color-field" onClick={() => setShowColorPicker(true)}>
						<div className="email-color-picker-input">
							<div className="email-color-icon">
								<ColorIcon />
							</div>
							<input readOnly type="text" value={state.background_color} />
							<div className="email-color-picker-color-block" style={{ backgroundColor: state.background_color }}></div>
						</div>
						{showColorPicker ? <BlockPicker color={state.background_color} onChangeComplete={colorChangeHandler} /> : null}
					</div>
				</div>
				<hr />
				<div className="email-block-types">
					<h3 className="side-menu-section-header">Content Blocks</h3>
					{_.map(Object.keys(blockTypes), (blockType) => {
						return (
							<div className="email-block-type" key={`add-component${blockType}`} onClick={() => dispatch({ type: "ADD_COMPONENT", payload: { ...JSON.parse(JSON.stringify(blockTypes[blockType])), draggableId: shortid.generate() } })}>
								<div className="email-block-type-icon">{blockTypes[blockType].icon}</div>
								{blockTypes[blockType].label}
							</div>
						);
					})}
				</div>
			</div>
			<div className={`email-side-menu-inner component-side-menu${state.activeComponentIndex !== null ? " active" : ""}`}>{renderComponentSettingsMenu()}</div>
		</div>
	);
};

export default EmailSidemenu;
