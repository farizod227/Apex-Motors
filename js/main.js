const $ = s => document.querySelector(s);
const fmt = n => "$" + n.toLocaleString("en-US");
const swatch = c => COLORS[c] || c;
const priceOf = (car, k) => car.price + car.colors[k].plus;
let brand = Object.keys(DATA)[0];
const uploads = {}; // фото из «browse files» (только на время сессии)

function photoBox(car, k, big){
  const src = uploads[car.name + "|" + k] || car.colors[k].photo;
  const id = "f" + Math.random().toString(36).slice(2);
  if(src) return `<div class="ph has" id="${big?'mph':''}"><img src="${src}" alt="${car.name}, ${car.colors[k].n}"></div>`;
  return `<div class="ph" id="${big?'mph':''}"><div>Фото: ${car.name}, ${car.colors[k].n}<br>or <label for="${id}" onclick="event.stopPropagation()">browse files</label>
  <input id="${id}" type="file" accept="image/*" hidden data-car="${car.name}" data-k="${k}"></div></div>`;
}

function renderTabs(){
  $("#tabs").innerHTML = Object.keys(DATA).map(b =>
    `<button class="tab" role="tab" aria-selected="${b===brand}" data-b="${b}">${b}</button>`).join("");
}
function renderGrid(){
  const list = DATA[brand];
  $("#title").textContent = brand === "Mercedes" ? "Mercedes-Benz" : brand;
  $("#count").textContent = `${list.length} моделей в салоне`;
  $("#grid").innerHTML = list.map((c,i) => `
    <article class="card" tabindex="0" data-i="${i}">
      ${c.stock===1?'<div class="badge">Остался 1</div>':''}
      ${photoBox(c,0,false)}
      <h3>${c.name}</h3>
      <div class="spec">${c.eng}</div>
      <div class="dots">${c.colors.map(col=>`<i title="${col.n}" style="background:${swatch(col.c)}"></i>`).join("")}</div>
      <div class="row"><div class="price">${fmt(c.price)}</div><button class="btn" data-order="${i}">Заказать</button></div>
    </article>`).join("");
}

function openModal(i, k=0){
  const c = DATA[brand][i], m = $("#modal");
  m.dataset.i = i; m.dataset.k = k; m.dataset.mode = "info";
  m.innerHTML = `
    <button class="x" aria-label="Закрыть" id="close">✕</button>
    ${photoBox(c,k,true)}
    <div class="info">
      <div class="brand">${c.tag||brand.toUpperCase()}</div>
      <h2>${c.name}</h2><div class="price" id="mprice">${fmt(priceOf(c,k))}</div>
      <p>${c.desc}</p>
      <div class="stock ${c.stock===1?'low':''}">В наличии: <b>${c.stock} шт.</b></div>
      <div class="colors">Цвет: <b id="cname" style="color:var(--text)">${c.colors[k].n}</b>
        <span id="cplus" class="plus">${c.colors[k].plus?`+${fmt(c.colors[k].plus)} за цвет`:""}</span>
        <div class="sw">${c.colors.map((col,j)=>`<button data-c="${j}" aria-label="${col.n}" aria-pressed="${j===k}" style="background:${swatch(col.c)}"></button>`).join("")}</div></div>
      <button class="btn" data-order="${i}" data-modal="1">Заказать</button>
    </div>`;
  $("#ov").classList.add("open");
  $("#close").focus();
}
function selectColor(j){
  const m = $("#modal"), c = DATA[brand][+m.dataset.i];
  m.dataset.k = j;
  $("#mph").outerHTML = photoBox(c,j,true);
  $("#mprice").textContent = fmt(priceOf(c,j));
  $("#cname").textContent = c.colors[j].n;
  $("#cplus").textContent = c.colors[j].plus ? `+${fmt(c.colors[j].plus)} за цвет` : "";
  document.querySelectorAll(".sw button").forEach((b,n)=>b.setAttribute("aria-pressed", n===j));
}
function closeModal(){ $("#ov").classList.remove("open"); }

function openOrder(i, k=0){
  const c = DATA[brand][i], m = $("#modal");
  m.dataset.i = i; m.dataset.k = k; m.dataset.mode = "order";
  m.innerHTML = `
    <button class="x" aria-label="Закрыть" id="close">✕</button>
    ${photoBox(c,k,true)}
    <form class="info" id="oform" novalidate>
      <div class="brand">ЗАЯВКА НА ЗАКАЗ</div>
      <h2>Оформить заказ</h2>
      <div class="sum"><b>${c.name}</b>${c.colors[k].n} · ${fmt(priceOf(c,k))}</div>
      <label class="fld" id="fn">Ваше имя<input name="name" autocomplete="name" placeholder="Например, Алишер"></label>
      <label class="fld" id="fp">Телефон<input name="phone" type="tel" autocomplete="tel" placeholder="+998 90 123 45 67"></label>
      <label class="fld">Комментарий (необязательно)<textarea name="note" rows="2" placeholder="Удобное время звонка, вопросы"></textarea></label>
      <div class="err" id="err"></div>
      <button class="btn" type="submit" id="send">Отправить заявку</button>
      <button class="back" type="button" data-back="${i}" data-k="${k}">← Назад к описанию</button>
    </form>`;
  $("#ov").classList.add("open");
  m.querySelector("input").focus();
}
async function submitOrder(form){
  const m = $("#modal"), c = DATA[brand][+m.dataset.i], k = +m.dataset.k;
  const color = c.colors[k].n, price = priceOf(c,k);
  const name = form.name.value.trim(), phone = form.phone.value.trim(), note = form.note.value.trim();
  const badPhone = phone.replace(/\D/g,"").length < 9;
  $("#fn").classList.toggle("bad", !name);
  $("#fp").classList.toggle("bad", badPhone);
  if(!name || badPhone){ $("#err").textContent = "Укажите имя и телефон, чтобы мы могли связаться."; return; }
  $("#err").textContent = "";
  const order = {car:c.name, color, price, name, phone, note};
  const text = `Новая заявка\nАвто: ${c.name} (${color}), ${fmt(price)}\nИмя: ${name}\nТелефон: ${phone}${note?"\nКомментарий: "+note:""}`;
  $("#send").disabled = true; $("#send").textContent = "Отправляем…";
  let ok = true;
  try{
    if(ORDER_ENDPOINT){
      const r = await fetch(ORDER_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(order)});
      ok = r.ok;
    } else if(!PHONE_LINK.includes("your_username")){
      window.open(PHONE_LINK + "?text=" + encodeURIComponent(text), "_blank");
    } else { console.log("ЗАЯВКА (настройте ORDER_ENDPOINT):", order); }
  }catch(e){ ok = false; }
  if(!ok){ $("#err").textContent = "Не удалось отправить. Попробуйте ещё раз."; $("#send").disabled = false; $("#send").textContent = "Отправить заявку"; return; }
  m.querySelector(".info").outerHTML = `<div class="info done"><h2>Заявка отправлена</h2><p>Менеджер свяжется с вами по номеру ${phone} в ближайшее время.</p><button class="btn" id="close2">Закрыть</button></div>`;
}

document.addEventListener("click", e => {
  const t = e.target;
  if(t.dataset.b){ brand = t.dataset.b; renderTabs(); renderGrid(); return; }
  if(t.dataset.order !== undefined){ e.stopPropagation(); openOrder(+t.dataset.order, t.dataset.modal ? +$("#modal").dataset.k : 0); return; }
  if(t.dataset.back !== undefined){ openModal(+t.dataset.back, +t.dataset.k); return; }
  if(t.closest("#close") || t.id === "close2" || t === $("#ov")){ closeModal(); return; }
  if(t.dataset.c !== undefined){ selectColor(+t.dataset.c); return; }
  const card = t.closest(".card");
  if(card && !t.closest(".ph")) openModal(+card.dataset.i);
});
document.addEventListener("keydown", e => {
  if(e.key==="Escape") closeModal();
  if(e.key==="Enter" && e.target.classList.contains("card")) openModal(+e.target.dataset.i);
});
document.addEventListener("change", e => {
  const f = e.target; if(!f.dataset.car || !f.files[0]) return;
  uploads[f.dataset.car + "|" + f.dataset.k] = URL.createObjectURL(f.files[0]);
  renderGrid();
  if($("#ov").classList.contains("open")){
    const m = $("#modal"), i = +m.dataset.i, k = +m.dataset.k;
    m.dataset.mode === "order" ? openOrder(i,k) : openModal(i,k);
  }
});
document.addEventListener("submit", e => { e.preventDefault(); submitOrder(e.target); });

renderTabs(); renderGrid();
