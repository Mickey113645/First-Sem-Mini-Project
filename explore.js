const destinationGuides = {

    japan: {
        name: "Japan",
        intro: "A thoughtful route through lantern-lit lanes, mountain temples and modern city life.",
        attractions: "Fushimi Inari shrines, Arashiyama bamboo grove and Nara deer park.",
        hiddenGem: "Shirakawa-go, a village of traditional thatched-roof farmhouses.",
        duration: "10–14 days",
        stay: "Explore local ryokan and guesthouse options.",
        budget: "Plan for about $140 per person per day."
    },

    canada: {
        name: "Canada",
        intro: "Pair the great outdoors with welcoming cities and a little old-world charm.",
        attractions: "Lake Louise, Old Quebec and Whistler.",
        hiddenGem: "Tofino's storm-watching beaches on the Pacific coast.",
        duration: "8–12 days",
        stay: "Explore local lodges and mountain stays.",
        budget: "Plan for about $150 per person per day."
    },

    kenya: {
        name: "Kenya",
        intro: "A wide-open adventure from legendary wildlife reserves to the Indian Ocean.",
        attractions: "Maasai Mara, Amboseli and Diani Beach.",
        hiddenGem: "Cycle through the dramatic gorge at Hell's Gate.",
        duration: "8–10 days",
        stay: "Savanna Lodge",
        budget: "Plan for about $120 per person per day."
    },

    thailand: {
        name: "Thailand",
        intro: "Mix temple visits and street-food evenings with a slower island escape.",
        attractions: "The Grand Palace, Phi Phi islands and Doi Suthep.",
        hiddenGem: "Stay among the floating bungalows of Khao Sok.",
        duration: "10–14 days",
        stay: "City Nook Inn",
        budget: "Plan for about $70 per person per day."
    },

    peru: {
        name: "Peru",
        intro: "Follow ancient trails through high Andes landscapes and lively market towns.",
        attractions: "Machu Picchu, Sacred Valley and Colca Canyon.",
        hiddenGem: "The rainbow-striped Palccoyo mountains.",
        duration: "9–12 days",
        stay: "Backpacker Burrow",
        budget: "Plan for about $80 per person per day."
    },

    egypt: {
        name: "Egypt",
        intro: "Trace thousands of years of history from the Nile to the desert.",
        attractions: "Giza pyramids, Valley of the Kings and Abu Simbel.",
        hiddenGem: "The chalk formations of the White Desert.",
        duration: "7–10 days",
        stay: "Explore local guesthouses and Nile stays.",
        budget: "Plan for about $75 per person per day."
    },

    italy: {
        name: "Italy",
        intro: "Make time for iconic art, long lunches and the slower pace of small towns.",
        attractions: "The Colosseum, Uffizi Gallery and Grand Canal.",
        hiddenGem: "Civita di Bagnoregio, the hilltop 'dying town'.",
        duration: "7–10 days",
        stay: "Explore local agriturismi and boutique stays.",
        budget: "Plan for about $130 per person per day."
    },

    iceland: {
        name: "Iceland",
        intro: "Follow waterfalls and volcanic coastlines beneath a sky that never stands still.",
        attractions: "Golden Circle, Blue Lagoon and Skógafoss.",
        hiddenGem: "A quiet soak in the hidden hot spring at Seljavallalaug.",
        duration: "6–8 days",
        stay: "Glass Cabin Aurora",
        budget: "Plan for about $190 per person per day."
    }

};

const guideDialog = document.querySelector(".guide-dialog");
const guideTitle = document.querySelector("#guide-title");
const guideIntro = document.querySelector(".guide-intro");
const guideBudget = document.querySelector(".guide-budget");

const guideFacts = document.querySelectorAll("[data-guide-fact]");

const guideButtons = document.querySelectorAll(".guide-button");

guideButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const country = button.getAttribute("data-destination");
        const guide = destinationGuides[country];

        if (guide) {

            guideTitle.textContent = guide.name;
            guideIntro.textContent = guide.intro;
            guideBudget.textContent = guide.budget;

            guideFacts.forEach(function(fact) {

                const factName = fact.getAttribute("data-guide-fact");

                fact.textContent = guide[factName];

            });

            guideDialog.showModal();

        }

    });

});

const closeButton = document.querySelector(".dialog-close");

closeButton.addEventListener("click", function() {

    guideDialog.close();

});

guideDialog.addEventListener("click", function(event) {

    if (event.target === guideDialog) {

        guideDialog.close();

    }

});


const saveButtons = document.querySelectorAll(".save-button");

const user = JSON.parse(localStorage.getItem("user"));

let wishlist = [];

async function loadWishlist() {

    if (!user) {
        return;
    }

    const response = await fetch(
        "http://127.0.0.1:8000/wishlist/" + user.id
    );

    wishlist = await response.json();

    saveButtons.forEach(function(button) {

        const card = button.closest(".destination-card");
        const country = card.querySelector(".card-country").textContent;

        const item = wishlist.find(function(saved) {
            return saved.destination === country;
        });

        if (item) {
            button.textContent = "★";
            button.classList.add("saved");
            button.setAttribute("aria-pressed", "true");
        } else {
            button.textContent = "☆";
            button.classList.remove("saved");
            button.setAttribute("aria-pressed", "false");
        }

    });

}

saveButtons.forEach(function(button) {

    button.addEventListener("click", async function() {

        if (!user) {
            alert("Please login first");
            return;
        }

        const card = button.closest(".destination-card");
        const country = card.querySelector(".card-country").textContent;

        const item = wishlist.find(function(saved) {
            return saved.destination === country;
        });

        let response;

        if (item) {

            response = await fetch(
                "http://127.0.0.1:8000/wishlist/" + item.id + "?user_id=" + user.id,
                {
                    method: "DELETE"
                }
            );

        } else {

            response = await fetch("http://127.0.0.1:8000/wishlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    place: country
                })
            });

        }

        if (response.ok) {

            await loadWishlist();

        } else {

            const result = await response.json();
            alert(result.detail);

        }

    });

});

loadWishlist();
