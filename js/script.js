let currentCase = 1;

const cases = {
    1: [
        { name: "1000xp", img: "./images/20251126130114152.png", chance: 36, info: "" },
        { name: "10 гривень", img: "./images/20250907144336762.png", chance: 30, info: "" },
        { name: "WINTER", img: "./images/20251126124831228.png", chance: 10, info: "7 днів" },
        { name: "DELUXE", img: "./images/20250907150850720.png", chance: 12, info: "3 днів" },
        { name: "DELUXE+", img: "./images/20251206095721121.png", chance: 10, info: "30 днів" },
    ],
    2: [
        { name: "1000xp", img: "./images/20251126130114152.png", chance: 36, info: "" },
        { name: "10 гривень", img: "./images/20250907144336762.png", chance: 30 },
        { name: "WINTER", img: "./images/20251126124831228.png", chance: 10, info: "3 днів" },
        { name: "DELUXE", img: "./images/20250907150850720.png", chance: 12, info: "7 днів" },
        { name: "DELUXE+", img: "./images/20251206095721121.png", chance: 10, info: "10 днів" },
    ]
};

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let newItemNotification = false; // флаг для отображения значка на инвентаре

function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function openCaseMenu(id) {
    currentCase = id;
    document.getElementById("caseTitle").innerText = "КЕЙС №" + id;
    document.getElementById("caseModal").style.display = "block";
    document.getElementById("finalResult").innerHTML = "";
    const line = document.getElementById("itemsLine");
    line.style.transform = "translateX(0)";
    line.innerHTML = "";
}

function closeCaseMenu() {
    document.getElementById("caseModal").style.display = "none";
}

function getRandomItem(list) {
    let r = Math.random() * 100;
    let sum = 0;
    for (let item of list) {
        sum += item.chance;
        if (r < sum) return item;
    }
    return list[list.length - 1];
}

function rollItem() {
    const items = cases[currentCase];
    const finalItem = getRandomItem(items);
    const line = document.getElementById("itemsLine");
    line.innerHTML = "";

    // скрываем кнопку
    const rollBtn = document.getElementById("rollBtn");
    rollBtn.style.display = "none";

    let fakeList = [];
    for (let i = 0; i < 25; i++) {
        fakeList.push(items[Math.floor(Math.random() * items.length)]);
    }
    fakeList.push(finalItem);

    fakeList.forEach(item => {
        line.innerHTML += `<img src="${item.img}" alt="">`;
    });

    const shift = -((fakeList.length - 1) * 140) + 200;

    setTimeout(() => {
        line.style.transition = "transform 3s ease-out";
        line.style.transform = `translateX(${shift}px)`;
    }, 100);

    // показать результат и вернуть кнопку
    setTimeout(() => {
        inventory.push(finalItem);
        saveInventory();

        // показываем иконку уведомления на инвентаре
        newItemNotification = true;
        updateInventoryBadge();

        closeCaseMenu();

        const animDiv = document.createElement("div");
        animDiv.id = "caseResultAnimation";
        animDiv.style.position = "fixed";
        animDiv.style.top = "50%";
        animDiv.style.left = "50%";
        animDiv.style.transform = "translate(-50%, -50%)";
        animDiv.style.backgroundColor = "#333";
        animDiv.style.padding = "20px";
        animDiv.style.border = "1px solid #222";
        animDiv.style.borderRadius = "10px";
        animDiv.style.display = "flex";
        animDiv.style.flexDirection = "column";
        animDiv.style.alignItems = "center";
        animDiv.style.zIndex = "9999";

        animDiv.innerHTML = `
          <h3 style="color:#fff; margin-bottom:10px;">Выпало: ${finalItem.name}</h3>
          <img src="${finalItem.img}" width="120">
        `;

        document.body.appendChild(animDiv);

        setTimeout(() => {
            document.body.removeChild(animDiv);
            rollBtn.style.display = "inline-block"; // кнопка снова доступна
        }, 3000);
    }, 3100);
}

// Обновление значка на кнопке инвентаря
function updateInventoryBadge() {
    const invBtn = document.getElementById("inventoryBtn");
    if (!invBtn) return;
    let badge = invBtn.querySelector(".badge");
    if (!badge) {
        badge = document.createElement("span");
        badge.className = "badge";
        badge.style.position = "absolute";
        badge.style.top = "0px";
        badge.style.right = "0px";
        badge.style.backgroundColor = "red";
        badge.style.width = "10px";
        badge.style.height = "10px";
        badge.style.borderRadius = "50%";
        invBtn.style.position = "relative";
        invBtn.appendChild(badge);
    }
    badge.style.display = newItemNotification ? "block" : "none";
}

// Инвентарь
function toggleInventory() {
    const inv = document.getElementById("inventoryPanel");
    if (inv.style.display === "block") {
        inv.style.display = "none";
        return;
    }
    const container = document.getElementById("inventoryItems");
    container.innerHTML = "";
    inventory.forEach((item, index) => {
        container.innerHTML += `
          <img src="${item.img}" title="${item.name}">
          <button class="deleteBtn" onclick="deleteItem(${index})">Удалить</button>
        `;
    });
    inv.style.display = "block";

    // убираем уведомление, так как пользователь зашёл в инвентарь
    newItemNotification = false;
    updateInventoryBadge();
}

function deleteItem(index) {
    inventory.splice(index, 1);
    saveInventory();
    toggleInventory();
    toggleInventory();
}

function deleteAllItems() {
    if (!confirm("Удалить ВСЕ предметы?")) return;
    inventory = [];
    saveInventory();
    toggleInventory();
    toggleInventory();
}
