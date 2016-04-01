import React from 'react';
import _ from 'lodash';

/**
 * createChildComponent
 *
 * Returns a React Component which does not render anything, but has some useful static functions
 *
 * @return {ReactComponent} which renders `null` but exposes static helper functions
 */
export function createChildComponent (definition={}) {
	return React.createClass({
		propTypes: _.get(definition, 'propTypes', null),
		displayName: _.get(definition, 'displayName', null),
		render: () => null,
		statics: {
			childComponentDefinition: definition,
			isRenderNull: true,

			/**
			 * findInChildren
			 *
			 * Returns all elements with this component type
			 *
			 * @param {array} elements - usually `this.props.children` but can be any list of elements which might have this type
			 * @return {array} elements with this component type
			 */
			findInChildren(elements) {
				let component = this;
				let ownElements = [];
				React.Children.forEach(elements, (element) => {
					if (element && element.type === component) {
						ownElements.push(element);
					}
				});
				return ownElements;
			},

			/**
			 * findInChildrenAsProps
			 *
			 * Returns the `props` object of each element with this component type
			 *
			 * @param {array} elements - usually `this.props.children` but can be any list of elements which might have this type
			 * @return {array} `props` objects of elements with this component type
			 */
			findInChildrenAsProps(elements) {
				let component = this;
				return _.map(component.findInChildren(elements), 'props');
			},

			/**
			 * findInProps
			 *
			 * Given a set of parent props this will return only the props for this
			 * component type
			 *
			 * @param {object} parentProps - usually `this.props` that may contain a prop for the current component type
			 * @return {array} - an array of normalized props
			 */
			findInProps(parentProps) {
				let component = this;
				return getChildComponentPropsArray(parentProps, component);
			},

			/**
			 * findInAllAsProps
			 *
			 * Given a parent props object, this will return a mashup of all the
			 * children and/or props for the current component type. This is
			 * particularly useful for providing a flexible component API. It allows
			 * consumers to either pass stuff through props or children.
			 *
			 * @param {object} parentProps - usually `this.props` that may contain a prop for the current component type
			 * @return {array} - an array of `props`
			 */
			findInAllAsProps(parentProps) {
				let component = this;

				const propsFromProps = component.findInProps(parentProps);
				const propsFromChildren = component.findInChildrenAsProps(parentProps.children);

				return propsFromProps.concat(propsFromChildren);
			}
		}
	});
}

export function rejectNullElements(children) {
	return _.reject(React.Children.toArray(children), (node) => (React.isValidElement(node) && node.type.isRenderNull));
}

export function filterElementsByType(children, elementTypes) {
	return _.filter(React.Children.toArray(children), (node) => (React.isValidElement(node) && _.includes(elementTypes, node.type)));
}

export function getChildComponentPropsArray(props, childComponentType) {
	const propName = _.get(childComponentType, 'childComponentDefinition.propName');
	if (propName) {
		const currentProps = _.chain(props)
			.get(propName) // grab the prop we care about, e.g. "Child"
			.thru(x => [x]) // wrap in an array
			.flatten()
			.filter(x => x) // remove falsey values
			.value();
		const childComponentPropsArray = _.map(currentProps, (childProp) => {
			if (_.isPlainObject(childProp)) {
				return childProp;
			} else {
				return {
					children: childProp
				};
			}
		});
		return childComponentPropsArray;
	}
	return [];
}

export function findAllChildComponents(props, childComponentTypes) {
	return _.reduce(childComponentTypes, (acc, childComponentType) => {
		const childComponentProps = getChildComponentPropsArray(props, childComponentType);
		return acc.concat(_.map(childComponentProps, (childComponentProp) => ({
			type: childComponentType,
			props: childComponentProp
		})));
	}, []).concat(_.map(filterElementsByType(props.children, childComponentTypes), (element) => ({
		type: element.type,
		props: element.props
	})));
}
