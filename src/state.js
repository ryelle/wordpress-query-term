/*global SiteSettings */
/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { keyBy } from 'lodash';
import API from 'wordpress-rest-api-oauth-1';
const api = new API( {
	url: SiteSettings.endpoint,
} );

/**
 * Term actions
 */
export const TERM_REQUEST = 'wordpress-redux/terms/REQUEST';
export const TERM_REQUEST_SUCCESS = 'wordpress-redux/terms/REQUEST_SUCCESS';
export const TERM_REQUEST_FAILURE = 'wordpress-redux/terms/REQUEST_FAILURE';

/**
 * Tracks all known post objects, indexed by post global ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function items( state = {}, action ) {
	switch ( action.type ) {
		case TERM_REQUEST_SUCCESS:
			const terms = keyBy( [ action.term ], 'id' );
			return Object.assign( {}, state, terms );
		default:
			return state;
	}
}

/**
 * Returns the updated post requests state after an action has been
 * dispatched. The state reflects a mapping of post ID to a
 * boolean reflecting whether a request for the post is in progress.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function requests( state = {}, action ) {
	switch ( action.type ) {
		case TERM_REQUEST:
		case TERM_REQUEST_SUCCESS:
		case TERM_REQUEST_FAILURE:
			const uniqId = `${ action.taxonomy }_${ action.termSlug }`;
			return Object.assign( {}, state, { [ uniqId ]: TERM_REQUEST === action.type } );
		default:
			return state;
	}
}

/**
 * Tracks the slug->ID mapping for posts & pages
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function slugs( state = {}, action ) {
	switch ( action.type ) {
		case TERM_REQUEST_SUCCESS:
			if ( ! state[ action.taxonomy ] ) {
				return Object.assign( {}, state, {
					[ action.taxonomy ]: {
						[ action.termSlug ]: action.termId,
					},
				} );
			}
			return Object.assign( {}, state, {
				[ action.taxonomy ]: {
					...state[ action.taxonomy ],
					[ action.termSlug ]: action.termId,
				},
			} );
		default:
			return state;
	}
}

export default combineReducers( {
	items,
	requests,
	slugs,
} );

/**
 * Triggers a network request to fetch a specific post from a site.
 *
 * @param  {string}   taxonomy  Term taxonomy
 * @param  {string}   termSlug  Term slug
 * @return {Function}           Action thunk
 */
export function requestTerm( taxonomy, termSlug ) {
	return ( dispatch ) => {
		dispatch( {
			type: TERM_REQUEST,
			taxonomy,
			termSlug,
		} );

		// Default to the passed `taxonomy`, but categories and tags have inconsistent names
		let taxonomyEndpoint = taxonomy;
		if ( 'category' === taxonomy ) {
			taxonomyEndpoint = 'categories';
		} else if ( ( 'post_tag' === taxonomy ) || ( 'tag' === taxonomy ) ) {
			taxonomyEndpoint = 'tags';
		}

		api.get( `/wp/v2/${ taxonomyEndpoint }/`, { slug: termSlug } ).then( data => {
			const term = data[ 0 ];
			dispatch( {
				type: TERM_REQUEST_SUCCESS,
				term,
				taxonomy,
				termSlug,
				termId: term.id,
			} );
			return null;
		} ).catch( ( error ) => {
			dispatch( {
				type: TERM_REQUEST_FAILURE,
				taxonomy,
				termSlug,
				error,
			} );
		} );
	};
}
