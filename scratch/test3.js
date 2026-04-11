const { JSDOM } = require('jsdom');
const fs = require('fs');

const ui = fs.readFileSync('public/js/ui.js', 'utf8');
const lang = fs.readFileSync('public/js/language.js', 'utf8');
const cartJs = fs.readFileSync('public/js/cart.js', 'utf8');

const html = '<div id="cart-modal"></div><button id="modal-add-btn"></button><div id="product-modal"></div><button id="cart-btn"></button>';

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/menu/ramallah' });

dom.window.eval(lang);
dom.window.eval(cartJs);
dom.window.eval(ui);

const script = `
  try {
     Lang.current = 'en'; 
     window.branchSlug = 'ramallah';
     window.currency = 'ILS';
     
     console.log('Test 1: Render Product Modal');
     UI.renderProductModal({
         id: 1, nameAr: 'Test', nameEn: 'Test', sizes: [], types: [], addonGroups: [], basePrice: 10, discount: 0
     }, [], 'ramallah', 'ILS', 0);
     console.log('Product Modal Rendered OK');
     
     console.log('Test 2: Render Cart Modal');
     UI.renderCartModal('ramallah', 'ILS');
     console.log('Cart Rendered OK');
  } catch(e) {
     console.log('ERROR OCCURRED', e.message);
     console.log(e.stack);
  }
`;

dom.window.eval(script);
