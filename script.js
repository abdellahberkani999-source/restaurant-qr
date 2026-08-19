// ===============================
// بيانات المنتجات
// ===============================

const products = [

    {
        id: 1,
        name: "بيتزا مارغريتا",
        description: "طماطم، جبن، زيتون",
        price: 700,
        category: "pizza",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
    },

    {
        id: 2,
        name: "بيتزا دجاج",
        description: "دجاج، جبن، فلفل",
        price: 900,
        category: "pizza",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
    },

    {
        id: 3,
        name: "برغر كلاسيك",
        description: "لحم، جبن، خس، طماطم",
        price: 800,
        category: "burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
    },

    {
        id: 4,
        name: "تشيز برغر",
        description: "لحم، جبن، صوص خاص",
        price: 950,
        category: "burger",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349"
    },

    {
        id: 5,
        name: "كوكا كولا",
        description: "مشروب بارد",
        price: 150,
        category: "drink",
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e"
    },

    {
        id: 6,
        name: "عصير برتقال",
        description: "عصير برتقال طبيعي",
        price: 300,
        category: "drink",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba"
    }

];


// ===============================
// السلة
// ===============================

let cart = [];


// ===============================
// رقم الطاولة
// ===============================

function getTableNumber() {

    const params = new URLSearchParams(
        window.location.search
    );

    return params.get("table") || "1";
}


// ===============================
// عرض المنتجات
// ===============================

function displayProducts(category = "all") {

    const container =
        document.getElementById("products");

    if (!container) return;

    let filtered = products;

    if (category !== "all") {

        filtered = products.filter(
            product => product.category === category
        );

    }

    container.innerHTML = filtered.map(product => `

        <div class="product">

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="price">
                    ${product.price} دج
                </div>

                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})"
                >
                    إضافة للطلب +
                </button>

            </div>

        </div>

    `).join("");

}


// ===============================
// فلترة الأصناف
// ===============================

function filterCategory(category) {

    displayProducts(category);

}


// ===============================
// إضافة للسلة
// ===============================

function addToCart(productId) {

    const product =
        products.find(p => p.id === productId);

    const existing =
        cart.find(item => item.id === productId);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

    alert("تمت إضافة المنتج إلى الطلب ✅");

}


// ===============================
// تحديث السلة
// ===============================

function updateCart() {

    const count =
        document.getElementById("cartCount");

    if (count) {

        count.textContent =
            cart.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

    }

}


// ===============================
// فتح السلة
// ===============================

function openCart() {

    renderCart();

    document
        .getElementById("cartModal")
        .classList.add("active");

}


// ===============================
// إغلاق السلة
// ===============================

function closeCart() {

    document
        .getElementById("cartModal")
        .classList.remove("active");

}


// ===============================
// عرض السلة
// ===============================

function renderCart() {

    const container =
        document.getElementById("cartItems");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML =
            '<div class="empty">السلة فارغة 🛒</div>';

        document.getElementById("cartTotal")
            .textContent = "0 دج";

        return;

    }

    container.innerHTML = cart.map(item => `

        <div class="cart-item">

            <div>

                <strong>${item.name}</strong>

                <div>
                    ${item.price} دج
                </div>

            </div>

            <div class="quantity">

                <button onclick="changeQuantity(${item.id}, -1)">
                    −
                </button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${item.id}, 1)">
                    +
                </button>

            </div>

        </div>

    `).join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

    document.getElementById("cartTotal")
        .textContent = `${total} دج`;

}


// ===============================
// تغيير الكمية
// ===============================

function changeQuantity(productId, change) {

    const item =
        cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== productId
            );

    }

    updateCart();

    renderCart();

}


// ===============================
// إرسال الطلب
// ===============================

function sendOrder() {

    if (cart.length === 0) {

        alert("السلة فارغة!");

        return;

    }

    const table =
        getTableNumber();

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    const orders =
        JSON.parse(
            localStorage.getItem("orders") || "[]"
        );


    const order = {

        id: Date.now(),

        table: table,

        items: cart.map(item => ({

            name: item.name,

            price: item.price,

            quantity: item.quantity

        })),

        total: total,

        status: "جديد",

        date: new Date().toLocaleString("ar-DZ")

    };


    orders.push(order);


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    cart = [];

    updateCart();

    closeCart();


    alert(
        `تم إرسال طلبك بنجاح ✅\nرقم الطلب: #${order.id}`
    );

}


// ===============================
// لوحة الإدارة
// ===============================

function loadOrders() {

    const container =
        document.getElementById("orders");

    if (!container) return;


    const orders =
        JSON.parse(
            localStorage.getItem("orders") || "[]"
        );


    if (orders.length === 0) {

        container.innerHTML =
            '<div class="empty">لا توجد طلبات حالياً.</div>';

        return;

    }


    container.innerHTML =
        orders
        .slice()
        .reverse()
        .map(order => `

        <div class="order-card">

            <div class="order-top">

                <div>

                    <h3>
                        الطلب #${order.id}
                    </h3>

                    <p>
                        🪑 الطاولة: ${order.table}
                    </p>

                    <small>
                        ${order.date}
                    </small>

                </div>

                <span class="order-status">
                    ${order.status}
                </span>

            </div>


            <hr>


            ${order.items.map(item => `

                <div class="order-product">

                    ${item.quantity} ×
                    ${item.name}

                    —
                    ${item.price * item.quantity}
                    دج

                </div>

            `).join("")}


            <hr>


            <strong>
                المجموع: ${order.total} دج
            </strong>


            <div class="status-buttons">

                <button
                    onclick="changeOrderStatus(${order.id}, 'قيد التحضير')"
                >
                    👨‍🍳 قيد التحضير
                </button>

                <button
                    onclick="changeOrderStatus(${order.id}, 'جاهز')"
                >
                    ✅ جاهز
                </button>

                <button
                    onclick="changeOrderStatus(${order.id}, 'تم التسليم')"
                >
                    📦 تم التسليم
                </button>

            </div>

        </div>

    `).join("");

}


// ===============================
// تغيير حالة الطلب
// ===============================

function changeOrderStatus(orderId, status) {

    const orders =
        JSON.parse(
            localStorage.getItem("orders") || "[]"
        );


    const order =
        orders.find(
            order => order.id === orderId
        );


    if (!order) return;


    order.status = status;


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    loadOrders();

}


// ===============================
// حذف الطلبات
// ===============================

function clearOrders() {

    if (
        confirm(
            "هل تريد حذف جميع الطلبات؟"
        )
    ) {

        localStorage.removeItem("orders");

        loadOrders();

    }

}


// ===============================
// تشغيل الصفحة
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // صفحة المنيو

        if (
            document.getElementById("products")
        ) {

            const table =
                getTableNumber();

            document.getElementById(
                "tableNumber"
            ).textContent =
                `🪑 الطاولة ${table}`;

            displayProducts();

            updateCart();

        }


        // لوحة الإدارة

        if (
            document.getElementById("orders")
        ) {

            loadOrders();

            setInterval(
                loadOrders,
                3000
            );

        }

    }
);