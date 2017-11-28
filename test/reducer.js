/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import { keyBy } from 'lodash';

/**
 * Internal dependencies
 */
import {
	// action-types
	TERM_REQUEST,
	TERM_REQUEST_SUCCESS,
	TERM_REQUEST_FAILURE,
	// reducers
	items,
	requests,
	slugs
} from '../src/state';

import terms from './fixtures/terms';

describe( 'Term reducer', () => {
	describe( 'items', () => {
		it( 'should have no change by default', () => {
			const newState = items( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should store the new terms in state', () => {
			const newState = items( undefined, { type: TERM_REQUEST_SUCCESS, term: terms[ 0 ] } );
			const termsById = keyBy( [ terms[ 0 ] ], 'id' );
			expect( newState ).to.eql( termsById );
		} );

		it( 'should add new posts onto the existing post array', () => {
			const originalState = deepFreeze( keyBy( [ terms[ 0 ] ], 'id' ) );
			const newState = items( originalState, { type: TERM_REQUEST_SUCCESS, term: terms[ 1 ] } );
			expect( newState ).to.eql( { ...originalState, 30: terms[ 1 ] } );
		} );
	} );

	describe( 'requests', () => {
		it( 'should have no change by default', () => {
			const newState = requests( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track the requesting state of a new term', () => {
			const action = {
				type: TERM_REQUEST,
				taxonomy: 'category',
				termSlug: 'photos',
			};
			const newState = requests( undefined, action );
			expect( newState ).to.eql( { category_photos: true } );
		} );

		it( 'should track the requesting state of successful term requests', () => {
			const originalState = deepFreeze( { category_photos: true } );
			const action = {
				type: TERM_REQUEST_SUCCESS,
				taxonomy: 'category',
				termSlug: 'photos',
			};
			const newState = requests( originalState, action );
			expect( newState ).to.eql( { category_photos: false } );
		} );

		it( 'should track the requesting state of failed post requests', () => {
			const originalState = deepFreeze( { category_photos: true } );
			const action = {
				type: TERM_REQUEST_FAILURE,
				taxonomy: 'category',
				termSlug: 'photos',
			};
			const newState = requests( originalState, action );
			expect( newState ).to.eql( { category_photos: false } );
		} );

		it( 'should track the requesting state of additional post requests', () => {
			const originalState = deepFreeze( { category_photos: false } );
			const action = {
				type: TERM_REQUEST,
				taxonomy: 'category',
				termSlug: 'videos',
			};
			const newState = requests( originalState, action );
			expect( newState ).to.eql( { ...originalState, category_videos: true } );
		} );
	} );

	describe( 'slugs', () => {
		it( 'should have no change by default', () => {
			const newState = slugs( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track the slug->id relationship of new categories', () => {
			const action = {
				type: TERM_REQUEST_SUCCESS,
				taxonomy: 'category',
				termSlug: 'photos',
				termId: 1,
			};
			const newState = slugs( undefined, action );
			expect( newState ).to.eql( {
				category: { photos: 1 }
			} );
		} );

		it( 'should track the slug->id relationship of new tags', () => {
			const action = {
				type: TERM_REQUEST_SUCCESS,
				taxonomy: 'post_tag',
				termSlug: 'fun',
				termId: 5,
			};
			const newState = slugs( undefined, action );
			expect( newState ).to.eql( {
				post_tag: { fun: 5 }
			} );
		} );

		it( 'should track the slug->id relationship of new tags, when categories are already tracked', () => {
			const originalState = deepFreeze( {
				category: { photos: 1 }
			} );
			const action = {
				type: TERM_REQUEST_SUCCESS,
				taxonomy: 'post_tag',
				termSlug: 'fun',
				termId: 5,
			};
			const newState = slugs( originalState, action );
			expect( newState ).to.eql( {
				category: { photos: 1 },
				post_tag: { fun: 5 }
			} );
		} );

		it( 'should track the slug->id relationship of new tags, when other tags are already tracked', () => {
			const originalState = deepFreeze( {
				post_tag: { love: 6 }
			} );
			const action = {
				type: TERM_REQUEST_SUCCESS,
				taxonomy: 'post_tag',
				termSlug: 'fun',
				termId: 5,
			};
			const newState = slugs( originalState, action );
			expect( newState ).to.eql( {
				post_tag: {
					love: 6,
					fun: 5
				}
			} );
		} );
	} );
} );
