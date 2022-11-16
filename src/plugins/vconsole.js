import Vue from 'vue';
import Vconsole from 'vconsole';

const origin = window.location.origin;
const useConsole = origin.includes('localhost') || origin.includes('eme')|| true;
// if (useConsole) {
//   const vConsole = new Vconsole();
//   Vue.use(vConsole);
// }
