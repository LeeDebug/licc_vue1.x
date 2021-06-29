import { defineReactive } from './defineReactive.js';
import { protoArgument } from './protoArgument.js';

/**
 * 通过 Observer 类为对象设置响应式能力
 * @param {*} value 要响应式的对象，比如 vm._data: {t: "t value", t1: {…}, arr: Array(3), counter: 0}
 * @returns Observer 实例
 */
export function observe(value) {
  // 避免无限递归
  // 当 value 不是对象直接结束递归
  if (typeof value !== 'object') return;

  // value.__ob__ 是 Observer 实例
  // 如果 value.__ob__ 属性已经存在，说明 value 对象已经具备响应式能力，直接返回已有的响应式对象
  if (value.__ob__) return value.__ob__;

  // 返回 Observer 实例
  return new Observer(value);
}

/**
 * 为普通对象或者数组设置响应式的入口 
 */
export function Observer(value) {
  // 为对象设置 __ob__ 属性，值为 this，标识当前对象已经是一个响应式对象了
  Object.defineProperty(value, '__ob__', {
    value: this,
    // 设置为 false，禁止被枚举，
    // 1、可以在递归设置数据响应式的时候跳过 __ob__
    // 2、将响应式对象字符串化时也不限显示 __ob__ 对象
    enumerable: false,
    writable: true,
    configurable: true,
  });

  if (Array.isArray(value)) {
    // console.log('======= Array', value);
    // 数组响应式
    protoArgument(value);
    // this.observeArray(value);
  } else {
    // console.log('======= Object', value);
    // 对象响应式
    this.walk(value);
  }
}

/**
 * 遍历数组的每个元素，为每个元素设置响应式
 * 其实这里是为了处理元素为对象的情况，以达到 this.arr[idx].xx 是响应式的目的
 * @param {*} arr
 */
Observer.prototype.observeArray = function (arr) {
  console.log('======= arr:', arr);
  for (let item of arr) {
    observe(item)
  }
}

/**
 * 遍历对象的每个属性，为这些属性设置 getter、setter 拦截
 */
Observer.prototype.walk = function (obj) {
  for (let key in obj) {
    defineReactive(obj, key, obj[key]);
  }
}
