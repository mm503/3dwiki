// Inject grid + orb background elements into the body
(function () {
  function inject() {
    if (document.querySelector('.mm404-grid')) return;

    const grid = document.createElement('div');
    grid.className = 'mm404-grid';
    document.body.prepend(grid);

    const orb1 = document.createElement('div');
    orb1.className = 'mm404-orb mm404-orb--1';
    document.body.prepend(orb1);

    const orb2 = document.createElement('div');
    orb2.className = 'mm404-orb mm404-orb--2';
    document.body.prepend(orb2);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  // Re-inject on MkDocs Material instant navigation
  document.addEventListener('DOMContentLoaded', inject);
})();
