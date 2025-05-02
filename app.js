
let users = JSON.parse(localStorage.getItem("users")) || {
    "admin": { password: "admin123", role: "admin", tasks: {} },
    "user1": { password: "1234", role: "user", tasks: ["کار ۱", "کار ۲"] }
};

let taskStatus = JSON.parse(localStorage.getItem("taskStatus")) || {};

function saveAll() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("taskStatus", JSON.stringify(taskStatus));
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const user = users[username];
    if (!user || user.password !== password) {
        alert("نام کاربری یا رمز اشتباه است.");
        return;
    }
    localStorage.setItem("currentUser", username);
    showDashboard(username, user);
}

function showDashboard(username, user) {
    const app = document.getElementById("app");
    app.innerHTML = `<h3>خوش آمدید، ${username}</h3>
                     <button onclick="logout()">🚪 خروج از حساب</button>`;

    if (user.role === "admin") {
        app.innerHTML += `
            <button onclick="showAddUser()">➊ افزودن کاربر جدید</button>
            <button onclick="showAddTask()">➋ افزودن وظیفه به کاربران</button>
            <button onclick="showAllTasks()">➌ دیدن وظایف کاربران</button>
            <div id="adminContent"></div>
        `;
    } else {
        app.innerHTML += "<h4>وظایف شما</h4>";
        user.tasks.forEach((t, i) => {
            const status = (taskStatus[username] && taskStatus[username][i]) || "در انتظار";
            app.innerHTML += `<div class='task'>
                ${t} <br> <strong>وضعیت: ${status}</strong><br>
                <button onclick="markTask('${username}', ${i}, '✅ انجام شد')">✅ انجام شد</button>
                <button onclick="markTask('${username}', ${i}, '❌ انجام نشد')">❌ انجام نشد</button>
            </div>`;
        });
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

function markTask(user, index, status) {
    if (!taskStatus[user]) taskStatus[user] = {};
    taskStatus[user][index] = status;
    saveAll();
    showDashboard(user, users[user]);
}

function showAddUser() {
    document.getElementById("adminContent").innerHTML = `
        <h4>افزودن کاربر جدید</h4>
        <input id="newUser" placeholder="نام کاربر">
        <input id="newPass" placeholder="رمز">
        <button onclick="addUser()">افزودن</button>
    `;
}

function addUser() {
    const name = document.getElementById("newUser").value;
    const pass = document.getElementById("newPass").value;
    if (users[name]) {
        alert("این کاربر وجود دارد.");
        return;
    }
    users[name] = { password: pass, role: "user", tasks: [] };
    saveAll();
    alert("کاربر اضافه شد.");
}

function showAddTask() {
    let html = "<h4>افزودن وظیفه</h4>";
    for (let name in users) {
        if (users[name].role === "user") {
            html += `<div>${name} - <button onclick="addTask('${name}')">افزودن وظیفه</button></div>`;
        }
    }
    document.getElementById("adminContent").innerHTML = html;
}

function addTask(name) {
    const task = prompt("عنوان وظیفه برای " + name + ":");
    if (task) {
        users[name].tasks.push(task);
        saveAll();
        alert("وظیفه اضافه شد.");
    }
}

function showAllTasks() {
    let html = "<h4>لیست وظایف کاربران</h4>";
    for (let name in users) {
        if (users[name].role === "user") {
            html += `<strong>${name}</strong><ul>`;
            users[name].tasks.forEach((t, i) => {
                const status = (taskStatus[name] && taskStatus[name][i]) || "در انتظار";
                html += `<li>${t} — <em>${status}</em></li>`;
            });
            html += "</ul>";
        }
    }
    document.getElementById("adminContent").innerHTML = html;
}

window.onload = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser && users[currentUser]) {
        showDashboard(currentUser, users[currentUser]);
    }
};
