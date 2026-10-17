'use strict';
const cover = document.querySelector('.wedding-cover');
const video = document.querySelector('#wedding-background video');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const button = document.querySelector('.open-invitation');
let opened = false;
const revealElements = document.querySelectorAll(
  '#rec1125579356 .custom-graphic, .panel-heading, .panel-copy > p, '
  + '.date-section > .section-title, .date-section > p, '
  + '.final-countdown, .closing-card > h2, .closing-card > p'
);
let textObserver;
if ('IntersectionObserver' in window) {
  revealElements.forEach(element => element.classList.add('reveal-ready'));
  textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        textObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.01});
}
function observeText() {
  if (textObserver) revealElements.forEach(element => textObserver.observe(element));
}

function resetScroll() {
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
}
function playback() {
  video.muted = true;
  if (motion.matches || document.hidden) {
    video.classList.remove('is-playing');
    video.pause();
  } else {
    video.play().catch(() => video.classList.remove('is-playing'));
  }
}
function openInvitation() {
  if (opened) return;
  opened = true;
  resetScroll();
  cover.classList.add('leaving');
  playback();
  setTimeout(() => {
    cover.close();
    document.documentElement.classList.remove('invitation-pending');
    resetScroll();
    const heading = document.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({preventScroll: true});
    requestAnimationFrame(() => {resetScroll(); observeText();});
  }, motion.matches ? 0 : 800);
}
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
resetScroll();
if (typeof cover.showModal === 'function') cover.showModal();
else {document.documentElement.classList.remove('invitation-pending'); observeText();}
button.addEventListener('click', openInvitation);
cover.addEventListener('cancel', event => {event.preventDefault(); openInvitation();});
window.addEventListener('pageshow', () => {if (!opened) resetScroll();});
motion.addEventListener('change', playback);
document.addEventListener('visibilitychange', playback);
video.addEventListener('playing', () => {
  if (!motion.matches && !document.hidden && !video.paused) video.classList.add('is-playing');
});
['pause', 'ended', 'error', 'emptied'].forEach(event => {
  video.addEventListener(event, () => video.classList.remove('is-playing'));
});
playback();
