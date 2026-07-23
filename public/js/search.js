(() => {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const listingCardsContainer = document.getElementById("listing-cards");
    const defaultContainerClassName = listingCardsContainer?.className || "";

    if (!searchInput || !searchButton) {
        return;
    }

    const renderListingCards = (listings) => {
        if (!listings.length) {
            listingCardsContainer.className = "d-flex justify-content-center align-items-center";
            listingCardsContainer.style.minHeight = "50vh";
            listingCardsContainer.innerHTML = `
                <div class="alert alert-light border text-center mb-0" role="alert" style="max-width: 28rem; width: 100%;">
                    No listings found.
                </div>
            `;
            return;
        }

        listingCardsContainer.className = defaultContainerClassName;
        listingCardsContainer.style.minHeight = "";

        listingCardsContainer.innerHTML = listings
            .map((listing) => {
                const imageUrl = listing.image?.url || "https://via.placeholder.com/800x600?text=Stay'n";
                return `
                    <a href="/listings/${listing._id}" class="listing-link">
                        <div class="card col listing-card">
                            <img src="${imageUrl}" class="card-img-top" alt="listing_image" style="height: 20rem;">
                            <div class="card-img-overlay">Stay'n</div>
                            <div class="card-body">
                                <p class="card-text">
                                    <b>${listing.title}</b><br>
                                    &#8377; ${Number(listing.price).toLocaleString("en-IN")} /night<i class="tax-info"> &nbsp; &nbsp; +18% GST </i>
                                </p>
                            </div>
                        </div>
                    </a>
                `;
            })
            .join("");
    };

    const fetchListings = async () => {
        const searchText = searchInput.value.trim();
        const response = await fetch(`/listings/search?searchText=${encodeURIComponent(searchText)}`);
        const listings = await response.json();
        renderListingCards(listings);
    };

    const handleSearch = () => {
        if (listingCardsContainer) {
            fetchListings();
            return;
        }

        window.location.href = `/listings?searchText=${encodeURIComponent(searchInput.value.trim())}`;
    };

    searchButton.addEventListener("click", handleSearch);
})();