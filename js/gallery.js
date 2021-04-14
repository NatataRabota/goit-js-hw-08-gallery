import galleryItems from './gallery-items.js';

//1. Создание и рендер разметки по массиву данных и предоставленному шаблону.
//2. Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
//3. Открытие модального окна по клику на элементе галереи.
//4. Подмена значения атрибута src элемента img.lightbox__image.
//5. Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
//6. Очистка значения атрибута src элемента img.lightbox__image.Это необходимо для того,
// чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

// Ссылки на элементы
const refs = {
  gallery: document.querySelector('.js-gallery'),
  lightbox: document.querySelector('.js-lightbox'),
  lightboxImg: document.querySelector('.lightbox__image'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
  lightboxCloseBtn: document.querySelector(
    'button[data-action="close-lightbox"]',
  ),
};

const galleryMarkup = makeGalleryMarkup(galleryItems); // Переменная с отрендеренной разметкой
refs.gallery.insertAdjacentHTML('afterbegin', galleryMarkup); // Добавляет разметку в галлерею

refs.gallery.addEventListener('click', onModalOpen);
refs.lightbox.addEventListener('click', onModalClose);

// Oбзервер
const options = {
  threshold: 0.2,
};

const observer = new IntersectionObserver(onEntry, options);
const imgPreviewRefs = document.querySelectorAll('.gallery__item');

imgPreviewRefs.forEach(image => {
  observer.observe(image);
});

// Коллбек плавного появления для обзервера
function onEntry(entries) {
  entries.forEach(entry => {
    entry.target.style.opacity = 0;
    entry.target.style.transform = 'scale(0.5)';

    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'scale(1)';
    }
  });
}

// Функция для создания разметки
function makeGalleryMarkup(items) {
  return items
    .map(({ preview, original, description }) => {
      return `
        <li class="gallery__item">
        <a class="gallery__link" href="${original}">
        <img
        class="gallery__image"
        loading="lazy"
        src="${preview}"
        data-source="${original}"
        alt="${description}"
        />
        </a>
        </li>`;
    })
    .join('');
}

// Коллбек для слушателя открытия модалки
function onModalOpen(e) {
  e.preventDefault();
  document.body.style.overflow = 'hidden'; // Скролл на боди при открытой модалке

  if (e.target.nodeName !== 'IMG') {
    return;
  }

  setOriginalImageOnLightbox(e); // Меняет превью изображения на оригинал
  addOpenLightboxClass(); // Добавляет класс открытой модалки


  // Добавляет слушателей для работы с клавиатуры
  window.addEventListener('keydown', onModalClose);
  window.addEventListener('keydown', onArrowPress);
}

// Коллбек для слушателя закрытия модалки
function onModalClose(e) {
  const isLightboxOverlayEl = e.target === refs.lightboxOverlay;
  const isLightboxCloseBtnEl = e.target === refs.lightboxCloseBtn;
  const isEscBtn = e.code === 'Escape';

  // Проверка на нажатие необходимых для закрытия кнопок
  if (isLightboxOverlayEl || isLightboxCloseBtnEl || isEscBtn) {
    removeOpenLightboxClass(); // Убирает класс открытой модалки

    // Очищает значение атрибута src/alt элемента img.lightbox__image
    refs.lightboxImg.src = '';
    refs.lightboxImg.alt = '';

    document.body.removeAttribute('Style');
    window.removeEventListener('keydown', onModalClose);
    window.removeEventListener('keydown', onArrowPress);
  }
}

function onArrowPress(e) {
  changeLightboxImage(e);
}


// Устанавливает оригинальное изображение
function setOriginalImageOnLightbox(e) {
  const originalImg = e.target.dataset.source;
  const description = e.target.alt;

  refs.lightboxImg.src = originalImg;
  refs.lightboxImg.alt = description;
}

function addOpenLightboxClass() {
  refs.lightbox.classList.add('is-open');
}

function removeOpenLightboxClass() {
  refs.lightbox.classList.remove('is-open');
}