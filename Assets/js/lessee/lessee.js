function loadListings(filtered = false) {
  const allListings = JSON.parse(localStorage.getItem("lessorListings")) || [];

  // Only show available listings
  const availableListings = allListings.filter((h) => !h.rented);

  const listings = filtered || availableListings;
  const container = document.getElementById("browseListings");
  container.innerHTML = "";

  if (listings.length === 0) {
    container.innerHTML = "<p>No listings available.</p>";
    return;
  }

  listings.forEach((house) => {
    const card = document.createElement("div");
    card.className = "listing-card";
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
    `;
    container.appendChild(card);
  });
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
  loadListings(); // refresh listings to update button state
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
