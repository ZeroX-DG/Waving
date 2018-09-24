export const stringToNode = (html: string): HTMLElement => {
  const wrapper: HTMLElement = document.createElement('div');
  wrapper.innerHTML = html.trim();

  return wrapper.firstChild as HTMLElement;
};

// taken from p5.js !
export const map = (n, start1, stop1, start2, stop2) => {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};
