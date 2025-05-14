document.addEventListener('DOMContentLoaded', function() {
    async function fetchFeatureContent() {
        try {
            // Use the publish instance with your persisted query
            const graphqlURL = 'https://publish-p123749-e1215043.adobeaemcloud.com/graphql/execute.json/Content-Fragments/feature-content-query';
            
            console.log('Fetching from GraphQL:', graphqlURL);
            
            const response = await fetch(graphqlURL);
            
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('GraphQL Response:', data);
            
            // Check if the data has the expected structure
            if (!data.data || !data.data.featureList || !data.data.featureList.items) {
                console.warn('Unexpected GraphQL response structure:', data);
                return [];
            }
            
            // Return the feature items
            return data.data.featureList.items;
        } catch (error) {
            console.error('Error fetching GraphQL data:', error);
            return [];
        }
    }
    
    // Function to update a feature card with content
    function updateFeatureCard(card, featureData) {
        if (!featureData) return;
        
        console.log('Updating feature card with:', featureData);
        
        // Update title
        const titleElement = card.querySelector('[data-aue-prop="title"]');
        if (titleElement && featureData.title) {
            console.log('Setting title to:', featureData.title);
            titleElement.textContent = featureData.title;
        } else {
            console.warn('Could not update title - Element or data missing');
        }
        
        // Update description
        const descriptionElement = card.querySelector('[data-aue-prop="description"]');
        if (descriptionElement && featureData.description && featureData.description.html) {
            console.log('Setting description HTML');
            descriptionElement.innerHTML = featureData.description.html;
        } else {
            console.warn('Could not update description - Element or data missing');
        }
    }
    
    // Update all feature cards
    async function updateAllFeatureCards() {
        try {
            // Show loading state
            document.querySelectorAll('.feature-card [data-aue-prop="title"]').forEach(el => {
                el.textContent = "Loading...";
            });
            document.querySelectorAll('.feature-card [data-aue-prop="description"]').forEach(el => {
                el.innerHTML = "<p>Loading content...</p>";
            });
            
            // Fetch the content
            const featureItems = await fetchFeatureContent();
            
            if (featureItems.length === 0) {
                console.warn('No feature items found in GraphQL response');
                document.querySelectorAll('.feature-card [data-aue-prop="title"]').forEach(el => {
                    el.textContent = "No content available";
                });
                return;
            }
            
            console.log(`Found ${featureItems.length} feature items to display`);
            
            // Get all feature cards
            const featureCards = document.querySelectorAll('.feature-card');
            console.log(`Found ${featureCards.length} feature cards in the DOM`);
            
            // Update each card with corresponding data
            featureCards.forEach((card, index) => {
                if (index < featureItems.length) {
                    console.log(`Updating card ${index + 1} with data:`, featureItems[index]);
                    updateFeatureCard(card, featureItems[index]);
                } else {
                    console.warn(`No data available for card ${index + 1}`);
                }
            });
        } catch (error) {
            console.error('Error updating feature cards:', error);
            
            // Show error state
            document.querySelectorAll('.feature-card [data-aue-prop="title"]').forEach(el => {
                el.textContent = "Error loading content";
            });
        }
    }
    
    // Initialize 
    console.log('Initializing feature content loading');
    updateAllFeatureCards();
});