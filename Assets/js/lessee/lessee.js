function loadListings(filtered = false) {
  const listings = JSON.parse(localStorage.getItem("lessorListings")) || [];
  const container = document.getElementById("browseListings");
  container.innerHTML = "";

  const filteredListings = filtered || listings;

  if (filteredListings.length === 0) {
    container.innerHTML = "<p>No listings available.</p>";
    return;
  }

  filteredListings.forEach((house) => {
    const card = document.createElement("div");
    card.className = "listing-card";

    card.innerHTML = `
        <img src="${house.image}" alt="House" class="listing-img" />
        <h3>${house.title}</h3>
        <p><strong>Location:</strong> ${house.location}</p>
        <p><strong>Price:</strong> TSh ${house.price}</p>
        <p>${house.description}</p>
      `;

    container.appendChild(card);
  });
}

function filterListings() {
  const location = document
    .getElementById("filterLocation")
    .value.toLowerCase();
  const minPrice =
    parseInt(document.getElementById("filterMinPrice").value) || 0;
  const maxPrice =
    parseInt(document.getElementById("filterMaxPrice").value) || Infinity;

  const listings = JSON.parse(localStorage.getItem("lessorListings")) || [];

  const filtered = listings.filter((house) => {
    const matchLocation = house.location.toLowerCase().includes(location);
    const matchPrice = house.price >= minPrice && house.price <= maxPrice;
    return matchLocation && matchPrice;
  });

  loadListings(filtered);
}

window.onload = () => loadListings();
