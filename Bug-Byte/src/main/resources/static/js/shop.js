import {monkeyLook, monkeyLookTemp} from "./common.js";

const tabs = document.querySelectorAll(".tab");
let currentTab;
const user = JSON.parse(localStorage.getItem("user"))
const currentShopItem = user.shopItems;
const curChar = document.getElementById("char-image");


tabs.forEach(tab => tab.addEventListener("click", () => {
    curChar.src = monkeyLook();
    currentTab = tab.id;
    showPreview(tab.id);
    console.log(user.currentMonkeyId);
}));

function showPreview(tabId) {
    tabs.forEach(tab => tab.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");

    let previewBox = document.getElementById("preview-box");
    previewBox.innerHTML = "";
    if (tabId === "hat") {
        previewBox.innerHTML = `
            <h2>Hat Shop Items</h2>
            <div class="shop-item-container">
                <div class="shop-item">
                    <img src="images/hat_1.png" alt="Hat 1" id="hat 1"/>
                    <h4>Top Hat</h4>
                    <h5>10 Points</h5>
                    <button class="select-btn">Select</button>
                </div>
                <div class="shop-item">
                    <img src="images/hat_2.png" alt="Hat 2" id="hat 2"/>
                    <h4>Wizard Hat</h4>
                    <h5>10 Points</h5>
                    <button class="select-btn">Select</button>
                </div>
                <div class="shop-item">
                    <img src="images/hat_3.png" alt="Hat 3" id="hat 3"/>
                    <h4>Cowboy Hat</h4>
                    <h5>10 Points</h5>
                    <button class="select-btn">Select</button>
                </div>
            </div>
             <button class="buy-btn" id="buy-btn" disabled="disabled">Buy</button>
             <h4 id="error-text"></h4>`;
    } else if (tabId === "monkey") {
        previewBox.innerHTML = `
            <h2>Monkey Type</h2>
            <div class="shop-item-container">
                <div class="shop-item">
                    <img src="images/monkey_1.png" alt="monkey 1" id="monkey 1"/>
                    <h4>Monkey 1</h4>
                    <h5>10 Points</h5>
                    <button class="select-btn">Select</button>
                </div>
            </div>
            <button class="buy-btn" id="buy-btn" disabled="disabled">Buy</button>
            <h4 id="error-text"></h4>`;
        if(user.currentMonkeyId && document.getElementById(user.currentMonkeyId)){
            document.getElementById(user.currentMonkeyId).parentElement.classList.add("selected");
        } else if (user.currentHat && document.getElementById(user.currentHat)){
            document.getElementById(user.currentHat).parentElement.classList.add("selected");
        }
    }



    document.querySelectorAll('.shop-item').forEach(item => {
        const itemName = item.querySelector('img');
        const itemPrice = item.querySelector('h4');
        const itemPoints = item.querySelector('h5');

        if (currentShopItem.includes(itemName.id)) {
            item.classList.add('purchased');
            itemPrice.innerHTML = itemPrice.innerHTML + " (Owned)";
            itemPoints.innerHTML = "";
        } else {
            item.classList.remove('purchased');
        }


    });

    const selectButtons = document.querySelectorAll(".select-btn");
    selectButtons.forEach(button => {
        button.addEventListener("click", (event) => {

            document.querySelectorAll('.shop-item').forEach(item => {
                item.classList.remove('selected');
            });

            const selectedItem = event.target.parentElement;
            selectedItem.classList.add('selected');


            if (currentShopItem.includes(selectedItem.querySelector('img').id)) {
                document.getElementById("buy-btn").disabled = true;
                changeLook(selectedItem.querySelector('img').id, currentTab);
            } else {
                document.getElementById("buy-btn").disabled = false;
                if(currentTab === "hat"){
                    curChar.src = monkeyLookTemp(user.currentMonkeyId, selectedItem.querySelector('img').id);
                } else if (currentTab === "monkey"){
                    curChar.src = monkeyLookTemp(selectedItem.querySelector('img').id, user.currentHat);
                }
            }
        });
    });

    document.getElementById("buy-btn").addEventListener("click", () => {
        const selectedItem = document.querySelector('.shop-item.selected');
        if (selectedItem) {
            const itemName = selectedItem.querySelector('img').id;
            buyItem(itemName);
            console.log(itemName);

        } else {
            alert("Please select an item first.");
        }
    });
}
async function changeLook(itemId, part) {
    let formData = new FormData();
    formData.append("itemId", itemId);
    formData.append("part", part);
    formData.append("userId", user.id);
    formData.append("sendCurItems", currentShopItem);

    try {
        const serverResponse = await fetch(`/api/changeLook`, {
            method: "POST",
            body: formData
        })

        const result = await serverResponse.json();
        const resultChange = result.change;
        if(resultChange === "Success"){
            let userOld = JSON.parse(localStorage.getItem("user"))
            if(currentTab === "hat"){
                userOld.currentHat = itemId;
            } else if (currentTab === "monkey"){
                userOld.currentMonkeyId = itemId;
            }
            localStorage.setItem("user", JSON.stringify(userOld));

            curChar.src = monkeyLook();
        }
        console.log(result);
    } catch (error) {
        console.error("Error occurred:", error);
    }
}


async function buyItem(itemId) {
    let formData = new FormData();
    formData.append("itemId", itemId);
    formData.append("userId", user.id);
    formData.append("sendCurItems", currentShopItem);
    const errorText = document.getElementById("error-text");
    try {
        const serverResponse = await fetch(`/api/buyItem`, {
            method: "POST",
            body: formData
        });

        const resultData = await serverResponse.json();
        const purchaseResponse = resultData.purchase;
        console.log(purchaseResponse);
        console.log(resultData);
        if(purchaseResponse === "Purchase successful"){
            errorText.innerHTML = purchaseResponse
            errorText.style.color = "green"
            currentShopItem.push(itemId);
            let userOld = JSON.parse(localStorage.getItem("user"))
            userOld.shopItems = currentShopItem
            if(currentTab === "hat"){
                userOld.points -= 10;
            } else if (currentTab === "monkey"){
                userOld.points -= 20;
            }
            localStorage.setItem("user", JSON.stringify(userOld));
            document.getElementById(itemId).classList.add("selected");
            console.log(userOld)
        }
        else if(purchaseResponse === "Not enough points" || purchaseResponse === "Item already owned"){
            errorText.innerHTML = purchaseResponse
            errorText.style.color = "red"
        } else {
            errorText.innerHTML = "Error occurred. Please logout and login back in."
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}