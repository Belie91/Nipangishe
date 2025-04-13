// lessee.js with Favorite Listings implementation

function loadListings(filtered = null) {
  const allListings = JSON.parse(localStorage.getItem("lessorListings")) || [];

  // Filter to show only available listings (not rented)
  const availableListings = allListings.filter((h) => !h.rented);

  const listingsToShow = filtered || availableListings;
  const container = document.getElementById("browseListings");
  container.innerHTML = "";

  if (listingsToShow.length === 0) {
    container.innerHTML = "<p>No listings available.</p>";
    return;
  }

  listingsToShow.forEach((house) => {
    const card = document.createElement("div");
    card.className = "listing-card";

    const isFavorited = isHouseFavorited(house.id);

    card.innerHTML = `
      <img src="${house.image}" alt="House" class="listing-img" />
      <h3>${house.title}</h3>
      <p><strong>Location:</strong> ${house.location}</p>
      <p><strong>Price:</strong> TSh ${house.price}</p>
      <p>${house.description}</p>
      <button onclick="rentHouse(${house.id})" ${
      house.rented ? "disabled" : ""
    }>
        ${house.rented ? "Rented" : "Rent This House"}
      </button>
      <button onclick="toggleFavorite(${house.id})">
        ${isFavorited ? "💔 Remove from Saved" : "💖 Save to Favorites"}
      </button>
    `;

    container.appendChild(card);
  });
}

function isHouseFavorited(houseId) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "lessee") return false;
  const saved =
    JSON.parse(localStorage.getItem("favorites_" + user.email)) || [];
  return saved.some((item) => item.id === houseId);
}

function toggleFavorite(houseId) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "lessee") return;

  let saved = JSON.parse(localStorage.getItem("favorites_" + user.email)) || [];
  const listings = JSON.parse(localStorage.getItem("lessorListings")) || [];
  const house = listings.find((h) => h.id === houseId);
  if (!house) return;

  const exists = saved.find((h) => h.id === houseId);
  if (exists) {
    saved = saved.filter((h) => h.id !== houseId);
  } else {
    saved.push(house);
  }

  localStorage.setItem("favorites_" + user.email, JSON.stringify(saved));
  loadListings();
}

function rentHouse(houseId) {
  const listings = JSON.parse(localStorage.getItem("lessorListings")) || [];
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "lessee") return;

  const houseIndex = listings.findIndex((h) => h.id === houseId);
  if (houseIndex === -1) return;

  listings[houseIndex].rented = true;
  listings[houseIndex].rentedBy = user.email;

  // Save updated listing
  localStorage.setItem("lessorListings", JSON.stringify(listings));

  // Save to user's rented list
  let rentedList =
    JSON.parse(localStorage.getItem("rentedBy_" + user.email)) || [];
  rentedList.push(listings[houseIndex]);
  localStorage.setItem("rentedBy_" + user.email, JSON.stringify(rentedList));

  alert("✅ You have successfully rented this house!");
  loadListings();
}

function filterListings() {
  const keyword =
    document.getElementById("searchKeyword")?.value.toLowerCase() || "";
  const location = document
    .getElementById("filterLocation")
    .value.toLowerCase();
  const minPrice =
    parseInt(document.getElementById("filterMinPrice").value) || 0;
  const maxPrice =
    parseInt(document.getElementById("filterMaxPrice").value) || Infinity;

  const listings = JSON.parse(localStorage.getItem("lessorListings")) || [];

  const filtered = listings.filter((house) => {
    const matchKeyword =
      house.title.toLowerCase().includes(keyword) ||
      house.description.toLowerCase().includes(keyword);
    const matchLocation = house.location.toLowerCase().includes(location);
    const matchPrice = house.price >= minPrice && house.price <= maxPrice;
    return !house.rented && matchKeyword && matchLocation && matchPrice;
  });

  loadListings(filtered);
}

function resetFilters() {
  document.getElementById("searchKeyword").value = "";
  document.getElementById("filterLocation").value = "";
  document.getElementById("filterMinPrice").value = "";
  document.getElementById("filterMaxPrice").value = "";
  loadListings();
}

window.onload = () => loadListings();
