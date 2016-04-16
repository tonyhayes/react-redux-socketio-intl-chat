import React, { Component, PropTypes } from 'react';
import ChannelListItem from './ChannelListItem';
import ChannelListModalItem from './ChannelListModalItem';
import Modal from 'react-modal';
import * as actions from '../actions/actions';
import uuid from 'node-uuid';
import { intlShape, injectIntl, defineMessages, FormattedMessage } from 'react-intl'
const labels = defineMessages({
    channels: {
        id: 'channels.channels',
        description: 'channels title',
        defaultMessage: 'Channels' 
    },
    addChannel: {
        id: 'channels.addChannel',
        description: 'add new channel modal title',
        defaultMessage: 'Add New Channel' 
    },
    addChannelPlaceHolder: {
        id: 'channels.addChannelPlaceHolder',
        description: 'input hint text for adding a new channel',
        defaultMessage: 'Enter the channel name' 
    },
    createChannelButton: {
        id: 'channels.createChannelButton',
        description: 'create channel button text',
        defaultMessage: 'Create Channel' 
    },
    cancelButton: {
        id: 'channels.cancelButton',
        description: 'cancel button text',
        defaultMessage: 'Cancel' 
    },
    moreChannels: {
        id: 'channels.moreChannels',
        description: 'press for more channels',
        defaultMessage: 'More Channels' 
    },
    more: {
        id: 'channels.more',
        description: 'indicates more than channels exist',
        defaultMessage: 'more...' 
    },
    addChannelNameError: {
        id: 'channels.addChannelNameError',
        description: 'duplicate channel name error',
        defaultMessage: 'A channel with that name already exists' 
    },
})

class Channels extends Component {

    static propTypes = {
        channels: PropTypes.array.isRequired,
        onClick: PropTypes.func.isRequired,
        messages: PropTypes.array.isRequired,
        dispatch: PropTypes.func.isRequired,
        locale: PropTypes.object.isRequired
    };
    constructor(props, context) {
        super(props, context);
        this.state = {
            addChannelModal: false,
            channelName: '',
            moreChannelsModal: false
        };
    }
    handleChangeChannel(channel) {
        if(this.state.moreChannelsModal) {
            this.closeMoreChannelsModal();
        }
        this.props.onClick(channel);
    }
    openAddChannelModal() {
        event.preventDefault();
        this.setState({ addChannelModal: true });
    }
    closeAddChannelModal() {
        event.preventDefault();
        this.setState({ addChannelModal: false });
    }
    handleModalChange(event) {
        this.setState({ channelName: event.target.value });
    }
    handleModalSubmit(event) {
        const { channels, dispatch, socket } = this.props;
        event.preventDefault();
        if (this.state.channelName.length < 1) {
           return;
        }
        if (this.state.channelName.length > 0 && channels.filter(channel => {
            return channel.name === this.state.channelName.trim();
        }).length < 1) {
            const newChannel = {
                name: this.state.channelName.trim(),
                id: `${Date.now()}${ uuid.v4() }`,
                private: false
            };
            dispatch(actions.createChannel(newChannel));
            this.handleChangeChannel(newChannel);
            socket.emit('new channel', newChannel);
            this.setState({ channelName: '' });
            this.closeAddChannelModal();
        }
    }
    validateChannelName() {
        const { channels } = this.props;
        if (channels.filter(channel => {
            return channel.name === this.state.channelName.trim();
        }).length > 0) {
            return 'error';
        }
        return 'success';
    }
    openMoreChannelsModal() {
        event.preventDefault();
        this.setState({ moreChannelsModal: true });
    }
    closeMoreChannelsModal() {
        event.preventDefault();
        this.setState({ moreChannelsModal: false });
    }
    createChannelWithinModal() {
        this.closeMoreChannelsModal();
        this.openAddChannelModal();
    }
    render() {
        const { formatMessage } = this.props.intl;
        const { channels, messages } = this.props;
        const filteredChannels = channels.slice(0, 8);
        const moreChannelsBoolean = channels.length > 8;
        const restOfTheChannels = channels.slice(8);
        const customStyles = {
            content : {
                top                   : '25%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)',
                minWidth              : '300px'
           }
        };

        const newChannelModal = (
            <Modal
                closeTimeoutMS={ 150 }
                isOpen={ this.state.addChannelModal }
                onRequestClose={ ::this.closeAddChannelModal }
                style={ customStyles } >
                <span className="close-modal" onClick={ ::this.closeAddChannelModal }>&times;</span>
                <h1>
                    <FormattedMessage { ...labels.addChannel } />
                </h1>
                <form onSubmit={ ::this.handleModalSubmit } >
                    <input
                        type="text"
                        name="channelName"
                        autoFocus="true"
                        placeholder={ formatMessage(labels.addChannelPlaceHolder) }
                        value={ this.state.channelName }
                        onChange={ ::this.handleModalChange }
                    />
                        { this.validateChannelName() === 'error' &&
                            <div>                    
                                <FormattedMessage { ...labels.addChannelNameError } />
                            </div>
                        }

                </form>
                <footer className="modal-footer">
                    <button className="btn-blue" onClick={ ::this.closeAddChannelModal }>
                        <FormattedMessage { ...labels.cancelButton } />
                    </button>
                    <button className="btn-blue" disabled={ this.validateChannelName() === 'error' && 'true' } onClick={ ::this.handleModalSubmit } type="submit">
                        <FormattedMessage { ...labels.createChannelButton } />
                    </button>
                </footer>
            </Modal>
        );

        const moreChannelsModal = (
            <Modal
                closeTimeoutMS={ 150 }
                isOpen={ this.state.openMoreChannelsModal }
                onRequestClose={ ::this.closeMoreChannelsModal }
                style={ customStyles } >
                <span className="close-modal" onClick={ ::this.closeMoreChannelsModal }>&times;</span>
                <h1>                    
                    <FormattedMessage { ...labels.moreChanels } />
                </h1>
                 <div onClick={ ::this.createChannelWithinModal } className="link-button">
                    <FormattedMessage { ...labels.createChannelButton } />
                </div>
                <div className="more-channels-list">
                    { restOfTheChannels.map(channel =>
                        <ChannelListModalItem channel={ channel } key={ channel.id } onClick={ ::this.handleChangeChannel } />
                    ) }
                </div>
                <footer className="modal-footer">
                    <button onClick={ ::this.closeMoreChannelsModal }>                        
                        <FormattedMessage { ...labels.cancelButton } />
                    </button>
                </footer>
            </Modal>
        );
        return (
            <section>
                <div>
                    <span className="sidebar-title" >
                        <FormattedMessage { ...labels.channels } />
                        <button className="add-channel-button" onClick={ ::this.openAddChannelModal }>
                          +
                        </button>
                    </span>
                </div>
                { newChannelModal }
                <div>
                    <div className="sidebar-list">
                        { filteredChannels.map(channel =>
                        <ChannelListItem  className="sidebar-list-item" 
                          messageCount={ messages.filter(msg => {
                                return msg.channelID === channel.name;
                            }).length } 
                            channel={ channel } 
                            key={ channel.id } 
                            onClick={ ::this.handleChangeChannel } />
                        ) }
                    </div>
                    { moreChannelsBoolean && 
                        <div onClick={ ::this.openMoreChannelsModal } className="link-button"> + 
                            { channels.length - 8 } 
                            <FormattedMessage { ...labels.more } />
                        </div> }
                    { moreChannelsModal }
                </div>
            </section>
        );
    }
}
Channels.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(Channels);
