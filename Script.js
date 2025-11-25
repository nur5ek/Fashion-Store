// Product data
const PRODUCTS = [
{ id: 1, title: "Leather Jacket", price: 149, cat: "men", img: "https://images.unsplash.com/photo-1514996937319-344454492b37" },
{ id: 2, title: "Floral Dress", price: 89, cat: "women", img: "https://images.unsplash.com/photo-1520975916669-3f3971f4b6d7" },
{ id: 3, title: "Hat", price: 25, cat: "accessories", img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb" }
];


const grid = document.getElementById("products-grid");
const filter = document.getElementById("filter");


function render(list) {
grid.innerHTML = "";
list.forEach(p => {
grid.innerHTML += `
<div class="product">
<img src="${p.img}" />
<div class="product-title">${p.title}</div>
<div class="product-price">$${p.price}</div>
</div>
`;
});
}


filter.addEventListener("change", () => {
const v = filter.value;
render(v === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === v));
});


render(PRODUCTS);


// Carousel
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("dots");
let index = 0;


slides.forEach((_, i) => {
const dot = document.createElement("div");
dot.classList.add("dot");
if (i === 0) dot.classList.add("active");
dot.addEventListener("click", () => showSlide(i));
dotsContainer.appendChild(dot);
});


function showSlide(i) {
slides.forEach(s => s.classList.add("hidden"));
slides[i].classList.remove("hidden");
document.querySelectorAll(".dot").forEach(d => d.classList.remove("active"));
document.querySelectorAll(".dot")[i].classList.add("active");
index = i;
}


setInterval(() => {
index = (index + 1) % slides.length;
showSlide(index);
}, 4000);