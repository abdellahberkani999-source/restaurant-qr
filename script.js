import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// Firebase
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyCWRe2PtIG1SMZ5WovXMvNSBQQXlHNW6p8",
    authDomain: "restaurant-mena.firebaseapp.com",
    projectId: "restaurant-mena",
    storageBucket: "restaurant-mena.firebasestorage.app",
    messagingSenderId: "280029436673",
    appId: "1:280029436673:web:e6a5766c23d3231219d900",
    measurementId: "G-9HDG7G6D6N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ===============================
// المنتجات
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

    const params =
        new URLSearchParams(window.location.search);

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
// فلترة
// ===============================

window.filterCategory = function(category) {

    displayProducts(category);

};


// ===============================
// إضافة للسلة
// ===============================

window.addToCart = function(productId) {

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

};


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

window.openCart = function() {

    renderCart();

    document
        .getElementById("cartModal")
        .classList.add("active");

};


// ===============================
// إغلاق السلة
// ===============================

window.closeCart = function() {

    document
        .getElementById("cartModal")
        .classList.remove("active");

};


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

                <button
                    onclick="changeQuantity(${item.id}, -1)"
                >
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    onclick="changeQuantity(${item.id}, 1)"
                >
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

window.changeQuantity = function(productId, change) {

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

};


// ===============================
// إرسال الطلب إلى Firestore
// ===============================

window.sendOrder = async function() {

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

    const order = {

        table: table,

        items: cart.map(item => ({

            name: item.name,

            price: item.price,

            quantity: item.quantity

        })),

        total: total,

        status: "جديد",

        createdAt: new Date()

    };

    try {

        const docRef =
            await addDoc(
                collection(db, "orders"),
                order
            );

        cart = [];

        updateCart();

        closeCart();

        alert(
            `تم إرسال طلبك بنجاح ✅\nرقم الطلب: ${docRef.id}`
        );

    } catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء إرسال الطلب. تأكد من اتصال الإنترنت."
        );

    }

};


// ===============================
// لوحة الإدارة
// ===============================

async function loadOrders() {

    const container =
        document.getElementById("orders");

    if (!container) return;

    try {

        const ordersQuery =
            query(
                collection(db, "orders"),
                orderBy("createdAt", "desc")
            );

        const snapshot =
            await getDocs(ordersQuery);

        if (snapshot.empty) {

            container.innerHTML =
                '<div class="empty">لا توجد طلبات حالياً.</div>';

            return;

        }

        container.innerHTML = "";

        snapshot.forEach(orderDoc => {

            const order =
                orderDoc.data();

            const card =
                document.createElement("div");

            card.className = "order-card";

            card.innerHTML = `

                <div class="order-top">

                    <div>

                        <h3>
                            الطلب #${orderDoc.id.slice(0, 6)}
                        </h3>

                        <p>
                            🪑 الطاولة: ${order.table}
                        </p>

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
                        onclick="changeOrderStatus('${orderDoc.id}', 'قيد التحضير')"
                    >
                        👨‍🍳 قيد التحضير
                    </button>

                    <button
                        onclick="changeOrderStatus('${orderDoc.id}', 'جاهز')"
                    >
                        ✅ جاهز
                    </button>

                    <button
                        onclick="changeOrderStatus('${orderDoc.id}', 'تم التسليم')"
                    >
                        📦 تم التسليم
                    </button>

                </div>

            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML =
            '<div class="empty">حدث خطأ في تحميل الطلبات.</div>';

    }

}


// ===============================
// تغيير حالة الطلب
// ===============================

window.changeOrderStatus =
    async function(orderId, status) {

        try {

            await updateDoc(
                doc(db, "orders", orderId),
                {
                    status: status
                }
            );

            loadOrders();

        } catch (error) {

            console.error(error);

            alert(
                "تعذر تغيير حالة الطلب."
            );

        }

    };


// ===============================
// حذف الطلبات
// ===============================

window.clearOrders = function() {

    alert(
        "الحذف الجماعي سنضيفه لاحقاً بطريقة آمنة."
    );

};


// ===============================
// تشغيل الصفحة
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function() {

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

        if (
            document.getElementById("orders")
        ) {

            loadOrders();

            setInterval(
                loadOrders,
                5000
            );

        }

    }
);