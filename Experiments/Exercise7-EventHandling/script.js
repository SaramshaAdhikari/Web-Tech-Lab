let portfolioClicks = 0;
let cartItems = 0;

const portfolioCta = document.getElementById("portfolio-cta");
const portfolioClickResult = document.getElementById("portfolio-click-result");

const profileHoverBox = document.getElementById("profile-hover-box");
const portfolioHoverResult = document.getElementById("portfolio-hover-result");

const contactNameInput = document.getElementById("contact-name");
const portfolioInputResult = document.getElementById("portfolio-input-result");

const addToCartButton = document.getElementById("add-to-cart");
const cartResult = document.getElementById("cart-result");

const shippingSelect = document.getElementById("shipping-method");
const shippingResult = document.getElementById("shipping-result");

const couponInput = document.getElementById("coupon");
const couponResult = document.getElementById("coupon-result");
const clearCouponButton = document.getElementById("clear-coupon");

portfolioCta.addEventListener("click", function () {
    portfolioClicks += 1;
    portfolioClickResult.textContent = "CTA clicks: " + portfolioClicks;
});

profileHoverBox.addEventListener("mouseenter", function () {
    profileHoverBox.classList.add("active");
    portfolioHoverResult.textContent = "Status: hover detected";
});

profileHoverBox.addEventListener("mouseleave", function () {
    profileHoverBox.classList.remove("active");
    portfolioHoverResult.textContent = "Status: hover ended";
});

contactNameInput.addEventListener("input", function (event) {
    const value = event.target.value.trim();
    portfolioInputResult.textContent = "Live preview: " + (value || "-");
});

addToCartButton.addEventListener("click", function () {
    cartItems += 1;
    cartResult.textContent = "Items in cart: " + cartItems;
});

shippingSelect.addEventListener("change", function (event) {
    const value = event.target.value;
    shippingResult.textContent = "Selected shipping: " + (value || "not selected");
});

couponInput.addEventListener("input", function (event) {
    const coupon = event.target.value.trim();
    couponResult.textContent = "Coupon state: " + (coupon ? "typing - " + coupon : "waiting");
});

clearCouponButton.addEventListener("dblclick", function () {
    couponInput.value = "";
    couponResult.textContent = "Coupon state: cleared by double-click";
});
