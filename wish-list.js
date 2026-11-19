
const API = "http://127.0.0.1:8000";

const user = JSON.parse(localStorage.getItem("user"));

const list = document.querySelector("#wishlist-items");
const input = document.querySelector("#place-input");
const addButton = document.querySelector("#add-button");

if (!user) {

    window.location.href = "index.html";

} else {

    async function loadItems() {

        const response = await fetch(
            API + "/wishlist/" + user.id
        );

        const items = await response.json();

        list.innerHTML = "";

        items.forEach(function(item) {

            const li = document.createElement("li");

            const place = document.createElement("span");
            place.textContent = "📍 " + item.place;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.className = "remove-button";

            removeButton.addEventListener("click", function() {
                deleteItem(item.id);
            });

            li.appendChild(place);
            li.appendChild(removeButton);

            list.appendChild(li);

        });

        if (items.length === 0) {
            list.textContent = "Your wish list is empty.";
        }

    }

    async function addItem() {

        const destination = input.value.trim();

        if (destination === "") {
            alert("Enter a destination first.");
            return;
        }

        const response = await fetch(API + "/wishlist", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                user_id: user.id,
                place: destination
            })

        });

        const result = await response.json();

        if (response.ok) {

            input.value = "";
            loadItems();

        } else {

            alert(result.detail);

        }

    }

    async function deleteItem(id) {

        const response = await fetch(
            API + "/wishlist/" + id + "?user_id=" + user.id,
            {
                method: "DELETE"
            }
        );

        if (response.ok) {
            loadItems();
        } else {
            alert("Could not remove destination.");
        }

    }

    addButton.addEventListener("click", addItem);

    input.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            addItem();
        }

    });

    loadItems();

}
