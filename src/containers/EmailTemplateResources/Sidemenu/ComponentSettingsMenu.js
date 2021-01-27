import React, { useState } from "react";
import { componentSettingsDefinition } from "../componentDefinition";
import FroalaEditor, { fontFamilyList } from "../Froala/FroalaEditor";
import _ from "lodash";
import { customSelectStyles, GetUser, errorToast } from "Global/functions";
import { BlockPicker } from "react-color";
import { ReactComponent as ColorIcon } from "assets/images/icons/color-picker.svg";
import Select, { components } from "react-select";
import { blockTypes } from "../componentDefinition";
import { ImagePlaceholder } from "assets/images/icons/email-template";
import shortid from "shortid";
import { AsyncPost, AsyncDelete } from "Global/api";

class EmailSettingsComponents {
	constructor(state, dispatch) {
		this.state = state;
		this.dispatch = dispatch;

		this.color = this.ColorField;
		this.image = this.ImageComponent;
		this.font_family = this.FontFamilySelect;
		this.buttons = this.StyleButtons;
		this.froala = this.FroalaSettingComponent;
		this.border = this.BorderFields;
		this.padding = this.DirectionalPixelFields;
		this.margin = this.DirectionalPixelFields;
		this.text = this.TextField;
		this.pixel = this.PixelField;
	}

	TextField = ({ setting, component }) => {
		return (
			<div className="email-component-text-field">
				{setting.label ? <label>{setting.label}</label> : null}
				<input type="text" defaultValue={component[setting.field]} onChange={(e) => this.dispatch({ type: "COMPONENT_FIELD_CHANGE", payload: { field: setting.field, value: e.target.value } })} />
			</div>
		);
	};

	FroalaSettingComponent = ({ setting, component, state }) => {
		let initialized = null;
		let blur = null;
		let self = this;
		if (setting.codeView) {
			initialized = function initializedEvent(froalaInstance) {
				froalaInstance.codeView.toggle();
			};
			blur = function blurEvent(froalaInstance) {
				self.dispatch({ type: "COMPONENT_FIELD_CHANGE", payload: { field: "text", value: froalaInstance.codeView.get() } });
			};
		}

		return <FroalaEditor component={component} events={{ initialized: initialized, blur: blur }} merge_fields={state.merge_fields} onModelChange={(newModel) => self.dispatch({ type: "COMPONENT_FIELD_CHANGE", payload: { field: "text", value: newModel } })} />;
	};

	ColorField = ({ setting, component }) => {
		const [showColorPicker, setShowColorPicker] = useState(false);

		const colorChangeHandler = (color) => {
			if (color.hex && color.hex !== component.styles[setting.field]) this.dispatch({ type: "COMPONENT_STYLE_CHANGE", payload: { field: setting.field, value: color.hex || component.styles[setting.field] } });
		};

		return (
			<>
				{showColorPicker ? <div className="close-email-color-picker" onClick={() => setShowColorPicker(false)}></div> : null}
				<div style={{ ...(showColorPicker && { zIndex: 5000, position: "relative" }) }} className="email-setting-color-field" onClick={() => setShowColorPicker(true)}>
					{setting.label ? <label>{setting.label}</label> : null}
					<div className="email-color-picker-input">
						<div className="email-color-icon">
							<ColorIcon />
						</div>
						<input readOnly type="text" value={component.styles[setting.field]} />
						<div className="email-color-picker-color-block" style={{ backgroundColor: component.styles[setting.field] }}></div>
					</div>
					{showColorPicker ? <BlockPicker color={component.styles[setting.field]} onChangeComplete={colorChangeHandler} /> : null}
				</div>
			</>
		);
	};

	PixelField = (props) => {
		const updateValue = (value) => this.dispatch({ type: "COMPONENT_STYLE_CHANGE", payload: { field: props.setting.field, value: value } });
		return (
			<div className="email-pixel-field">
				{props.setting.label ? <label>{props.setting.label}</label> : null}
				<div className="email-pixel-input-wrapper">
					<input type="number" min="0" value={props.component.styles[props.setting.field] || "0"} onChange={(e) => updateValue(e.target.value)} onBlur={(e) => (!e.target.value || e.target.value === "" ? updateValue(0) : null)} />
					<div className="email-pixel-unit" onClick={(e) => e.currentTarget.previousSibling.focus()}>
						px
					</div>
				</div>
			</div>
		);
	};

	BorderFields = (props) => {
		const { setting } = props;

		const borderStyleOptions = ["none", "solid", "double", "dotted", "dashed"];
		return (
			<div className="email-template-border-fields-wrapper">
				<div className="email-template-border-field">
					<label>Border Top</label>
					<div className="email-template-border-field-components">
						<div className="email-template-border-style">
							<Select
								options={_.map(borderStyleOptions, (borderStyle) => {
									return { label: borderStyle, value: borderStyle };
								})}
								value={{ label: props.component.styles.border_top, value: props.component.styles.border_top }}
								styles={customSelectStyles}
								placeholder="Border Style"
								onChange={(option) => this.dispatch({ type: "COMPONENT_STYLE_CHANGE", payload: { field: "border_top", value: option.value } })}
							/>
						</div>
						<this.PixelField {...props} setting={{ ...setting, field: "border_top_width", label: null }} />
						<this.ColorField {...props} setting={{ ...setting, field: "border_top_color", label: null }} />
					</div>
				</div>
				<div className="email-template-border-field">
					<label>Border Bottom</label>
					<div className="email-template-border-field-components">
						<div className="email-template-border-style">
							<Select
								options={_.map(borderStyleOptions, (borderStyle) => {
									return { label: borderStyle, value: borderStyle };
								})}
								value={{ label: props.component.styles.border_bottom, value: props.component.styles.border_bottom }}
								styles={customSelectStyles}
								placeholder="Border Style"
								onChange={(option) => this.dispatch({ type: "COMPONENT_STYLE_CHANGE", payload: { field: "border_bottom", value: option.value } })}
							/>
						</div>
						<this.PixelField {...props} setting={{ ...setting, field: "border_bottom_width", label: null }} />
						<this.ColorField {...props} setting={{ ...setting, field: "border_bottom_color", label: null }} />
					</div>
				</div>
			</div>
		);
	};

	DirectionalPixelFields = (props) => {
		let { setting } = props;
		return (
			<div className="pixel-field-group-wrapper">
				{setting.label ? <h3 className="component-settings-section-header">{setting.label}</h3> : null}
				<this.PixelField {...props} setting={{ ...setting, field: `${setting.type}_top`, label: `Top` }} />
				<this.PixelField {...props} setting={{ ...setting, field: `${setting.type}_bottom`, label: `Bottom` }} />
				<this.PixelField {...props} setting={{ ...setting, field: `${setting.type}_left`, label: `Left` }} />
				<this.PixelField {...props} setting={{ ...setting, field: `${setting.type}_right`, label: `Right` }} />
			</div>
		);
	};

	FontFamilySelect = (props) => {
		const Option = (select_props) => {
			let optionChildren = [
				...(select_props.data && [
					<div className="email-font-family-select" style={{ fontFamily: select_props.value }}>
						{select_props.children}
					</div>
				])
			];

			return <components.Option {...select_props} children={optionChildren} />;
		};
		const currentFont = props.component.styles[props.setting.field];
		return (
			<div className="email-component-font-family" style={{ fontFamily: currentFont }}>
				{props.setting.label ? <label>{props.setting.label}</label> : null}
				<Select
					options={_.map(fontFamilyList, (font) => {
						return { label: font, value: font };
					})}
					value={{ label: currentFont, value: currentFont }}
					styles={customSelectStyles}
					placeholder="Font Family"
					components={{ Option }}
					onChange={(option) => this.dispatch({ type: "COMPONENT_STYLE_CHANGE", payload: { field: props.setting.field, value: option.value } })}
				/>
			</div>
		);
	};

	StyleButtons = (props) => {
		let buttons = props.setting.buttons;
		let componentStyles = props.component.styles;

		return (
			<div className="email-style-button-wrapper">
				{props.setting.label ? <label>{props.setting.label}</label> : null}
				{_.map(buttons, (button) => {
					let isActive = componentStyles[button.field] === button.value;
					const buttonClickHandler = () => {
						let newStyle = isActive ? blockTypes[props.component.type].styles[button.field] : button.value;
						this.dispatch({ type: "COMPONENT_STYLE_CHANGE", payload: { field: button.field, value: newStyle } });
					};
					return (
						<button key={`${props.state.activeComponentIndex}-${button.field}-${button.value}`} type="button" className={`email-style-button${isActive ? " active" : ""}`} onClick={() => buttonClickHandler()}>
							{button.icon}
						</button>
					);
				})}
			</div>
		);
	};

	ImageComponent = (props) => {
		const uploadImage = (files, index, oldImageId) => {
			console.log(files);
			let role = props.user.user_roles[0];
			const formData = new FormData();
			formData.append("label", files[0].name);
			formData.append("file", files[0]);
			formData.append("org_node", role.org_node || "");
			formData.append("entity", role.entity || "");
			formData.append("file_name", files[0].name);
			formData.append("type", "image");
			formData.append("folder", "");
			formData.append("is_email", true);
			AsyncPost("/notification/email-template/image/", formData, { headers: { "Content-Type": "multipart/form-data" } })
				.then((response) => {
					if (oldImageId) AsyncDelete(`/notification/email-template/image/${oldImageId}/`).catch((error) => console.log(error));
					let componentImages = [...props.component.component_resources];
					componentImages[index] = { ...response.data, resource_file: response.data.file, resource: response.data.id };
					delete componentImages[index].id;
					this.dispatch({ type: "COMPONENT_FIELD_CHANGE", payload: { field: "component_resources", value: componentImages } });
				})
				.catch((error) => {
					errorToast("Error!", "There was an error uploading your image!");
				});
		};

		let imageHtmlList = [];
		for (let i = 0; i < props.component.imageLimit && i <= props.component.component_resources.length; i++) {
			let randomizedId = `email-template-image${shortid.generate()}`;
			let html = (
				<div className="email-template-image-setting" key={`${props.settingKey}-image${i}`}>
					<ImagePlaceholder />
					<div className="email-template-image-setting-buttons">
						<input type="file" id={randomizedId} className="d-none" onChange={(e) => uploadImage(e.target.files, i, null)} multiple={false} accept="image/*" />
						<label htmlFor={randomizedId} className="email-template-image-button">
							browse
						</label>
					</div>
				</div>
			);

			if (props.component.component_resources[i] && props.component.component_resources[i].resource_file) {
				html = (
					<div className="email-template-image-setting" key={`${props.settingKey}-image${i}`}>
						<img src={props.component.component_resources[i].resource_file} alt="skillsuite image" />
						<div className="email-template-image-setting-buttons">
							<input type="file" id={randomizedId} className="d-none" onChange={(e) => uploadImage(e.target.files, i, props.component.component_resources[i].resource)} multiple={false} accept="image/*" />
							<label htmlFor={randomizedId} className="email-template-image-button">
								browse
							</label>
						</div>
					</div>
				);
			}
			imageHtmlList.push(html);
		}
		return imageHtmlList;
	};
}

const ComponentSettingsMenu = ({ component, state, dispatch }) => {
	const [SettingComponents] = useState(new EmailSettingsComponents(state, dispatch));
	let user = GetUser();

	if (!component) return <></>;
	const componentSettingList = componentSettingsDefinition[component.type];
	let componentKey = `email-settings-${component.type}-${state.activeComponentIndex}`;

	const settingDispatch = (dispatchArgs) => {
		dispatch(dispatchArgs);
	};
	const renderSettingsComponents = (settingsList, section, sectionIndex) => {
		return _.map(settingsList, (setting, index) => {
			let key = `section${sectionIndex}-setting-${componentKey}-${index}`;
			return (
				<div key={key} className={`component-section-settings-wrapper component-section-settings-wrapper-${setting.type}`}>
					{React.createElement(SettingComponents[setting.type], {
						section_props: section.props || {},
						component,
						setting: setting,
						settingKey: key,
						state,
						user,
						dispatch: settingDispatch
					})}
				</div>
			);
		});
	};

	const renderSections = () => {
		return _.map(componentSettingList.sections, (section, index) => {
			return (
				<div key={`section-${componentKey}-${index}`} className="component-settings-section">
					{section.label ? <h3 className="component-settings-section-header">{section.label}</h3> : null}
					{renderSettingsComponents(section.settings, section, index)}
				</div>
			);
		});
	};

	return renderSections();
};

export default ComponentSettingsMenu;
