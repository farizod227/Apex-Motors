/* ============================================================
   ДОБАВЛЯЙТЕ МАШИНЫ И ЦВЕТА ЗДЕСЬ.
   price       — базовая цена (цена первого цвета).
   colors      — список цветов. Для каждого:
       n     — название цвета
       c     — цвет кружка (black, silver, red, blue, white, gray, brown, green или любой hex)
       photo — фото машины именно в этом цвете, например "img/g63-red.png"
       plus  — доплата за цвет в $ (0 = без доплаты). Итоговая цена = price + plus
   stock       — сколько в наличии. 1 = бейдж «Остался 1».
   ============================================================ */

// Куда уходят заявки из формы. Вариант 1: адрес приёмника (Formspree, Make, свой сервер) — заявка уйдёт туда JSON-ом.
const ORDER_ENDPOINT = "";
// Вариант 2 (если ORDER_ENDPOINT пуст): откроется ваш Telegram/WhatsApp с готовым текстом заявки.
const PHONE_LINK = "https://t.me/your_username";

const COLORS = {black:"#15151a", silver:"#b5b5bd", red:"#a5192b", blue:"#1f4fb8", white:"#ececf0", green:"#1c5a3f", gray:"#5a5c66", brown:"#4a3f3c"};

const DATA = {
  "Mercedes": [
    {name:"Mercedes-AMG G 63", eng:"4.0 V8 Biturbo · 585 л.с.", price:185000, stock:3, tag:"MERCEDES-AMG · 2026",
     desc:"Легендарный внедорожник с 4.0-литровым V8 Biturbo мощностью 585 л.с. Разгон до 100 км/ч за 4,5 с, адаптивная подвеска и салон ручной сборки AMG.",
     colors:[
       {n:"Obsidian Black", c:"black",  photo:"img/g63.png",        plus:0},
       {n:"Iridium Silver", c:"silver", photo:"img/g63-silver.png", plus:1500},
       {n:"Rubellite Red",  c:"red",    photo:"img/g63-red.png",    plus:3500},
       {n:"Blue",           c:"blue",   photo:"img/g63-blue.png",   plus:2500}]},
    {name:"Mercedes-Benz S 580", eng:"4.0 V8 · 503 л.с.", price:128000, stock:2, tag:"MERCEDES-BENZ · 2026",
     desc:"Флагманский седан с V8 и мягким гибридным приводом. Пневмоподвеска, массажные сиденья и салон уровня бизнес-класса.",
     colors:[
       {n:"Obsidian Black", c:"black",  photo:"img/s580.png",        plus:0},
       {n:"Silver",         c:"silver", photo:"img/s580-silver.png", plus:1000}]},
    {name:"Mercedes-AMG GT 63", eng:"4.0 V8 Biturbo · 577 л.с.", price:172000, stock:1, tag:"MERCEDES-AMG · 2026",
     desc:"Спорткар с характером гонщика: полный привод, 577 л.с. и разгон до 100 км/ч за 3,2 с.",
     colors:[
       {n:"Selenite Gray", c:"gray",  photo:"img/gt63.png",       plus:0},
       {n:"Black",         c:"black", photo:"img/gt63-black.png", plus:1500},
       {n:"Red",           c:"red",   photo:"img/gt63-red.png",   plus:2500}]},
    {name:"Mercedes-Maybach S 680", eng:"6.0 V12 Biturbo · 621 л.с.", price:265000, stock:1, tag:"MAYBACH · 2026",
     desc:"Вершина линейки: V12, задние кресла с раскладкой и максимальный комфорт.",
     colors:[
       {n:"Black",  c:"black", photo:"img/maybach-s680.png",  plus:0},
       {n:"White",  c:"white", photo:"img/maybach-white.png", plus:2000}]},
    {name:"Mercedes-Benz EQS 580", eng:"Электро · 523 л.с.", price:118000, stock:4, tag:"EQ · 2026",
     desc:"Электрический лифтбек с запасом хода более 600 км и панорамным экраном Hyperscreen.",
     colors:[
       {n:"Graphite Gray", c:"gray",   photo:"img/eqs580.png",        plus:0},
       {n:"Silver",        c:"silver", photo:"img/eqs580-silver.png", plus:1000},
       {n:"Blue",          c:"blue",   photo:"img/eqs580-blue.png",   plus:1500}]},
    {name:"Mercedes-AMG SL 63", eng:"4.0 V8 Biturbo · 585 л.с.", price:198000, stock:2, tag:"MERCEDES-AMG · 2026",
     desc:"Родстер с мягкой крышей, полным приводом и V8 — для тех, кто любит ветер.",
     colors:[
       {n:"Black",  c:"black",  photo:"img/sl63.png",        plus:0},
       {n:"Silver", c:"silver", photo:"img/sl63-silver.png", plus:1500},
       {n:"Red",    c:"red",    photo:"img/sl63-red.png",    plus:2500}]}
  ],
  "BMW": [
    {name:"BMW M5 Competition", eng:"4.4 V8 · 625 л.с.", price:142000, stock:2, tag:"BMW M · 2026",
     desc:"Седан-легенда: полный привод xDrive, 625 л.с., разгон до 100 км/ч за 3,3 с.",
     colors:[
       {n:"Black", c:"black", photo:"img/m5.png",       plus:0},
       {n:"Blue",  c:"blue",  photo:"img/m5-blue.png",  plus:2500},
       {n:"White", c:"white", photo:"img/m5-white.png", plus:0}]},
    {name:"BMW X7 M60i", eng:"4.4 V8 · 530 л.с.", price:121000, stock:3, tag:"BMW X · 2026",
     desc:"Семиместный флагман с V8, пневмоподвеской и премиальным салоном.",
     colors:[
       {n:"Black", c:"black", photo:"img/x7.png",      plus:0},
       {n:"Gray",  c:"gray",  photo:"img/x7-gray.png", plus:1500}]},
    {name:"BMW i7 xDrive60", eng:"Электро · 544 л.с.", price:135000, stock:1, tag:"BMW i · 2026",
     desc:"Электрический седан представительского класса с 31-дюймовым экраном для пассажиров сзади.",
     colors:[
       {n:"Matte Brown", c:"brown", photo:"img/i7.png",       plus:0},
       {n:"White",       c:"white", photo:"img/i7-white.png", plus:1000}]}
  ],
  "Porsche": [
    {name:"Porsche 911 Carrera S", eng:"3.0 Boxer · 480 л.с.", price:165000, stock:2, tag:"PORSCHE · 2026",
     desc:"Классика спорткаров: оппозитный двигатель, заднемоторная компоновка и точное управление.",
     colors:[
       {n:"Black",  c:"black",  photo:"img/911.png",        plus:0},
       {n:"Red",    c:"red",    photo:"img/911-red.png",    plus:1200},
       {n:"Silver", c:"silver", photo:"img/911-silver.png", plus:800}]},
    {name:"Porsche Cayenne Turbo GT", eng:"4.0 V8 · 640 л.с.", price:189000, stock:1, tag:"PORSCHE · 2026",
     desc:"Самый быстрый кроссовер бренда: 640 л.с. и разгон до 100 км/ч за 3,3 с.",
     colors:[
       {n:"Gray",  c:"gray",  photo:"img/cayenne.png",       plus:0},
       {n:"Black", c:"black", photo:"img/cayenne-black.png", plus:1500}]},
    {name:"Porsche Taycan Turbo S", eng:"Электро · 761 л.с.", price:198000, stock:2, tag:"PORSCHE · 2026",
     desc:"Электрический спорткар: 761 л.с. и запас хода до 500 км.",
     colors:[
       {n:"Gray",  c:"gray",  photo:"img/taycan.png",       plus:0},
       {n:"White", c:"white", photo:"img/taycan-white.png", plus:1500}]}
  ]
};
