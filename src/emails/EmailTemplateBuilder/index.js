import React, { useReducer, useEffect } from "react";
import SideMenu from "containers/Emails/EmailTemplateResources/Sidemenu/Sidemenu";
import { emailTemplateReducer } from "containers/Emails/EmailTemplateResources/emailTemplateReducer";
import Components from "containers/Emails/EmailTemplateResources/Components";
import { useParams, Link } from "react-router-dom";
import "./EmailTemplateBuilder.scss";
import { AsyncPost, AsyncGet, AsyncPatch, AsyncGetAll, AsyncPostAll, AsyncPatchAll } from "Global/api";
import { getErrorMessage, errorToast, successToast } from "Global/functions";
import shortid from "shortid";
import { Loading } from "components/objects/WaitingComponent";
import { buildEmailHtml, formatDataToPost, formatDataFromBackend, formatComponentToPost } from "containers/Emails/EmailTemplateResources/emailTemplateDataFormat";
import {call} from "ramda";

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
	let urlParams = useParams();

	if (state.loading) return <Loading />;

	return (
		<div className="email-template-builder">
			<Link to="/admin/settings/email/all/" className="builder-bread-crumb">
				&lt; My Saved Emails
			</Link>
			<div className="email-template-builder-header">
				<h1>{state.id ? state.label : "New Email"}</h1>
				<div className="email-template-actions">
					<button type="button" className="btn btn-small btn-clear" onClick={sendTestEmail}>
						Send Test Email
					</button>
					<button type="button" className="btn btn-small mr-0" onClick={saveEmail}>
						Save
					</button>
				</div>
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
