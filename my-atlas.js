
const API = "http://127.0.0.1:8000";

const user = JSON.parse(localStorage.getItem("user"));

const input = document.querySelector("#place-input");
const addButton = document.querySelector("#add-button");
const atlasItems = document.querySelector("#atlas-items");
const progressText = document.querySelector("#progress-text");
const progressFill = document.querySelector("#progress-fill");

if (!user) {
    window.location.href = "index.html";
}

async function loadAtlas() {
    const response = await fetch(API + "/myatlas/" + user.id);
    const items = await response.json();

    atlasItems.innerHTML = "";

    let visitedCount = 0;

    items.forEach(function(item) {
        if (item.visited) {
            visitedCount++;
        }

        const row = document.createElement("div");
        row.className = "place-item";

        const placeName = document.createElement("label");
        placeName.className = "place-name";

        if (item.visited) {
            placeName.classList.add("visited");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.visited;

        checkbox.addEventListener("change", function() {
            updatePlace(item.id, checkbox.checked);
        });

        const name = document.createElement("span");
        name.textContent = item.place;

        placeName.appendChild(checkbox);
        placeName.appendChild(name);

        const status = document.createElement("span");
        status.className = "visited-label";
        status.textContent = item.visited ? "Visited" : "Not visited";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "remove-button";

        removeButton.addEventListener("click", function() {
            deletePlace(item.id);
        });

        row.appendChild(placeName);
        row.appendChild(status);
        row.appendChild(removeButton);

        atlasItems.appendChild(row);
    });

    if (items.length === 0) {
        atlasItems.innerHTML =
            '<p class="empty-message">Your Atlas is empty. Add a place to get started!</p>';
    }

    progressText.textContent =
        visitedCount + " out of " + items.length + " places visited";

    let percentage = 0;

    if (items.length > 0) {
        percentage = (visitedCount / items.length) * 100;
    }

    progressFill.style.width = percentage + "%";
}

async function addPlace() {
    const place = input.value.trim();

    if (place === "") {
        alert("Please enter a place.");
        return;
    }

    const response = await fetch(API + "/myatlas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: user.id,
            place: place
        })
    });

    if (response.ok) {
        input.value = "";
        loadAtlas();
    } else {
        alert("Could not add the place.");
    }
}

async function updatePlace(id, visited) {
    const response = await fetch(
        API + "/myatlas/" + id + "?visited=" + visited,
        {
            method: "PUT"
        }
    );

    if (response.ok) {
        loadAtlas();
    } else {
        alert("Could not update the place.");
        loadAtlas();
    }
}

async function deletePlace(id) {
    const response = await fetch(API + "/myatlas/" + id, {
        method: "DELETE"
    });

    if (response.ok) {
        loadAtlas();
    } else {
        alert("Could not remove the place.");
    }
}

addButton.addEventListener("click", addPlace);

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addPlace();
    }
});

if (user) {
    loadAtlas();
}
