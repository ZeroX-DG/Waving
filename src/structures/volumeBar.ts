import { classList } from '../common';
const volumeBarClass = classList.volumeBar;
export default `
<div class="${volumeBarClass.container}">
  <div class="${volumeBarClass.thumb}"></div>
  <div class="${volumeBarClass.volumeLine}">
    <div class="${volumeBarClass.volumeSelectedLine}">
  </div>
</div>
`;
