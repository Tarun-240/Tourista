const App = () => {
    let selectedState = null;
    const mainContent = document.getElementById('main-content');
    const footerText = document.getElementById('footer-text');
    // Get a reference to the intro section
    const introSection = document.getElementById('states-intro-section'); 
    
    // ... (Initialize footer year) ...

    // Function to handle state selection (replaces handleSelectState)
    const handleSelectState = (state) => {
        selectedState = state;
        render();
    };

    // Function to handle going back to the grid (replaces handleBack)
    const handleBack = () => {
        selectedState = null;
        render();
    };

    // Core rendering function
    const render = () => {
        // Clear previous content
        mainContent.innerHTML = '';
        window.scrollTo(0, 0);

        // 💡 BULLETPROOF FIX: Use direct style manipulation (highest priority)
        if (introSection) {
            if (selectedState) {
                // State is selected (Detail View): HIDE the intro section
                // Set the display property to 'none'
                introSection.style.display = 'none'; 
            } else {
                // No state selected (Grid View): SHOW the intro section
                // Revert the display property to an empty string to restore original CSS/browser default
                introSection.style.display = ''; 
            }
        }
        // END OF FIX

        if (selectedState) {
            // Render StateDetail
            mainContent.appendChild(renderStateDetail(selectedState, handleBack));
        } else {
            // Render StateGrid
            mainContent.appendChild(renderStateGrid(INDIAN_STATES, handleSelectState));
        }
    };

    // Initial render
    render();
}; 

// --- Component Functions (Replaces StateGrid.tsx) ---

// Helper function to create a State Card DOM element
const createStateCard = (state, onSelectState) => {
    const card = document.createElement('div');
    card.className = 'state-card';
    card.addEventListener('click', () => onSelectState(state));

    card.innerHTML = `
        <img src="${state.imageUrl}" alt="Image of ${state.name}" class="state-card-image" loading="lazy" />
        <div class="state-card-content">
            <h2 class="state-card-name">${state.name}</h2>
            <p class="state-card-description">${state.description}</p>
        </div>
    `;

    return card;
};

// Function to render the State Grid container
const renderStateGrid = (states, onSelectState) => {
    const container = document.createElement('section');
    container.className = 'state-grid-container';

    const grid = document.createElement('div');
    grid.className = 'state-grid';

    states.forEach(state => {
        grid.appendChild(createStateCard(state, onSelectState));
    });

    container.appendChild(grid);
    return container;
};


// --- Component Functions (Replaces StateDetail.tsx) ---

// Function to render the Tourist Places list
// Function to render the Tourist Places list
const renderTouristPlaces = (places) => {
    const list = document.createElement('div');
    list.className = 'places-list';

    places.forEach(place => {
        const item = document.createElement('div');
        item.className = 'place-item'; // Now a flex container
        
        // Use a wrapper for the text content to manage flow
        const contentWrapper = document.createElement('div'); 
        
        // 💡 ADDED: Image element (will be on the left due to flex)
        const imageHtml = place.imageUrl 
            ? `<img src="${place.imageUrl}" alt="${place.name}" class="place-item-image" loading="lazy" />`
            : ''; // Render nothing if imageUrl is missing

        contentWrapper.innerHTML = `
            <h4 class="place-name">${place.name}</h4>
            <p class="place-description">${place.description}</p>
        `;
        
        // 💡 APPEND the image and the content wrapper to the item
        item.innerHTML = imageHtml;
        item.appendChild(contentWrapper);
        
        list.appendChild(item);
    });

    return list;
};

// Function to render the State Detail view
const renderStateDetail = (state, onBack) => {
    const container = document.createElement('section');
    container.className = 'state-detail-container';

    const card = document.createElement('div');
    card.className = 'state-detail-card';

    // Back Button
    const backButton = document.createElement('button');
    backButton.className = 'detail-back-button';
    backButton.innerHTML = `&larr; Back to all States`;
    backButton.addEventListener('click', onBack);
    card.appendChild(backButton);

    // Header Content (Image and Quick Info)
    const header = document.createElement('div');
    header.className = 'detail-header';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'detail-image-wrapper';
    imageWrapper.innerHTML = `<img src="${state.imageUrl}" alt="View of ${state.name}" class="detail-image" />`;

    const info = document.createElement('div');
    info.className = 'detail-info';
    info.innerHTML = `
        <h2 class="detail-name">${state.name}</h2>
        <p class="detail-short-desc">${state.description}</p>
        <p class="detail-time-to-visit">
            <span class="font-bold text-gray-900">Best Time to Visit:</span> ${state.bestTimeToVisit}
        </p>
    `;

    header.appendChild(imageWrapper);
    header.appendChild(info);
    card.appendChild(header);

    // Long Description Section
    const descriptionTitle = document.createElement('h3');
    descriptionTitle.className = 'detail-section-title';
    descriptionTitle.textContent = `About ${state.name}`;
    card.appendChild(descriptionTitle);

    const longDescription = document.createElement('p');
    longDescription.className = 'detail-long-desc';
    longDescription.textContent = state.longDescription;
    card.appendChild(longDescription);

    // Top Tourist Places Section
    const placesTitle = document.createElement('h3');
    placesTitle.className = 'detail-section-title';
    placesTitle.textContent = `Top Tourist Places in ${state.name}`;
    card.appendChild(placesTitle);

    const placesList = renderTouristPlaces(state.topTouristPlaces);
    card.appendChild(placesList);

    container.appendChild(card);
    return container;
};


// Run the App function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', App);