import React, { Component, PropTypes } from 'react';
import MessageComposer from './MessageComposer';
import MessageListItem from './MessageListItem';
import Channels from './Channels';
import * as actions from '../actions/actions';
import * as authActions from '../actions/authActions';
import TypingListItem from './TypingListItem';
import Modal from 'react-modal';
import { defineMessages, FormattedMessage } from 'react-intl'
const labels = defineMessages({
    directMessage: {
        id: 'chat.directMessage',
        description: 'Direct Message modal button description',
        defaultMessage: 'Direct Message' 
    },
    isTyping: {
        id: 'chat.isTyping',
        description: 'isTyping literal',
        defaultMessage: 'is typing' 
    },
    and: {
        id: 'chat.and',
        description: 'and literal',
        defaultMessage: 'and' 
    },
    areTyping: {
        id: 'chat.areTyping',
        description: 'areTyping literal',
        defaultMessage: 'are typing' 
    },
    SeveralPeopleAreTyping: {
        id: 'chat.SeveralPeopleAreTyping',
        description: 'SeveralPeopleAreTyping literal',
        defaultMessage: 'Several people are typing' 
    },
})

export default class Chat extends Component {

    static propTypes = {
        messages: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        locale: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        channels: PropTypes.array.isRequired,
        activeChannel: PropTypes.string.isRequired,
        typers: PropTypes.array.isRequired,
        socket: PropTypes.object.isRequired
    };
    constructor(props, context) {
        super(props, context);
        //es6 inialize state
        this.state = {
            privateChannelModal: false,
            targetedUser: ''
        }
    }
    componentDidMount() {
        /*
        when the event fires, the react disptach (managed by redux)
        updates the UI component (message, for example) which forces a render cycle
        */
        const { socket, user, dispatch } = this.props;
        socket.emit('chat mounted', user);
        socket.on('new broadcast message', msg =>
            dispatch(actions.receiveRawMessage(msg))
        );
        socket.on('typing broadcast message', user =>
            dispatch(actions.typing(user))
        );
        socket.on('stop typing broadcast message', user =>
            dispatch(actions.stopTyping(user))
        );
        socket.on('new channel', channel =>
            dispatch(actions.receiveRawChannel(channel))
        );
        socket.on('receive socket', socketID =>
            dispatch(authActions.receiveSocket(socketID))
        );
        socket.on('receive private channel', channel =>
            dispatch(actions.receiveRawChannel(channel))
        );
    }
    componentDidUpdate() {
        /*
         refs ... https://facebook.github.io/react/docs/more-about-refs.html
         find the DOM markup rendered by a component (for instance, to position it absolutely)
        */
        const messageList = this.refs.messageList;
        messageList.scrollTop = messageList.scrollHeight;
    }
    handleSave(newMessage) {
        /*
        the new message is sent via rest to the server and is recieved from the socket for display
        */
        const { dispatch } = this.props;
        if (newMessage.text.length !== 0) {
            dispatch(actions.createMessage(newMessage));
        }
    }
    changeActiveChannel(channel) {
        const { socket, activeChannel, dispatch } = this.props;
        socket.emit('leave channel', activeChannel);
        socket.emit('join channel', channel);
        dispatch(actions.changeChannel(channel));
        dispatch(actions.fetchMessages(channel.name));
    }
    handleClickOnUser(user) {
        this.setState( { privateChannelModal: true, targetedUser: user } );
    }
    closePrivateChannelModal() {
        event.preventDefault();
        this.setState( { privateChannelModal: false } );
    }
    handleSendDirectMessage() {
        const { dispatch, socket, channels, user } = this.props;
        const doesPrivateChannelExist = channels.filter(item => {
            return item.name === ( `${ this.state.targetedUser.username } + ${ user.username }` || `${ user.username } + ${ this.state.targetedUser.username }` ) 
        })
        if (user.username !== this.state.targetedUser.username && doesPrivateChannelExist.length === 0) {
            const newChannel = {
                name: `${ this.state.targetedUser.username } + ${ user.username }`,
                id: Date.now(),
                private: true,
                between: [ this.state.targetedUser.username, user.username ]
            };
            dispatch(actions.createChannel(newChannel));
            this.changeActiveChannel(newChannel);
            socket.emit('new private channel', this.state.targetedUser.socketID, newChannel);
        }
        if(doesPrivateChannelExist.length > 0) {
            this.changeActiveChannel(doesPrivateChannelExist[0]);
        }
        this.setState( { privateChannelModal: false, targetedUser: '' } );
    }
    render() {
        const { messages, socket, channels, activeChannel, typers, dispatch, user, screenWidth, locale } = this.props;
        const filteredMessages = messages.filter(message => message.channelID === activeChannel);
        const username = this.props.user.username;
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
        const chatTitleSideBar = (
            <div className="sidebar-user-name">
                { username }
            </div>
        );
        const PrivateMessageModal = (
            <Modal
                closeTimeoutMS={ 150 }
                isOpen={ this.state.privateChannelModal }
                onRequestClose={ ::this.closePrivateChannelModal }
                style={ customStyles } >
                <span className="close-modal" onClick={ ::this.closePrivateChannelModal }>&times;</span>
                <h1>{ this.state.targetedUser.username }</h1>
                <button className="btn-blue" onClick={ ::this.handleSendDirectMessage }>
                    <FormattedMessage { ...labels.directMessage } />
                </button>
                <footer className="modal-footer">
                </footer>
            </Modal>
        );
        const bigNav = (
            <div className="nav">
                { chatTitleSideBar }
                <section className="channel-sidebar" style={{ order: '2' }}>
                    <Channels socket={ socket } onClick={ ::this.changeActiveChannel } channels={ channels } messages={ messages } dispatch={ dispatch } locale={ locale } />
                </section>
            </div>
        );

        return (
            <div className="chat-container">
                { bigNav }
                <div className="main">
                    <header className="header">
                        <div>
                            { activeChannel }
                        </div>
                    </header>
                    { PrivateMessageModal }
                     <div className="chat-panel" style={{ order: '1' }} ref="messageList">
                        { filteredMessages.map(message =>
                            <MessageListItem handleClickOnUser={ ::this.handleClickOnUser } message={ message } key={ message.id } />
                        ) }
                    </div>
                    <MessageComposer socket={ socket } activeChannel={ activeChannel } user={ user } onSave={ ::this.handleSave } />
                    <footer className="chat-footer">
                        { typers.length === 1 &&
                        <div>
                            <span>
                                <TypingListItem username={ typers[0] } key={ 1 }/>
                                <span>
                                    <FormattedMessage { ...labels.isTyping } />
                                </span>
                            </span>
                        </div> }
                        { typers.length === 2 &&
                        <div>
                            <span>
                                <TypingListItem username={ typers[0] } key={ 1 }/>
                                <span>
                                    <FormattedMessage { ...labels.and } />
                                </span>
                                <TypingListItem username={ typers[1] } key={ 2 }/>
                                <span>
                                    <FormattedMessage { ...labels.areTyping } />
                                </span>
                            </span>
                        </div> }
                        { typers.length > 2 &&
                        <div>
                            <span>
                                <FormattedMessage { ...labels.SeveralPeopleAreTyping } />
                            </span>
                        </div> }
                    </footer>
                </div>
            </div>
        );
    }
}
