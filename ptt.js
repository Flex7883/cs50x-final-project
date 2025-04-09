// Find all links in the page
const links = document.querySelectorAll('a');

// Iterate through all links and append the image preview element
links.forEach(link => {
    let imageUrl = link.href;

    // Check if the link is an image URL
    if (isImgurUrl(imageUrl)) {
        imageUrl = resolveImgurUrl(imageUrl);
        const img = document.createElement('img');
        img.src = imageUrl;
        img.classList.add('image-preview-thumbnail');
        img.referrerPolicy = 'no-referrer';

        // Image fails loading handling
        img.onerror = function() {
            this.style.display = 'none';
            console.log('Failed to load image: ', img.src);
        }

        link.insertAdjacentElement('afterend', img);
    }
});