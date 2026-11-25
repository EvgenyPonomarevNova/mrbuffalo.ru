(() => {
  'use strict';
  const preview = document.querySelector('#qr-preview');
  const buttons = [...document.querySelectorAll('[data-qr-side]')];
  const content = {
    front: { title:'Сначала — знакомство', copy:'Лицевой код открывает начало страницы именно этого продукта.', link:'Посмотреть начало', href:'#' },
    back: { title:'Сразу — к важному', copy:'Код на обороте открывает описание корма, минуя первый экран.', link:'Перейти к описанию', href:'#description' }
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    const side = button.dataset.qrSide;
    const item = content[side];
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    preview.dataset.side = side;
    preview.querySelector('.qr-destination-title').textContent = item.title;
    preview.querySelector('.qr-destination-copy').textContent = item.copy;
    const link = preview.querySelector('.qr-destination-link');
    link.firstChild.textContent = item.link + ' ';
    link.setAttribute('href', item.href);
  }));
})();
