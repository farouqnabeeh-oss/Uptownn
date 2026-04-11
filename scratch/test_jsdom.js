const { JSDOM } = require('jsdom');
const fs = require('fs');
const ui = fs.readFileSync('public/js/ui.js', 'utf8');
const lang = fs.readFileSync('public/js/language.js', 'utf8');
const cartJs = fs.readFileSync('public/js/cart.js', 'utf8');

const html = '<div id="cart-modal"></div><button id="modal-add-btn"></button><div id="product-modal"></div><button id="cart-btn"></button>';

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/menu/ramallah', virtualConsole: new (require('jsdom')).VirtualConsole().sendTo(console) });
dom.window.localStorage.setItem('uptown_lang', 'en'); 
dom.window.eval(lang);
dom.window.eval(cartJs);
dom.window.eval(ui);

const script = `
  try {
     Lang.init(); 
     console.log('Lang set to:', Lang.current);
     UI.renderProductModal({
         id: 1, nameAr: 'Test', nameEn: 'Test', sizes: [], types: [], addonGroups: [], basePrice: 10, discount: 0
     }, [], 'ramallah', 'ILS', 0);
     console.log('Product Modal Rendered OK');
     UI.renderCartModal('ramallah', 'ILS');
     console.log('Cart Rendered OK');
  } catch(e) {
     console.error('ERROR OCCURRED', e.message);
     console.error(e.stack);
  }
`;
dom.window.eval(script);
