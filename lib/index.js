'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _selectors = require('./selectors');

var _state = require('./state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * External dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Internal dependencies
 */


var debug = (0, _debug2.default)('query:term');

var QueryTerm = function (_Component) {
	_inherits(QueryTerm, _Component);

	function QueryTerm() {
		_classCallCheck(this, QueryTerm);

		return _possibleConstructorReturn(this, (QueryTerm.__proto__ || Object.getPrototypeOf(QueryTerm)).apply(this, arguments));
	}

	_createClass(QueryTerm, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.request(this.props);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (this.props.termSlug === nextProps.termSlug && this.props.taxonomy === nextProps.taxonomy) {
				return;
			}

			this.request(nextProps);
		}
	}, {
		key: 'request',
		value: function request(props) {
			if (!props.requestingTerm) {
				debug('Request single term ' + props.taxonomy + ' ' + props.termSlug);
				props.requestTerm(props.taxonomy, props.termSlug);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return QueryTerm;
}(_react.Component);

QueryTerm.propTypes = {
	termSlug: _react.PropTypes.string.isRequired,
	taxonomy: _react.PropTypes.string.isRequired,
	requestingTerm: _react.PropTypes.bool,
	requestTerm: _react.PropTypes.func
};

QueryTerm.defaultProps = {
	requestTerm: function requestTerm() {}
};

exports.default = (0, _reactRedux.connect)(function (state, ownProps) {
	var termSlug = ownProps.termSlug;
	var taxonomy = ownProps.taxonomy;

	return {
		requestingTerm: (0, _selectors.isRequestingTerm)(state, taxonomy, termSlug)
	};
}, function (dispatch) {
	return (0, _redux.bindActionCreators)({
		requestTerm: _state.requestTerm
	}, dispatch);
})(QueryTerm);
module.exports = exports['default'];