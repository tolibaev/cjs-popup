'use strict';

import './popup.css'

export function Popup(wrapper, options = {}) {
  const rootElement = document.querySelector(wrapper);

  options.popupLink ??= 'popup-link';
  options.lockPaddings ??= 'lock-padding';
  options.popupClose ??= 'close-popup';
  options.timeout ??= 800;

  const body = document.querySelector('body');
  const popupLinks = rootElement.querySelectorAll(options.popupLink),
    lockPaddings = rootElement.querySelectorAll(options.lockPaddings);

  let unlock = true;

  if (popupLinks.length > 0) {
    popupLinks.forEach(popupLink => {
      popupLink.addEventListener('click', event => {
        event.preventDefault();
        const popupName = popupLink.getAttribute('href').replace('#', '');
        const curentPopup = document.getElementById(popupName);
        popupOpen(curentPopup);
      });
      popupLink.addEventListener('keydown', event => {
        if (event.code === 'Space') {
          const popupName = popupLink.getAttribute('href').replace('#', '');
          const curentPopup = document.getElementById(popupName);
          popupOpen(curentPopup);
          event.preventDefault();
        }
      });
    });
  }

  const popupCloseIcons = document.querySelectorAll(options.popupClose);
  if (popupCloseIcons.length > 0) {
    popupCloseIcons.forEach(popupCloseIcon => {
      popupCloseIcon.onclick = event => {
        popupClose(event.target.closest('.popup'));
      };
    });
  }

  function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
      const popupActive = document.querySelector('.popup.open');

      if (popupActive) {
        popupClose(popupActive, false);
      } else {
        bodyLock();
      }

      curentPopup.classList.add('open');
      curentPopup.addEventListener('click', event => {
        if (!event.target.closest('.popup__content')) {
          popupClose(event.target.closest('.popup'));
        }
      });
    }
  }

  function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
      popupActive.classList.remove('open');
      if (doUnlock) {
        bodyUnlock();
      }
    }
  }

  function bodyLock() {
    const lockPaddingValue = window.innerWidth - wrapper.offsetWidth + 'px';
    if (lockPaddings.length > 0) {
      lockPaddings.forEach(lockPadding => {
        lockPadding.style.paddingRight = lockPaddingValue;
      });
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');
    unlock = false;
    setTimeout(() => {
      unlock = true;
    }, timeout);
  }

  function bodyUnlock() {
    setTimeout(function () {
      if (lockPaddings.length > 0) {
        lockPaddings.forEach(lockPadding => {
          lockPadding.style.paddingRight = '0px';
        });
      }
      body.style.paddingRight = '0px';
      body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(() => {
      unlock = true;
    }, timeout);
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const popupActive = document.querySelector('.popup.open');
      popupClose(popupActive);
    }
  });
}
