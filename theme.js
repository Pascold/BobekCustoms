(() => {
  const button = document.querySelector('#theme-toggle');
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function updateButton(theme) {
    const isDark = theme === 'dark';
    button.setAttribute('aria-pressed', String(isDark));
    button.setAttribute('aria-label', `Przełącz na ${isDark ? 'jasny' : 'ciemny'} motyw`);
    button.title = `Przełącz na ${isDark ? 'jasny' : 'ciemny'} motyw`;
    button.innerHTML = isDark
      ? '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg><span class="theme-label">Jasny</span>'
      : '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z"/></svg><span class="theme-label">Ciemny</span>';
    themeColor.content = '#00DAFF';
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    updateButton(theme);
    try {
      localStorage.setItem('bobekcustoms-theme', theme);
    } catch (error) {
      console.warn('Nie udało się zapisać wybranego motywu.', error);
    }
  }

  const initialTheme = root.dataset.theme === 'dark' ? 'dark' : 'light';
  updateButton(initialTheme);
  button.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
})();
