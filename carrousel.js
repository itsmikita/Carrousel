/**
 * jQuery Carrousel - tiny slider plugin
 *
 * @package Carrousel
 * @version 0.1
 * @author Mikita Stankiewicz <designovermatter@gmail.com>
 */

;( function( $, window, document, undefined ) {
	//'use strict';
	
	/**
	 * Constructor
	 *
	 * @param object selector
	 */
	var Carrousel = function( selector, options ) {
		this.init( selector, options );
		
		return this;
	};
	
	/**
	 * Prototype
	 */
	Carrousel.prototype = {
		options: {},
		carrousel: null,
		ride: null,
		
		/**
		 * Init
		 */
		init: function( selector, options ) {
			var defaults = {
				delay: 5000,
				duration: 300,
			};
			
			this.options = $.extend( {}, defaults, options );
			this.setup( selector );
			this.circulate();
		},
		
		/**
		 * Setup
		 */
		setup: function( selector ) {
			this.carrousel = selector;
			
			this.carrousel.wrap(
					$( '<div id="carrousel-' + new Date().getTime() + '" class="carrousel-wrapper" />' )
						.width( this.carrousel.children().width() )
						.height( this.carrousel.children().height() )
						.css( 'position', 'relative' )
				)
				.addClass( 'carrousel' )
				.css( { // Fixes flickering
					'-webkit-backface-visibility': 'hidden',
					'-webkit-perspective': '1000',
				} )
				.width( this.carrousel.children().width() * this.carrousel.children().length )
				.css( 'position', 'absolute' );
			
			this.carrousel.children()
				.addClass( 'carrousel-child' );
		},
		
		/**
		 * Run continiuosly
		 */
		circulate: function() {
			this.stop();
			
			var self = this;
			
			this.ride = setInterval( function() {
				self.spin();
			}, this.options.delay );
		},
		
		/**
		 * Stop
		 */
		stop: function() {
			if( null != this.ride )
				clearInterval( this.ride );
		},
		
		/**
		 * Rotate
		 */
		spin: function() {
			this.animate( 0, -this.carrousel.children().width() );
		},
		
		/**
		 * CSS transitions
		 *
		 * @todo Flickering in Safari, test if it helps do detach() in pure Javascript instead
		 */
		animate: function( top, left ) {
			var self = this;
			
			function afterMath() {
				self.carrousel
					.css( self.prefixed( 'transition' ), 'none' )
					.css( self.prefixed( 'transform' ), 'translateX( 0 )' )
					.children().first().detach().appendTo( self.carrousel );
			};
			
			this.carrousel
				.css( this.prefixed( 'transition' ), this.prefixed( 'transform' ) + ' ' + this.options.duration + 'ms' )
				.css( this.prefixed( 'transform' ), 'translateX( ' + left + 'px )' )
				//.transitionend( afterMath );
				//.one( 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', afterMath );
			
			setTimeout( afterMath, this.options.duration );
			
			/*this.carrousel.animate( {
				top: top + 'px',
				left: left + 'px',
			}, afterMath );*/
		},
		/* Using jQuery.animate()
		animate: function() {
			var self = this;
			
			function afterMath() {
				self.carrousel
					.css( 'margin-left', self.carrousel.children().width() + 'px' )
					.children().first().detach().appendTo( self.carrousel );
			};
			
			this.carrousel.animate( { 'margin-left': 0 }, afterMath );
		},*/
		
		/**
		 * Vendor property prefix helper
		 *
		 * @param string property
		 */
		prefixed: function( property ) {
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
			}
		},
	};
	
	/**
	 * Event wrapper
	 * @todo
	 */
	$.fn.transitionend = function( callback ) {
		return this.each( function() {
			var self = $( this ),
				duration = parseFloat( self.css( 'transitionDuration' ) ) * 1000,
				delay = parseFloat( self.css( 'transitionDelay' ) ) * 1000;
			
			self.data( 'timer', setTimeout( function() {
				self.trigger( 'transitionend' );
				
				if( $.isFunction( callback ) )
					callback();
			}, delay + duration ) );
		} );
	};
	
	/**
	 * jQuery plugin
	 */
	$.fn.carrousel = function( options ) {
		new Carrousel( this, options );
	};
	
} )( jQuery, window, document );
