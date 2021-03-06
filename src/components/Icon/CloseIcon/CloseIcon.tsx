import _ from 'lodash';
import React from 'react';
import Icon, { IIconProps, propTypes as iconPropTypes } from '../Icon';
import { lucidClassNames } from '../../../util/style-helpers';
import { omitProps } from '../../../util/component-types';

const cx = lucidClassNames.bind('&-CloseIcon');

export interface ICloseIconProps extends IIconProps {}

export const CloseIcon = ({
	className,
	isDisabled,
	isClickable,
	...passThroughs
}: ICloseIconProps) => {
	return (
		<Icon
			{...omitProps(
				passThroughs,
				undefined,
				_.keys(CloseIcon.propTypes),
				false
			)}
			{..._.pick(passThroughs, _.keys(iconPropTypes))}
			isClickable={isClickable}
			isDisabled={isDisabled}
			className={cx(
				'&',
				isDisabled && '&-is-disabled',
				isClickable && '&-is-clickable',
				className
			)}
		>
			<path d='M.5.5l15 15m0-15l-15 15' />
		</Icon>
	);
};

CloseIcon.displayName = 'CloseIcon';
CloseIcon.peek = {
	description: `
		A larger close X icon
	`,
	categories: ['visual design', 'icons'],
	extend: 'Icon',
	madeFrom: ['Icon'],
};
CloseIcon.propTypes = iconPropTypes;
CloseIcon.defaultProps = Icon.defaultProps;

export default CloseIcon;
