document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch content fragment data using infinity.json
    async function fetchContentFragment(path) {
        try {
            const cleanPath = path.replace('urn:aemconnection:', '');
            const aemURL = 'https://author-p123749-e1215043.adobeaemcloud.com';
            
            console.log('Fetching from:', `${aemURL}${cleanPath}.infinity.json`);
            
            // Use withCredentials to send auth cookies
            const response = await fetch(`${aemURL}${cleanPath}.infinity.json`, {
                method: 'GET',
                credentials: 'include',  // Important for sending auth cookies
                headers: {
                    'Accept': 'application/json'
                },
                redirect: 'follow'       // Follow redirects
            });
            
            if (!response.ok) {
                console.error('Response not OK:', response.status, response.statusText);
                throw new Error(`HTTP error ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching content fragment:`, error);
            return null;
        }
    }
    
    // Function to update a feature card with content fragment data
    async function updateFeatureCard(cardElement) {
        try {
            // Get the resource path from the data-aue-resource attribute
            const resourcePath = cardElement.getAttribute('data-aue-resource');
            if (!resourcePath) return;
            
            console.log('Fetching content from:', resourcePath);
            
            // Fetch the content fragment data
            const data = await fetchContentFragment(resourcePath);
            if (!data) {
                console.log('No data received for:', resourcePath);
                return;
            }
            
            console.log('Content Fragment Data:', data);
            
            // Update the title element
            const titleElement = cardElement.querySelector('[data-aue-prop="title"]');
            if (titleElement && data.title) {
                console.log('Updating title to:', data.title);
                titleElement.textContent = data.title;
            } else {
                console.log('Either title element not found or data.title is missing');
            }
            
            // Update the description element
            const descriptionElement = cardElement.querySelector('[data-aue-prop="description"]');
            if (descriptionElement && data.description) {
                console.log('Updating description to:', data.description);
                descriptionElement.innerHTML = data.description;
            } else {
                console.log('Either description element not found or data.description is missing');
            }
        } catch (error) {
            console.error('Error updating feature card:', error);
        }
    }
    
    // Update all feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    console.log('Found', featureCards.length, 'feature cards to update');
    featureCards.forEach(updateFeatureCard);
});