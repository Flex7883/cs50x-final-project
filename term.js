const padding = 20;
let previewElement = null;

function handleMouseOver(event) {
    let hoveredUrl = this.href;

    // Resolve imgur links to match 
    hoveredUrl = resolveImgurUrl(hoveredUrl);

    if (isImageUrl(hoveredUrl)) {

        // Prevent creating multiple preview elements
        if (previewElement) {
            return;
        }

        // Create container for image
        previewElement = document.createElement('div');
        previewElement.id = 'image-preview-container';

        // Create img
        const img = document.createElement('img');

        // set initial position
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        previewElement.style.left = `${mouseX + padding}px`;
        previewElement.style.top = `${mouseY + padding}px`;

        // Check if the image would overflow the viewport
        img.onload = function() {        
            
            // If mouseOut before image loading completed
            if (previewElement === null) {
                return;
            }

            // Set image position within viewport
            if (mouseY + previewElement.offsetHeight + padding > window.innerHeight - padding) {
                mouseY = window.innerHeight - previewElement.offsetHeight - padding * 2;
            }

            previewElement.style.top = `${mouseY + padding}px`;
        };

        // Remove previewElement/listener if image failed to load
        img.onerror = function(errorEvent) {
            console.error('Failed to load image: ', img.src, 'Event: ', errorEvent);
            handleMouseOut.call(event.target);
        }

        // Append img to container
        previewElement.appendChild(img);

        // Set image link source
        img.src = hoveredUrl;

        // Set img referrer policy to non if imgur link
        if (isImgurUrl(hoveredUrl)) {
            img.referrerPolicy = 'no-referrer';
            return;
        }        

        // Append whole container
        document.body.appendChild(previewElement);

        // Add mouse movement listener
        this.addEventListener('mousemove', handleMouseMove);        
    }
}

// Remove image after mouse moving out of link
function handleMouseOut(event) {
    this.removeEventListener('mousemove', handleMouseMove);
    if (previewElement) {
        previewElement.remove();
        previewElement = null;
    }
  
}

// Dynamiclly position image alongside the cursor
function handleMouseMove(event) {

    // Pass function if image isn't loaded
    if (!previewElement) {
        this.removeEventListener('mousemove', handleMouseMove);
        return;
    }

    let mouseX = event.clientX;
    let mouseY = event.clientY;

    if (mouseY + previewElement.offsetHeight + padding > window.innerHeight - padding) {
        mouseY = window.innerHeight - previewElement.offsetHeight - padding * 2;
    }

    previewElement.style.left = `${mouseX + padding}px`;
    previewElement.style.top = `${mouseY + padding}px`;
}

// Find all link elements on the page
const links = document.querySelectorAll("a");

// Loop through each link and add event listeners
links.forEach(link => {
    link.addEventListener('mouseover', handleMouseOver);
    link.addEventListener('mouseout', handleMouseOut);
});

// Observe page mutation for re-attacthing mouseOver/Out (For term.ptt)
// Select the node for observing mutations
const targetNode = document.body

// Options for the observer
const config = { attributes: false, childList: true, subtree: true };

// Set callback funtion attaching mouseOver/out for new addedNode
const callback = (mutationList, observer) => {

    // Iterate mutation list
    for (const mutation of mutationList) {

        // Iterate only added nodes
        for (const node of mutation.addedNodes) {

            // Attach only to element node with a tag name
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches('a')) {
                    node.addEventListener('mouseover', handleMouseOver);
                    node.addEventListener('mouseout', handleMouseOut);
                }

                // Remove preview when there's a view update causing by browsering
                // Target <span> is needed because when browsing PTT, PTT updates the view by removing and adding <span> elements
                // so we treat <span> mutation as mouseOut event to remove image preview
                if (node.matches('span')) {
                    if (previewElement) {
                        previewElement.remove();
                        previewElement = null;
                    }
                }
            }
        }
    }
};

// Create an oberserver instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observering
observer.observe(targetNode, config);