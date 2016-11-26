'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TERM_REQUEST_FAILURE = exports.TERM_REQUEST_SUCCESS = exports.TERM_REQUEST = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.items = items;
exports.requests = requests;
exports.slugs = slugs;
exports.requestTerm = requestTerm;

var _redux = require('redux');

var _keyBy = require('lodash/keyBy');

var _keyBy2 = _interopRequireDefault(_keyBy);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /*global SiteSettings */
/**
 * External dependencies
 */


var site = require('wpapi')({ endpoint: SiteSettings.endpoint, nonce: SiteSettings.nonce });

/**
 * Term actions
 */
var TERM_REQUEST = exports.TERM_REQUEST = 'wordpress-redux/terms/REQUEST';
var TERM_REQUEST_SUCCESS = exports.TERM_REQUEST_SUCCESS = 'wordpress-redux/terms/REQUEST_SUCCESS';
var TERM_REQUEST_FAILURE = exports.TERM_REQUEST_FAILURE = 'wordpress-redux/terms/REQUEST_FAILURE';

/**
 * Tracks all known post objects, indexed by post global ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function items() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case TERM_REQUEST_SUCCESS:
			var terms = (0, _keyBy2.default)([action.term], 'id');
			return Object.assign({}, state, terms);
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
function requests() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case TERM_REQUEST:
		case TERM_REQUEST_SUCCESS:
		case TERM_REQUEST_FAILURE:
			var uniqId = action.taxonomy + '_' + action.termSlug;
			return Object.assign({}, state, _defineProperty({}, uniqId, TERM_REQUEST === action.type));
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
function slugs() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case TERM_REQUEST_SUCCESS:
			if (!state[action.taxonomy]) {
				return Object.assign({}, state, _defineProperty({}, action.taxonomy, _defineProperty({}, action.termSlug, action.termId)));
			}
			return Object.assign({}, state, _defineProperty({}, action.taxonomy, _extends({}, state[action.taxonomy], _defineProperty({}, action.termSlug, action.termId))));
		default:
			return state;
	}
}

exports.default = (0, _redux.combineReducers)({
	items: items,
	requests: requests,
	slugs: slugs
});

/**
 * Triggers a network request to fetch a specific post from a site.
 *
 * @param  {string}   taxonomy  Term taxonomy
 * @param  {string}   termSlug  Term slug
 * @return {Function}           Action thunk
 */

function requestTerm(taxonomy, termSlug) {
	return function (dispatch) {
		dispatch({
			type: TERM_REQUEST,
			taxonomy: taxonomy,
			termSlug: termSlug
		});

		var taxonomyFunc = void 0;
		if ('category' === taxonomy) {
			taxonomyFunc = 'categories';
		} else if ('post_tag' === taxonomy || 'tag' === taxonomy) {
			taxonomyFunc = 'tags';
		} else {
			taxonomyFunc = 'taxonomies';
		}

		return site[taxonomyFunc]().search(termSlug).then(function (data) {
			var term = (0, _find2.default)(data, {
				slug: termSlug
			});
			dispatch({
				type: TERM_REQUEST_SUCCESS,
				term: term,
				taxonomy: taxonomy,
				termSlug: termSlug,
				termId: term.id
			});
			return null;
		}).catch(function (error) {
			dispatch({
				type: TERM_REQUEST_FAILURE,
				taxonomy: taxonomy,
				termSlug: termSlug,
				error: error
			});
		});
	};
}