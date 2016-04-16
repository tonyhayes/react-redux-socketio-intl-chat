import messages from './messages';
import channels from './channels';
import activeChannel from './activeChannel';
import locales from './locales';
import auth from './auth';
import typers from './typers';
import userValidation from './userValidation';
import environment from './environment';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  	messages,
  	channels,
  	activeChannel,
  	locales,
  	auth,
  	typers,
  	userValidation,
  	environment,
  	formReducer
});

export default rootReducer;
