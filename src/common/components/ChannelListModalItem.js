import React, { PropTypes } from 'react';
import classnames from 'classnames';

const ChannelListModalItem = (props) => {
    const { channel: selectedChannel, onClick, channel } = props;
    return (
        <div className={ classnames( { selected: channel === selectedChannel } ) }
          style={{ cursor: 'hand', color: 'black' }}
          onClick={ () => onClick(channel) }>
            <div style={{ cursor: 'pointer' }}>
                <h1>{ channel.name }</h1>
            </div>
        </div>
    );
}

ChannelListModalItem.propTypes = {
    channel: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}

export default ChannelListModalItem;
