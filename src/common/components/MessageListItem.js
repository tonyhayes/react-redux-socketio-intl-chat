import React, { PropTypes } from 'react';
import marked from 'react-marked';
import Highlight from 'react-highlight';
let done = false;
export default class MessageListItem extends React.Component {
    static propTypes = {
        message: PropTypes.object.isRequired
    };
    handleClick(user) {
        this.props.handleClickOnUser(user);
    }
    render() {
        const { message } = this.props;
        if(!done){
            done = true;
            marked.setOptions({
                renderer: new marked.Renderer(),
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: true,
                smartLists: true,
                smartypants: false,
            });            
        }

        return (
            <div>
                <span>
                    <button className="chat-panel-user-name" onClick={ this.handleClick.bind(this, message.user) }>{ message.user.username }</button>
                    <i className="chat-panel-time">{ message.time }</i>
                </span>
                <div className="chat-text">
                    <Highlight>
                        { marked(message.text) }
                    </Highlight>
                </div>
            </div>
        );
     }
}
