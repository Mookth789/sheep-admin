import $store from '@/sheep/store';
import { isString, isArray } from 'lodash';

const positiveinteger = {
  mounted(el) {
    el.addEventListener('keypress', function (e) {
      e = e || window.event;
      let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
      let re = /\d/;
      if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    });
  },
};

export default positiveinteger;
