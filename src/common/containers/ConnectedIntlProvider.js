import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import * as i18n from '../i18n';
const intlData = {
	locale: 'en',
	messages: i18n['en']
};

// This function will map the current redux state to the props for the component that it is "connected" to.
// When the state of the redux store changes, this function will be called, if the props that come out of
// this function are different, then the component that is wrapped is re-rendered.
function mapStateToProps(state) {
	if(state.locales){
	  const { locale } = state.locales;
	  return { locale: locale, messages: i18n[locale] };		
	}
	//fallback to english
	  return intlData;		
}

export default connect(mapStateToProps)(IntlProvider);
