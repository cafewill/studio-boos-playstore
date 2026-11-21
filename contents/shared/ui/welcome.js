import {activityArtwork} from './artwork.js';
// 카드와 시작 화면은 같은 활동 데이터를 사용한다. 조작은 공통 셸이 담당한다.
export function welcomeArt(def){return `<div class="activity-preview">${activityArtwork(def)}</div>`;}
