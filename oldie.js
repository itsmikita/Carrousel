/**
 * The old code of mine I used as reference.
 */

var turum = {
	options:{
		container:null,
		speed:500,
		delay:4000,
		offset:60
	},
	leafs:0,
	current:null,
	timeout:null,
	init:function( options ) {
		turum.options = $.extend( {}, turum.options, options );
		turum.leafs = $( turum.options.container + " .banner" ).size();
		setTimeout( function() { turum.autoplay(); }, 1000 );
		$( turum.options.container + " .banner" ).mouseover( function() {
			turum.play( $( this ).index(), true );
		} );
		$( turum.options.container + " .banner" ).mouseout( function() {
			turum.cont();
		} );
	},
	autoplay:function() {
		turum.play( 0 );
	},
	cont:function() {
		turum.timeout = setTimeout( function() {
			turum.play( turum.current + 1 );
		}, turum.options.delay );
	},
	debug:function( text ) {
		$( "#debug" ).append( text );
	},
	play:function( num, single ) {
		if( "null" != typeof turum.timeout )
			clearTimeout( turum.timeout );
		if( num == turum.current )
			return false;
		if( num > turum.leafs - 1 )
			num = 0;
		// left
		for( var i = 0; i < num; i++ ) {
			var right = ( 1100 - ( ( i + 1 ) * 60 ) ) + "px";
			turum.animate( $( turum.options.container + " .banner" ).eq( i ), right );
		}
		// right
		for( var i = turum.leafs - 1; i > num; i--  ) {
			var right = ( ( turum.leafs - i ) * 60 ) + "px";
			turum.animate( $( turum.options.container + " .banner" ).eq( i - 1 ), right );
		}
		turum.current = num;
		if( true == single )
			return false;
		turum.timeout = setTimeout( function() {
			turum.play( turum.current + 1 );
		}, turum.options.delay );
	},
	animate:function( obj, px ) {
		//js
		if( $.browser.msie || $.browser.opera )
			jTweener.addTween( obj, {
				right:px,
				time:turum.options.speed / 1000
			} );
		//css3 (only -webkit and -moz)
		else
			$( obj ).css( {
				right:px
			} )
	}
};

