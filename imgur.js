// Define common used image file extensions
const image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

// Check if Url ends with defined extensions
function isImageUrl(Url) {
    try {
        const parsedUrl = new URL(Url);
        const pathname = parsedUrl.pathname.toLowerCase();
        return image_extensions.some(ext => pathname.endsWith('.' + ext));
    } catch (e) {
        return false;
    }
}

// Check if Url's host name === imgur
function isImgurUrl(Url) {
    try {
        const parsedUrl = new URL(Url);
        const hostname = parsedUrl.hostname.toLowerCase();
        return hostname.endsWith('imgur.com');
    } catch (e) {
        return false;
    }
}

// Resolve all kinds of imgur links to match term.ptt's imgur links format
// This is needed because people on PTT are posting imgur links in different formats
function resolveImgurUrl(Url) {

    // Replace http with https for imgur links
    if (Url.startsWith('http://i.imgur.com/')) {
        Url = Url.replace('http://', 'https://');

    // Replace imgur.com with i.imgur.com
    } else if (Url.startsWith('https://imgur.com/')) {
        Url = Url.replace('imgur.com/', 'i.imgur.com/');

        // Add .jpg to imgur links without extension
        if (!isImageUrl(Url)) {
            Url += '.jpg';
        }
    }
    return Url;
}