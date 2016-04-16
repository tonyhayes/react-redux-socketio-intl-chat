import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl'
const labels = defineMessages({
    "userProfile": {
        id: 'userProfile.userProfile',
        description: "User's Profile Title",
        defaultMessage: "User's Profile" 
    },
})

export class UserProfile extends React.Component {
  	render() {
    	return (
      		<div>
        		<FormattedMessage { ...labels.userProfile } />
      		</div>
    	);
  	}
}
