import React from "react";
import _ from "lodash";
import { ReactComponent as PencilSvg } from "assets/images/icons/pencil.svg";
import { ReactComponent as TrashSvg } from "assets/images/icons/trash.svg";
import { ReactComponent as CopySvg } from "assets/images/icons/copy.svg";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Components = ({ state, dispatch }) => {
	// const onDragEnd = (result) => dispatch({ type: "REORDER_COMPONENT", payload: result });
	const onDragEnd = (result) => {
		if (result.source && result.destination) {
			dispatch({ type: "REORDER_COMPONENT", payload: { index: result.source.index, destination: result.destination.index } });
		}
	};
	return (
		<div className="email-components-container">
			<div className="inner-components-container">
				{state.components.length > 0 ? (
					<div className="email-custom-content-wrapper" style={{ backgroundColor: state.background_color }}>
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId={"droppable"}>
								{(provided, snapshot) => (
									<div {...provided.droppableProps} ref={provided.innerRef}>
										{_.map(state.components, (component, index) => {
											return (
												<Draggable key={"draggable" + component.draggableId} draggableId={component.draggableId} index={index}>
													{(provided) => (
														<div className="email-template-component-view" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
															<div className="email-template-edit-bar">
																<div className="email-template-actions-wrapper">
																	<div className="email-actions-group">
																		<div className="email-template-action action-arrow action-up-arrow" onClick={() => dispatch({ type: "REORDER_COMPONENT", payload: { index: index, destination: index - 1 } })}></div>
																		<div className="email-template-action action-arrow action-down-arrow" onClick={() => dispatch({ type: "REORDER_COMPONENT", payload: { index: index, destination: index + 1 } })}></div>
																	</div>
																	<div className="email-actions-group">
																		<div className="email-template-action" onClick={() => dispatch({ type: "PATCH_FIELD", payload: { activeComponentIndex: index } })}>
																			<PencilSvg />
																		</div>
																		<div className="email-template-action" onClick={() => dispatch({ type: "COPY_COMPONENT", payload: index })}>
																			<CopySvg />
																		</div>
																		<div className="email-template-action" onClick={() => dispatch({ type: "DELETE_COMPONENT", payload: index })}>
																			<TrashSvg />
																		</div>
																	</div>
																</div>
															</div>
															<div className="render-email-component" dangerouslySetInnerHTML={{ __html: component.html }}></div>
														</div>
													)}
												</Draggable>
											);
										})}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>
				) : null}
				<div className="skillsuite-email-footer">
					<p>Powered by SkillSuite LLC.</p>
				</div>
			</div>
			<div id="hidden-components-html" className="d-none"></div>
		</div>
	);
};

export default Components;
