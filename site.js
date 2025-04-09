// Find all links in the page
const links = document.querySelectorAll('a');

// Set image container
let previewElement = null;

// Iterate through all links and append the image preview element
links.forEach(link => {
    let imageUrl = link.href;

    // Check if the link is an image URL
    if (isImgurUrl(imageUrl)) {

        // Resolve imgur links format
        imageUrl = resolveImgurUrl(imageUrl);

        // Create image container
        previewElement = document.createElement('div');
        previewElement.classList.add('richcontent');

        // Create image and set attributes
        const img = document.createElement('img');
        img.src = imageUrl;
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';

        // Skipping preview if image failed to load
        img.onerror = function() {
            this.style.display = 'none';
            console.log('Failed to load image: ', img.src);
            return;
        }

        // Append the image to the preview container
        previewElement.appendChild(img);
        
        // Insert the preview element after the link
        link.insertAdjacentElement('afterend', previewElement);
    }
});