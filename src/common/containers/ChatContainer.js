import React, { Component, PropTypes } from 'react';
import * as actions from '../actions/actions';
import { receiveAuth } from '../actions/authActions';
import Chat from '../components/Chat';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';

const socket = io('', { path: '/api/chat' });
const initialChannel = 'Lobby'; // NOTE: I hard coded this value for my example. (its in 3 places)

class ChatContainer extends Component {
    /*
    http://busypeoples.github.io/post/react-component-lifecycle/
    */
    componentWillMount() {
        const { dispatch, user } = this.props;
        dispatch(actions.fetchMessages(initialChannel));
        dispatch(actions.fetchChannels(user.username));
    }
    render() {
        //wait for the app to stablize before rendering;
        if(!this.props.channels.length){
            return <div>Loading...</div>;
        }
        return (
            <Chat { ...this.props } socket={ socket } />
        );
    }
}
/*
https://facebook.github.io/react/docs/reusable-components.html
    React.PropTypes exports a range of validators that can be used to make sure the data you receive is valid. 
    When an invalid value is provided for a prop, a warning will be shown in the JavaScript console. 
    Note that for performance reasons propTypes is only checked in development mode.
*/
ChatContainer.propTypes = {
    messages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    channels: PropTypes.array.isRequired,
    activeChannel: PropTypes.string.isRequired,
    typers: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        messages: state.messages.data,
        channels: state.channels.data,
        locale: state.locales,
        activeChannel: state.activeChannel.name,
        user: state.auth.user,
        typers: state.typers,
        screenWidth: state.environment.screenWidth
    }
}
/*
redux connect -> mapStateToProps() and mapDispatchToProps() functions
https://egghead.io/lessons/javascript-redux-generating-containers-with-connect-from-react-redux-visibletodolist
*/
export default connect(mapStateToProps)(ChatContainer)
