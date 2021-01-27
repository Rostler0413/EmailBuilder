import React, { useReducer } from "react";
import SideMenu from "containers/Emails/EmailTemplateResources/Sidemenu/Sidemenu";
import { emailTemplateReducer } from "containers/Emails/EmailTemplateResources/emailTemplateReducer";
import Components from "containers/Emails/EmailTemplateResources/Components";
import "./EmailTemplateBuilder.scss";
import shortid from "shortid";
import { Loading } from "components/objects/WaitingComponent";

const initialState = {
	components: [],
	label: "",
	description: "",
	body: "",
	entity: null,
	org_node: null,
	preview_text: "",
	subject: "",
	email_template_categories: [],
	activeComponentIndex: null,
	password_reset: false,
	merge_fields: [],
	unique_key: shortid.generate(),
	loading: false,
	id: null,
	org_node_label: null,
	entity_label: null,
	preview: false,
	background_color: "#fff"
};

const EmailTemplateBuilder = () => {
	const [state, dispatch] = useReducer(emailTemplateReducer, initialState);

	if (state.loading) return <Loading />;

	return (
		<div className="email-template-builder">
			<div className="email-template-builder-header">
				<h1>{state.id ? state.label : "New Email"}</h1>
			</div>
			<div className="email-template-builder-wrapper">
				<SideMenu state={state} dispatch={dispatch} />
				<div className="email-component-wrapper" id="email-template-components">
					<Components state={state} dispatch={dispatch} />
				</div>
			</div>
			<div className={`email-template-preview${state.preview ? " active" : ""}`}>
				<div className="close-template-preview" onClick={() => dispatch({ type: "PATCH_FIELD", payload: { preview: false } })}>
					{"< Back to email"}
				</div>
				<div className="email-preview-content" dangerouslySetInnerHTML={{ __html: state.body }}></div>
			</div>
		</div>
	);
};

export default EmailTemplateBuilder;
