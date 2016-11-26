/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import keyBy from 'lodash/keyBy';

/**
 * Internal dependencies
 */
import * as selectors from '../src/selectors';
import terms from './fixtures/terms';

const termsById = keyBy( terms, 'id' );

const state = deepFreeze( {
	terms: {
		items: termsById,
		requests: {
			'category_corner-case': false,
			'post_tag_post-formats': false,
			'category_photos': true,
		},
		slugs: {
			category: {
				'corner-case': 15,
			},
			post_tag: {
				'post-formats': 30,
			},
		}
	}
} );

describe( 'Term selectors', function() {
	it( 'should contain getTerm method', function() {
		expect( selectors.getTerm ).to.be.a( 'function' );
	} );

	it( 'should contain isRequestingTerm method', function() {
		expect( selectors.isRequestingTerm ).to.be.a( 'function' );
	} );

	it( 'should contain getTermIdFromSlug method', function() {
		expect( selectors.getTermIdFromSlug ).to.be.a( 'function' );
	} );

	describe( 'isRequestingTerm', function() {
		it( 'Should get `false` if the term has not been requested yet', function() {
			expect( selectors.isRequestingTerm( state, 'post_tag', 'videos' ) ).to.be.false;
		} );

		it( 'Should get `false` if this term has already been fetched', function() {
			expect( selectors.isRequestingTerm( state, 'category', 'corner-case' ) ).to.be.false;
		} );

		it( 'Should get `true` if this term is being fetched', function() {
			expect( selectors.isRequestingTerm( state, 'category', 'photos' ) ).to.be.true;
		} );
	} );

	describe( 'getTermIdFromSlug', function() {
		it( 'Should get `false` if the term has not been requested yet', function() {
			expect( selectors.getTermIdFromSlug( state, 'post_tag', 'videos' ) ).to.be.false;
		} );

		it( 'Should get the term ID if this term is in our state', function() {
			expect( selectors.getTermIdFromSlug( state, 'category', 'corner-case' ) ).to.eql( 15 );
		} );
	} );

	describe( 'getTerm', function() {
		it( 'Should get `undefined` if the post has not been requested yet', function() {
			expect( selectors.getTerm( state, 10 ) ).to.be.undefined;
		} );

		it( 'Should get the post object if this post is in our state', function() {
			expect( selectors.getTerm( state, 30 ) ).to.eql( terms[ 1 ] );
		} );
	} );
} );
