export const stringToNode = (html: string): HTMLElement => {
  const wrapper: HTMLElement = document.createElement('div');
  wrapper.innerHTML = html.trim();

  return wrapper.firstChild as HTMLElement;
};
