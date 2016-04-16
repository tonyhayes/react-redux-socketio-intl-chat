import React, { PropTypes } from 'react';
import classnames from 'classnames';

const ChannelListItem = (props) => {
    const { channel: selectedChannel, onClick, channel } = props;
    return (
        <div>
            <span className={ classnames({ selected: channel === selectedChannel }) }
              style={{ cursor: 'hand', color: 'white' }}
              onClick={ () => onClick(channel) }>
                <div className="sidebar-channel" style={{ textAlign: 'left', cursor: 'pointer', marginLeft: '2em' }}>
                    { channel.name }
                </div>
            </span>
        </div>
    );
}

ChannelListItem.propTypes = {
    channel: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}

export default ChannelListItem;
