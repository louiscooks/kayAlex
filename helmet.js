const helmet = require('helmet')

const scriptSrcUrls = [
	'https://cdn.jsdelivr.net',
	'https://code.jquery.com/jquery-3.6.0.min.js',
	// "https://stackpath.bootstrapcdn.com",
	// "https://api.tiles.mapbox.com",
	// "https://api.mapbox.com",
	// "https://kit.fontawesome.com",
	// "https://cdnjs.cloudflare.com",
	// "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
	"https://cdn.jsdelivr.net",
	// "https://kit-free.fontawesome.com",
	// "https://stackpath.bootstrapcdn.com",
	// "https://api.mapbox.com"
	// "https://api.tiles.mapbox.com",
	// "https://fonts.googleapis.com",
	// "https://use.fontawesome.com"
];
const connectSrcUrls = [
	// "https://api.mapbox.com",
	// "https://*.tiles.mapbox.com",
	// "https://events.mapbox.com"
];
const fontSrcUrls = [];
module.exports.helmet = helmet
module.exports.contentSecurity = helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://images.unsplash.com",
        ],
        fontSrc: ["'self'", ...fontSrcUrls]
    }
})
