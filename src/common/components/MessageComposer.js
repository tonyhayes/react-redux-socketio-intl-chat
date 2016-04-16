import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import uuid from 'node-uuid';
import { MarkedInput } from 'react-markdown-area';
import { intlShape, injectIntl, defineMessages, FormattedMessage } from 'react-intl'
const labels = defineMessages({
    messageComposerPlaceholder: {
        id: 'MessageComposer.placeholder',
        description: 'MessageComposer placeholder text',
        defaultMessage: 'Type to chat!' 
    },
})

class MessageComposer extends Component {

    static propTypes = {
        activeChannel: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        socket: PropTypes.object.isRequired
    };
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: '',
            typing: false
        };
    }
    handleSubmit(event) {
        const { user, socket, activeChannel } = this.props;
        const text = event.target.value.trim();
        if(!text){
            return;
        }
        if (event.which === 13) {
            //enter+shift = new line
             if (event.shiftKey) {
                return;
             }

            event.preventDefault();
            var newMessage = {
                id: `${ Date.now() }${ uuid.v4() }`,
                channelID: this.props.activeChannel,
                text: text,
                user: user,
                time: moment.utc().format('lll')
            };
        socket.emit('new message', newMessage);
        socket.emit('stop typing', { user: user.username, channel: activeChannel });
        this.props.onSave(newMessage);
        this.setState({ text: '', typing: false });
        }
    }
    handleChange(event) {
        const { socket, user, activeChannel } = this.props;
        const text = event.target.value;
        this.setState({ text: text });
        if (event.target.value.length > 0 && !this.state.typing) {
            socket.emit('typing', { user: user.username, channel: activeChannel });
            this.setState({ typing: true });
        }
        if (text.length === 0 && this.state.typing) {
            socket.emit('stop typing', { user: user.username, channel: activeChannel });
            this.setState({ typing: false });
        }
    }
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className="message-composer-container" style={{ order: '2' }}>
                <textarea
                    name="message"
                    autoFocus="true"
                    placeholder={ formatMessage(labels.messageComposerPlaceholder) }
                    value={ this.state.text }
                    onChange={ ::this.handleChange }
                    onKeyDown={ ::this.handleSubmit }
                />
            </div>
        );
    }
}

MessageComposer.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(MessageComposer);
