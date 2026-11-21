// v1 회귀 검사 전용 호환 진입점. 신규 화면에서 사용하지 않는다.
import {createLegacyStore} from '../../shared/core/legacy-storage.js';
import {restore} from './activity.js';
export const {read,write,load,save,clear}=createLegacyStore('shape-garden',restore);
