/**
 * CSS3 animated slider with minimum DOM dependencies.
 *
 * @package Roller
 * @verion 1.0 
 */
;( function( $ ) {
	/**
	 * Defaults
	 */
	var defaults = {
		$slides: null, //Slides
		$nav: null, // Navigation (if any)
		$navLeft: null, // Arrow left (if any)
		$navRight: null, // Arrow right (if any)
		selectedClass: 'selected',
		leftClass: 'left',
		rightClass: 'right',
		delay: 3000
	};
	
	/**
	 * Constructor
	 */
	var Roller = function( options ) {
		// Configure
		this.config = $.extend( {}, defaults, options );
		
		var self = this,
			$slides = self.config.$slides,
			$nav = self.config.$nav,
			$navLeft = self.config.$navLeft,
			$navRight = self.config.$navRight;
		
		if( ! $slides.length )
			return console.warn( 'It\'s not recommended to run Roller() on pages without intended slider.' );
		
		// Initial
		self.to( 0 );
		
		// Navigate
		$nav.on( 'click', function( event ) {
			event.preventDefault();
			
			clearInterval( this._autoplay );
			
			self.to( $( this ).index() );
		} );
		
		// Left or right
		if( $navLeft )
			$navLeft.add( $navRight ).on( 'click', function( event ) {
				event.preventDefault();
				
				if( $( this ).is( $navLeft ) )
					self.prev();
				else if( $( this ).is( $navRight ) )
					self.next();
			} );
		
		// Auto play
		self.auto();
	};
	
	Roller.prototype = {
		// Auto slide intervalID
		_autoplay: null,
		
		/**
		 * Slide to
		 *
		 * @param int x - Index of the next slide
		 */
		to: function( x ) {
			var self = this,
				selectedClass = self.config.selectedClass,
				leftClass = self.config.leftClass,
				rightClass = self.config.rightClass,
				$slides = self.config.$slides,
				$selected = $slides.filter( '.' + selectedClass ),
				$nav = self.config.$nav;
			
			if( null !== x )
				$selected = $slides.eq( x );
			else
				x = $selected.index();
			
			// Remove all classes
			$slides.removeClass( selectedClass + ' ' + leftClass + ' ' + rightClass );
			
			$slides.each( function( n ) {
				var sortClass = n > x ? rightClass : leftClass;
				
				if( $( this ).is( $selected ) )
					$( this ).addClass( selectedClass );
				else
					$( this ).addClass( sortClass );
			} );
			
			// Navigation
			$nav.removeClass( selectedClass ).eq( x ).addClass( selectedClass );
		},
		
		/**
		 * Slide to previous
		 */
		prev: function() {
			var current = this.config.$slides.filter( '.selected' ).index()
				x = current - 1;
			
			if( 0 > x )
				x = 0;
			
			this.to( x );
		},
		
		/**
		 * Slide to next
		 */
		next: function() {
			var $slides = this.config.$slides,
				selectedClass = this.config.selectedClass,
				current = $slides.filter( '.' + selectedClass ).index()
				x = current + 1;
			
			if( $slides.length - 1 < x )
				x = $slides.length - 1;
			
			this.to( x );
		},
		
		/**
		 * Auto slide
		 */
		auto: function() {
			var self = this,
				$slides = self.config.$slides;
			
			$slides.off( 'mouseover mouseout' );
			
			// Slide
			self._autoplay = setInterval( function() {
				self.next();
			}, self.config.delay );
			
			// Stop autoplay when mouse is over
			$slides.on( 'mouseover', function( event ) {
				clearInterval( self._autoplay );
			} );
			
			// Continue autoplay when mouse leaves
			$slides.on( 'mouseover', function( event ) {
				self.auto();
			} );
		}
	};
	
	$.fn.Roller = function( options ) {
		new Roller( options );
	};
	
} )( jQuery );