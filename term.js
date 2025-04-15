const mainContainer = document.getElementById('mainContainer');
const padding = 20;
let img = null;
let latestMouseEvent = null;

function updateImagePosition(img, mouseEvent) {
    
    // Skip image positioning if mouseOut before image loaded
    if (img === null) {
        return;
    }
    
    let mouseX = mouseEvent.clientX;
    let mouseY = mouseEvent.clientY;
    const initialX = mouseX + padding;
    const initialY = mouseY - img.offsetHeight / 2 + padding;
    let adjustedY = 0;

    // Ensure the image preview stays vertically within the viewport.
    // Avoid constraining horizontally, as moving the cursor over the 
    // preview would incorrectly trigger its removal.

    if (initialY < padding) {
        adjustedY = padding;
    } else if (initialY + img.offsetHeight > window.innerHeight - padding) {
        adjustedY = window.innerHeight - img.offsetHeight - padding;
    } else {
        adjustedY = initialY;
    }
    
    img.style.left = `${initialX}px`;
    img.style.top = `${adjustedY}px`;
}

function handleMouseOver(event) {
    let hoveredUrl = this.href;

    // Resolve imgur links to unified format
    hoveredUrl = resolveImgurUrl(hoveredUrl);

    // Store initial event
    latestMouseEvent = event;

    if (isImageUrl(hoveredUrl)) {

        img = document.createElement('img');
        img.style.visibility = 'hidden';

        // Adjust image vertical position within viewpoert after loaded
        img.onload = function() {        
            
            // Skip image positioning if mouseOut before loaded
            if (img === null) {
                return;
            }
            
            // Update mouse event position 
            updateImagePosition(img, latestMouseEvent);
            
            // Make image visible after loading and positioning
            img.style.visibility = 'visible';
        };

        // Handle image loading errors
        img.onerror = function(errorEvent) {
            console.error('Failed to load image: ', img.src, 'Event: ', errorEvent);
            handleMouseOut.call(event.target);
        };

        // Set image source and styles
        img.src = hoveredUrl;
        img.style.display = 'block';
        img.style.position = 'absolute';
        img.style.maxHeight = '80%';
        img.style.maxWidth = '90%';
        img.style.zIndex = '2';

        // Set no-referrer policy for imgur links
        if (isImgurUrl(hoveredUrl)) {
            img.referrerPolicy = 'no-referrer';
        }

        // Append image to mainContainer
        mainContainer.appendChild(img);

        // Add mousemove event listener to dynamically position the image
        this.addEventListener('mousemove', handleMouseMove);
    }
}

// Remove image after mouse moving out of the link
function handleMouseOut(event) {
    this.removeEventListener('mousemove', handleMouseMove);
    if (img) {
        img.remove();
        img = null;
    }
    latestMouseEvent = null;
}

// Dynamiclly position image alongside the cursor
function handleMouseMove(event) {

    // update latest mouse event
    latestMouseEvent = event;

    // Check if img exists, if not, remove the event listener and exit
    if (img === null) {
        this.removeEventListener('mousemove', handleMouseMove);
        latestMouseEvent = null;
        return;
    }

    updateImagePosition(img, event);
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
                    if (img) {
                        img.remove();
                        img = null;
                    }
                }
            }

            // Hide PTT genarates preview images
            // Because it sometimes placed out of viewport
            if (node.nodeName === 'IMG' &&
                node.src &&
                node.src.startsWith('https://i.imgur.com/') &&
                node.style.position === 'absolute') {

                // Skip if the node is our preview image
                if (node === img) {
                    continue;
                }

                // Hide any image preview isn't created by us (which is generated by PTT)
                node.style.display = 'none';
                node.style.visibility = 'hidden';
            }
        }
    }
};

// Create an oberserver instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observering
observer.observe(targetNode, config);