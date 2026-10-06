const products = [
  {id:1,name:"Aquadigio Alvin",category:"unisex",price:65000,notes:"Fresh • Aquatic • Masculine",badge:"BEST SELLER"},
  {id:2,name:"Zara Orchid",category:"wanita",price:60000,notes:"Floral • Fresh • Elegant",badge:"FAVORITE"},
  {id:3,name:"Dior Sauvage",category:"pria",price:70000,notes:"Bold • Masculine • Fresh",badge:"NEW"},
  {id:4,name:"White Musk Kasturi",category:"unisex",price:75000,notes:"Elegant • Soft • Clean",badge:"PREMIUM"},
  {id:5,name:"Jessica Parker",category:"wanita",price:55000,notes:"Feminine • Elegant • Floral",badge:""},
  {id:6,name:"Paco Rabanne",category:"pria",price:68000,notes:"Seductive • Luxurious • Bold",badge:""},
  {id:7,name:"D&G Light Blue",category:"wanita",price:72000,notes:"Energetic • Fresh • Vibrant",badge:"NEW"},
  {id:8,name:"Calvin Klein",category:"unisex",price:62000,notes:"Clean • Timeless • Fresh",badge:""}
];

let cart = JSON.parse(localStorage.getItem("miskulCart") || "[]");

const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");
const filter = document.getElementById("categoryFilter");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

function renderProducts(){
  const q = search.value.toLowerCase().trim();
  const cat = filter.value;
  const cards = [...grid.querySelectorAll(".product-card")];
  let visible = 0;

  cards.forEach(card => {
    const matchesCategory = cat === "all" || card.dataset.category === cat;
    const matchesSearch = card.dataset.name.includes(q) || card.dataset.notes.includes(q);
    const show = matchesCategory && matchesSearch;
    card.classList.toggle("hidden", !show);
    if(show) visible++;
  });

  document.getElementById("emptyState").classList.toggle("hidden", visible !== 0);
}

function save(){ localStorage.setItem("miskulCart", JSON.stringify(cart)); renderCart(); }

function addToCart(id){
  const item = cart.find(x => x.id === id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  save(); showToast("Produk ditambahkan ke keranjang ✓");
}

function changeQty(id,delta){
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x=>x.id!==id);
  save();
}

function renderCart(){
  const count = cart.reduce((a,b)=>a+b.qty,0);
  const total = cart.reduce((sum,item)=>{
    const p=products.find(x=>x.id===item.id); return sum+p.price*item.qty;
  },0);
  cartCount.textContent=count;
  cartTotal.textContent=rupiah(total);
  cartItems.innerHTML = cart.length ? cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-item">
      <div class="cart-thumb"></div>
      <div><h4>${p.name}</h4><small>${rupiah(p.price)} / botol</small>
        <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div>
      </div>
      <button class="remove" onclick="changeQty(${p.id},-${item.qty})">Hapus</button>
    </div>`;
  }).join("") : `<p style="text-align:center;color:#927f77;padding:50px 10px">Keranjang masih kosong.<br>Yuk pilih aroma favoritmu ✨</p>`;
}

function openCart(){cartPanel.classList.add("open");overlay.classList.add("show")}
function closeCart(){cartPanel.classList.remove("open");overlay.classList.remove("show")}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800)}

document.getElementById("cartButton").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;
document.getElementById("clearCart").onclick=()=>{cart=[];save();showToast("Keranjang dikosongkan")};
document.getElementById("checkoutButton").onclick=()=>{
  if(!cart.length){showToast("Keranjang masih kosong");return}
  const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${p.name} x${i.qty} = ${rupiah(p.price*i.qty)}`}).join("\n");
  const total=cart.reduce((s,i)=>s+products.find(x=>x.id===i.id).price*i.qty,0);
  const msg=`Halo Miskul Ihsan, saya ingin memesan:\n\n${lines}\n\nTotal: ${rupiah(total)}\n\nMohon info ketersediaan dan ongkirnya.`;
  window.open("https://wa.me/6281357855605?text="+encodeURIComponent(msg),"_blank");
};
search.addEventListener("input",renderProducts);
filter.addEventListener("change",renderProducts);

document.querySelector(".menu-toggle").onclick=()=>document.getElementById("mainNav").classList.toggle("active");
document.querySelectorAll("#mainNav a").forEach(a=>a.onclick=()=>document.getElementById("mainNav").classList.remove("active"));

renderProducts();
renderCart();
