/**
 * External dependencies
 */
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debugFactory from 'debug';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { isRequestingTerm } from './selectors';
import { requestTerm } from './state';

const debug = debugFactory( 'query:term' );

class QueryTerm extends Component {
	componentWillMount() {
		this.request( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.termSlug === nextProps.termSlug &&
				this.props.taxonomy === nextProps.taxonomy ) {
			return;
		}

		this.request( nextProps );
	}

	request( props ) {
		if ( ! props.requestingTerm ) {
			debug( `Request single term ${ props.taxonomy } ${ props.termSlug }` );
			props.requestTerm( props.taxonomy, props.termSlug );
		}
	}

	render() {
		return null;
	}
}

QueryTerm.propTypes = {
	termSlug: PropTypes.string.isRequired,
	taxonomy: PropTypes.string.isRequired,
	requestingTerm: PropTypes.bool,
	requestTerm: PropTypes.func,
};

QueryTerm.defaultProps = {
	requestTerm: () => {},
};

export default connect(
	( state, ownProps ) => {
		const { termSlug, taxonomy } = ownProps;
		return {
			requestingTerm: isRequestingTerm( state, taxonomy, termSlug ),
		};
	},
	( dispatch ) => {
		return bindActionCreators( {
			requestTerm,
		}, dispatch );
	}
)( QueryTerm );
