/* ===== NAVIGATION ===== */
function goPage(val){
    if(val) window.location.href = val;
}

/* ===== LIMITS ===== */
const limits = {
    favorites:{limit:200,time:3600000},
    likes:{limit:500,time:43200000},
    views:{limit:1000,time:1800000},
    followers:{limit:100,time:72000000}
};

/* ===== ORDERS ===== */
let orders = JSON.parse(localStorage.getItem("orders")) || [];

/* ===== ADD ORDER ===== */
function addOrder(e){
    e.preventDefault();

    let link = document.getElementById("link").value;
    let service = document.getElementById("service").value;
    let qty = parseInt(document.getElementById("qty").value);
    let msg = document.getElementById("msg");

    if(!link.includes("tiktok.com")){
        msg.innerText = "❌ الرابط لازم يكون من تيك توك فقط";
        return;
    }

    let now = Date.now();
    let recent = orders.filter(o => 
        o.service === service && (now - o.time) < limits[service].time
    );

    let total = recent.reduce((a,b)=>a+b.qty,0);

    if(total + qty > limits[service].limit){
        msg.innerText = "❌ وصلت للحد المسموح للخدمة دي";
        return;
    }

    orders.push({
        service,
        qty,
        link,
        status:"pending",
        time:now
    });

    localStorage.setItem("orders",JSON.stringify(orders));
    msg.innerText = "✅ تم إرسال الطلب بنجاح";
    e.target.reset();
}

/* ===== SHOW MY ORDERS ===== */
function loadMyOrders(){
    const box = document.getElementById("orders");
    box.innerHTML = "";

    if(orders.length === 0){
        box.innerHTML = "<p>لا يوجد طلبات</p>";
        return;
    }

    orders.forEach(o=>{
        const div = document.createElement("div");
        div.className = "box";
        div.innerHTML = `
            <p>الخدمة: ${o.service}</p>
            <p>الكمية: ${o.qty}</p>
            <p>الحالة: <span class="${o.status}">${o.status}</span></p>
        `;
        box.appendChild(div);
    });
}

/* ===== ADMIN LOGIN ===== */
function adminLogin(){
    const pass = document.getElementById("adminPass").value;
    if(pass === "Light@2882011"){
        localStorage.setItem("admin","true");
        loadAdmin();
    }else{
        alert("❌ باسورد غلط");
    }
}

/* ===== ADMIN PAGE ===== */
function loadAdmin(){
    const lockDiv = document.getElementById("lock");
    const adminBox = document.getElementById("adminOrders");

    if(localStorage.getItem("admin") !== "true"){
        lockDiv.style.display = "block";
        adminBox.style.display = "none";
        return;
    }

    lockDiv.style.display = "none";
    adminBox.style.display = "block";
    adminBox.innerHTML = "";

    if(orders.length === 0){
        adminBox.innerHTML = "<p>لا يوجد طلبات حالياً</p>";
        return;
    }

    orders.forEach((o,i)=>{
        const div = document.createElement("div");
        div.className = "box";
        div.innerHTML = `
            <p>الخدمة: ${o.service}</p>
            <p>الكمية: ${o.qty}</p>
            <p>الرابط: ${o.link}</p>
            <p>الحالة: <span class="${o.status}">${o.status}</span></p>
            <button onclick="toggleStatus(${i})">تغيير الحالة</button>
        `;
        adminBox.appendChild(div);
    });
}

function toggleStatus(i){
    orders[i].status = orders[i].status === "pending" ? "completed":"pending";
    localStorage.setItem("orders",JSON.stringify(orders));
    loadAdmin();
}

