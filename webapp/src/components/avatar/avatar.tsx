import React from 'react';

import './avatar.scss';

type Props = {
    url: string;
    username?: string;
    size?: string;
};

const Avatar: React.FunctionComponent<Props> = ({url, username, size = 'md'}: Props) => (
    <img
        className={`Avatar Avatar-${size}`}
        alt={`${username || 'user'} profile image`}
        src={url}
    />
);

Avatar.defaultProps = {
    size: 'md',
};

export default Avatar;
