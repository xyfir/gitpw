window.addEventListener('DOMContentLoaded', () => {
  function replaceText(selector: string, text: string): void {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(
      `${dependency}-version`,
      process.versions[dependency] as string,
    );
  }
});
