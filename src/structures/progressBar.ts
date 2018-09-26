import { classList } from '../common';
const progressBarClass = classList.progressBar;
export default `
<div class="${progressBarClass.container}">
  <div class="${progressBarClass.thumb}"></div>
  <div class="${progressBarClass.progressLine}">
    <div class="${progressBarClass.porgressPlayedLine}">
  </div>
</div>
`;
