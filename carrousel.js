/**
 * jQuery Carrousel - tiny slider plugin
 *
 * @package Carrousel
 * @version 0.3
 * @author Mikita Stankiewicz <designovermatter@gmail.com>
 */

;( function( $, window, document, undefined ) {
	//'use strict';
	
	/**
	 * Constructor
	 *
	 * @param Object selector
	 * @param Object options
	 */
	var Carrousel = function( selector, options ) {
		var defaults = {
			delay: 5000,
			duration: 500,
		};
		
		this.options = $.extend( {}, defaults, options );
		this.setup( selector );
		this.spin();
	};
	
	/**
	 * Prototype
	 */
	Carrousel.prototype = {
		object: null,
		options: {},
		
		/**
		 * Setup
		 *
		 * @param Object selector
		 */
		setup: function( selector ) {
			this.object = selector;
			var carrousel = this;
			
			this.object
				.addClass( 'carrousel' )
				.css( {
					//'-webkit-backface-visibility': 'hidden',
					//'-webkit-perspective': '1000',
					'position': 'absolute',
					width: this.object.children().width() * ( this.object.children().length + 1 ) + 'px',
				} )
				.children().addClass( 'carrousel-child' ).end()
				.append( 
					this.object
						.children().first().clone()
						.removeClass( 'carrousel-child' )
						.addClass( 'carrousel-child-clone' ) 
				)
				.wrap(
					$( '<div class="carrousel-platform" />' )
						.css( {
							width: this.object.children().width() + 'px',
							height: this.object.children().height() + 'px',
							position: 'relative',
						} )
				)
				.closest( '.carrousel-platform' ).wrap(
					$( '<div id="carrousel-' + new Date().getTime() + '" class="carrousel-wrapper" />' )
						
				)
				.after(
					$( '<ul class="carrousel-nav" />' )
						.append( repeat( '<li class="carrousel-nav-item"><a href=""></a></li>', this.object.children().length ) )
				)
				.on( prefixed( 'transitionend' ), function() {
					carrousel.object.css( prefixed( 'transition' ), 'none' );
					
					if( $( '.carrousel-current', carrousel.object ).is( '.carrousel-child-clone' ) )
						carrousel.object.css( prefixed( 'transform' ), 'translate3d( 0, 0, 0 )' )
							.children().removeClass( 'carrousel-current' ).first().addClass( 'carrousel-current' );
					
					carrousel.object.closest( '.carrousel-wrapper' )
						.find( '.carrousel-nav li' ).removeClass( 'carrousel-current' )
						.eq( $( '.carrousel-current', carrousel.object ).index() ).addClass( 'carrousel-current' );
				} )
				.closest( '.carrousel-wrapper' ).find( '.carrousel-nav a' ).on( 'click', function( e ) {
					e.preventDefault();
					
					carrousel.spinTo( $( this ).closest( 'li' ).index() );
				} );
		},
		
		/**
		 * Rotate
		 */
		spin: function() {
			var carrousel = this,
				current = $( '.carrousel-current', this.object ).index();
			
			this.spinTo( current + 1 );
		},
		
		/**
		 * Spin to a child
		 *
		 * @param Int n
		 */
		spinTo: function( n ) {
			this.stop();
			
			this.object
				.css( prefixed( 'transition' ), prefixed( 'transform' ) + ' ' + this.options.duration + 'ms' )
				.css( prefixed( 'transform' ), 'translate3d( -' + ( ( n ) * this.object.children().width() ) + 'px, 0, 0 )' )
				.children().removeClass( 'carrousel-current' ).eq( n ).addClass( 'carrousel-current' ).end();
			
			var carrousel = this;
			
			this.ride = setTimeout( function() {
				carrousel.spin();
			}, this.options.delay );
		},
		
		/**
		 * Stop ride
		 */
		stop: function() {
			if( 'undefined' !== this.ride )
				clearTimeout( this.ride );
		},
	};
		
	/**
	 * Vendor property prefix helper
	 *
	 * @param String property
	 */
	function prefixed( property ) {
		switch( property ) {
			default:
				return property;
				break;
			
			case 'transition':
			case 'transform':
				var prefix = '';
				
				if( 'WebkitTransform' in document.body.style )
					prefix = '-webkit-';
				else if( 'MozTransform' in document.body.style )
					prefix = '-moz-';
				else if( 'OTransform' in document.body.style )
					prefix = '-o-';
				else if( 'MsTransform' in document.body.style )
					prefix = '-ms-';
				else if( 'transform' in document.body.style )
					prefix = '';
				
				return prefix + property;
				break;
			
			case 'transitionend':
				if( 'WebkitTransform' in document.body.style )
					return 'webkitTransitionEnd';
				else if( 'MozTransform' in document.body.style )
					return 'mozTransitionEnd';
				else if( 'OTransform' in document.body.style )
					return 'oTransitionEnd';
				else if( 'MsTransform' in document.body.style )
					return 'msTransitionEnd';
				else
					return property;
				break;
		}
	}
	
	/**
	 * Repeat string n times
	 *
	 * @param String string
	 * @param Int times
	 */
	function repeat( string, times ) {
		if( times < 1 )
			return '';
		
		var result = '';
		
		while( times > 0 )
			times >>= 1,
			result += string;
		
		return result;
	};
	
	/**
	 * jQuery plugin
	 *
	 * @param Object options
	 */
	$.fn.carrousel = function( options ) {
		new Carrousel( this, options );
	};
	
} )( jQuery, window, document );
