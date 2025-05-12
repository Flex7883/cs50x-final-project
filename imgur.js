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

// Check if the URL belongs to imgur
function isImgurUrl(Url) {
    try {
        const parsedUrl = new URL(Url);
        const hostname = parsedUrl.hostname.toLowerCase();
        return (/\b(i\.|)imgur\.com$/.test(hostname));
    } catch (e) {
        return false;
    }
}

// Resolve all kinds of imgur links format
function resolveImgurUrl(Url) {

    // Handles links format conversion for PTT's built-in image preview.
    // Note: PTT's built-in image preview is currently hidden due to positioning bug.
    // Kept to prevent console errors and for potential furture usage.
    try {
        const parsedUrl = new URL(Url);
        const hostname = parsedUrl.hostname.toLowerCase();
        const pathname = parsedUrl.pathname;
        if (hostname.includes('imgur.com')) {
            Url = 'https://i.imgur.com' + pathname;
            if (!isImageUrl(Url)) {
                Url += '.jpg';
            }
        }
    } catch (e) {
        return Url;
    }
    console.log('imgurURL: ' + Url);
    return Url;
}