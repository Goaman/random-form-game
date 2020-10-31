import * as gsap from 'gsap';
import { Bounce, Circ, Power2, Power4, TimelineMax, TweenMax } from 'gsap';
import { Random } from 'random-js';
import $ from 'jquery';
import Draggable from 'gsap/Draggable';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

interface Style {
  x?: number;
  y?: number;
  left?: number;
  top?: number;
  height?: number;
  width?: number;
  duration?: number;
  'border-radius'?: number | string;
  'background-color'?: string;
  position?: string;
}
interface FormDef {
  init: Style[];
  start: Style[];
  end: Style[];
}

const random = new Random();
const rand = random.integer.bind(random);

const stylesFns: [Function, number][] = [
  [horizontalFromMiddle, 25],
  [formToCorner, 50],
  // [formToCenter, 100],
  [formToCenterOfThemselfve, 100],

  // [topToBottom, 10],
  // [leftToRight, 10],
  // [rightToLeft, 10],
  // [bottomToTop, 10],
];
const endings = [
  //
  topToBottomEnd,
  leftToRightEnd,
  rightToLeftEnd,
  bottomToTopEnd,
];

function getCenterPos() {
  return {
    x: window.innerHeight / 2,
    y: window.innerWidth / 2,
  };
}

function weightArray(data: [Function, number][]) {
  const totalNumber = data.reduce((acc, item) => acc + item[1], 0);
  const normalizedWeight = data.map((item) => item[1] / totalNumber);
  let randNumber = rand(0, 1000) / 1000;
  for (const i in normalizedWeight) {
    if (randNumber <= normalizedWeight[i]) {
      return data[i][0];
    } else {
      randNumber -= normalizedWeight[i];
    }
  }
}

const keyMapping = {
  right: 'x',
  top: 'y',
};
function translateToGsap(style) {
  const newStyle = {};
  for (const key of Object.keys(style)) {
    const newKey = keyMapping[key] ? keyMapping[key] : key;
    newStyle[newKey] = style[newKey];
  }
  return newStyle;
}

function blackColor(): string {
  return `rgba(0, 0, 0, 1)`;
}
function whiteColor(): string {
  return `rgba(255, 255, 255, 1)`;
}

function getRandomColor2(): string {
  const r = rand(100, 200);
  const g = rand(100, 160);
  const b = rand(200, 200);
  const a = 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function totalRandom(): string {
  const r = rand(0, 255);
  const g = rand(0, 255);
  const b = rand(0, 255);
  const a = 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function getRandomColor() {
  return weightArray([
    //
    [blackColor, 10],
    // [whiteColor, 10],
    // [getRandomColor2, 10],
    [totalRandom, 30],
  ])();
}

function initialForm(): Style {
  const x = rand(50, window.innerHeight);
  const y = rand(50, window.innerWidth);
  return {
    position: 'absolute',
    height: 0,
    width: 0,
    top: x,
    left: y,
    'background-color': blackColor(),
    'border-radius': '50%',
  };
}
function getStyle(): Style {
  // const size = rand(5, getCenterPos().x * 2);
  const size = rand(50, 500);
  const x = rand(0, getCenterPos().x);
  const y = rand(0, getCenterPos().y);
  const winPos = getCenterPos();
  return {
    position: 'absolute',
    height: size,
    width: size,
    top: x,
    left: y,
    'background-color': blackColor(),
  };
}

function createCircle(style: Style): HTMLElement {
  const $div = $('<div>');
  $div.css({
    ...style,
    'border-radius': '100%',
  });
  return $div[0];
}

function createSquare(style: Style): HTMLElement {
  const $div = $('<div>');
  $div.css(style);
  return $div[0];
}

function getDirection(from: Style) {
  // const fns = [
  //   getDirectionCenter,
  //   // getDirectionTop,
  //   // getDirectionLeft,
  //   // getDirectionRight,
  //   // getDirectionBottom,
  // ];
  // return fns[rand(0, fns.length - 1)](from);

  return {
    top: random.pick([0, window.innerHeight / 2, window.innerHeight]),
    left: random.pick([0, window.innerWidth / 2, window.innerWidth]),
    height: 0,
    width: 0,
  };
}

const directionDuration = 0.3;
const directionInitStyle = {
  'border-radius': 0,
};

function getDirectionCenter(from: Style): Style {
  const center = getCenterPos();
  return {
    top: center.x,
    left: center.y,
    width: 0,
    height: 0,
    duration: directionDuration,
  };
}
function getDirectionLeft(from: Style): Style {
  return {
    ...directionInitStyle,
    top: 0,
    left: 0,
    width: 0,
    height: window.innerHeight,
    duration: directionDuration,
  };
}
function getDirectionRight(from: Style): Style {
  return {
    ...directionInitStyle,
    top: 0,
    left: window.innerWidth,
    width: 0,
    height: window.innerHeight,
    duration: directionDuration,
  };
}
function getDirectionTop(from: Style): Style {
  return {
    ...directionInitStyle,
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: 0,
    duration: directionDuration,
  };
}
function getDirectionBottom(from: Style): Style {
  return {
    ...directionInitStyle,
    top: window.innerHeight,
    left: 0,
    width: window.innerWidth,
    height: 0,
    duration: directionDuration,
  };
}

function formToCorner(): FormDef {
  const initialStyle = initialForm();
  const animation1 = getStyle();
  animation1.left = initialStyle.left + (initialStyle.width - animation1.width) / 2;
  animation1.top = initialStyle.top + (initialStyle.height - animation1.height) / 2;
  animation1.duration = 0.5;
  delete animation1['background-color'];
  const direction = getDirection(animation1);
  return {
    init: [initialStyle],
    start: [animation1],
    end: [direction],
  };
}

function formToCenterOfThemselfve(): FormDef {
  const def = formToCorner();
  const end = {
    top: def.init[0].top + def.init[0].height / 2,
    left: def.init[0].left + def.init[0].width / 2,
    height: 0,
    width: 0,
  };
  const init: Style[] = [];
  // const max = rand(5, 10);
  const max = 3;
  for (let i = 0; i < max; i++) {
    init.push({ ...def.init[0], 'background-color': getRandomColor2() });
  }
  console.log('init:', init);
  return {
    init: [...init],
    start: def.start,
    end: [end],
  };
}
function formToCenter(): FormDef {
  const def = formToCorner();
  const direction = {
    top: window.innerHeight / 2,
    left: window.innerWidth / 2,
    height: 0,
    width: 0,
  };
  return {
    init: def.init,
    start: def.start,
    end: [direction],
  };
}
function initialTransitionStyle(): Style {
  return { 'background-color': getRandomColor() };
}
function leftToRightEnd() {
  return {
    top: 0,
    height: window.innerHeight,
    left: window.innerWidth,
    width: 0,
    duration: 0.5,
  };
}
function leftToRight(): FormDef {
  const init: Style = {
    position: 'absolute',
    top: 0,
    height: window.innerHeight,
    left: 0,
    width: 0,
    ...initialTransitionStyle(),
  };
  const middle = {
    top: 0,
    height: window.innerHeight,
    left: 0,
    width: window.innerWidth,
    duration: 0.5,
  };
  return {
    init: [init],
    start: [middle],
    end: [leftToRightEnd()],
  };
}
function rightToLeftEnd() {
  return {
    top: 0,
    height: window.innerHeight,
    left: 0,
    width: 0,
    duration: 0.5,
  };
}
function rightToLeft(): FormDef {
  const init: Style = {
    position: 'absolute',
    top: 0,
    height: window.innerHeight,
    left: window.innerWidth,
    width: 0,
    ...initialTransitionStyle(),
  };
  const middle = {
    top: 0,
    height: window.innerHeight,
    left: 0,
    width: window.innerWidth,
    duration: 0.5,
  };
  return {
    init: [init],
    start: [middle],
    end: [rightToLeftEnd()],
  };
}
function topToBottomEnd() {
  return {
    top: window.innerHeight,
    height: 0,
    left: 0,
    width: window.innerWidth,
    duration: 0.5,
  };
}
function topToBottom(): FormDef {
  const init: Style = {
    position: 'absolute',
    top: 0,
    height: 0,
    left: 0,
    width: window.innerWidth,
    ...initialTransitionStyle(),
  };
  const middle = {
    top: 0,
    height: window.innerHeight,
    left: 0,
    width: window.innerWidth,
    duration: 0.5,
  };
  return {
    init: [init],
    start: [middle],
    end: [topToBottomEnd()],
  };
}
function bottomToTopEnd() {
  return {
    top: 0,
    height: 0,
    left: 0,
    width: window.innerWidth,
    duration: 0.5,
  };
}
function bottomToTop(): FormDef {
  const init: Style = {
    position: 'absolute',
    top: window.innerHeight,
    height: 0,
    left: 0,
    width: window.innerWidth,
    ...initialTransitionStyle(),
  };
  const middle = {
    top: 0,
    height: window.innerHeight,
    left: 0,
    width: window.innerWidth,
    duration: 0.5,
  };
  return {
    init: [init],
    start: [middle],
    end: [bottomToTopEnd()],
  };
}

function getElement(container: HTMLElement) {
  const element = document.createElement('div');
  container.appendChild(element);
  return element;
}

type Callback = (...args: any[]) => void;

interface AnimateOptions {
  animationItem: AnimationItem;
  styles: Style[];
  time: number;
  onComplete?: Callback;
}

function animateTimeline(options: AnimateOptions) {
  let delay = 0;
  for (const instance of options.animationItem.instances) {
    for (const style of options.styles) {
      console.log('add to timeline', instance);
      console.log('style:', style);
      instance.instanceTimeline.add(TweenMax.to(instance.element, { ...style, delay: delay }));
    }
    delay += 0.2;
    instance.tween = TweenMax.to(instance.instanceTimeline, options.time, {
      progress: 1,
      ease: Power4.easeInOut,
      // ease: gsap.Elastic.easeOut.config(2.5, 0.75),
    });
  }
}

interface AlphabetItem {
  formDef: FormDef;
  formFn: (style: Style) => HTMLElement;
}
interface Alphabet {
  [key: string]: AlphabetItem;
}
interface KeycodePressed {
  [key: string]: boolean;
}
const alphabet: Alphabet = {};
const formsFn = [createSquare, createCircle];
const keycodePressed = {};

function horizontalFromMiddle(): FormDef {
  const init: Style = {
    position: 'absolute',
    top: window.innerHeight / 2,
    height: 0,
    left: window.innerWidth / 2,
    width: 0,
    'background-color': 'black',
  };
  const size = rand(10, 20);
  const middle = {
    top: window.innerHeight / 2 - size / 2,
    height: size,
    left: window.innerWidth / 2 - size / 2,
    width: size,
    duration: 0.5,
  };
  const enlarge = {
    top: window.innerHeight / 2 - size / 2,
    height: size,
    left: 0,
    width: window.innerWidth,
    duration: 0.5,
  };
  const enlarge2 = {
    top: 0,
    height: window.innerHeight,
    left: 0,
    width: window.innerWidth,
    duration: 0.5,
  };
  return {
    init: [init],
    start: [middle, enlarge, enlarge2],
    end: [random.pick(endings)()],
  };
}

interface AnimationItemInstance {
  element: HTMLElement;
  instanceTimeline: gsap.TimelineMax;
  tween?: TweenMax;
}
interface AnimationItem {
  timeline: TimelineMax;
  instances: AnimationItemInstance[];
}
const currentAnimation: Map<AlphabetItem, AnimationItem> = new Map();
function initTimeline(): gsap.TimelineMax {
  return new TimelineMax({ paused: true });
}

document.addEventListener('keydown', (e) => {
  if (keycodePressed[e.code]) return;
  console.log('keydown');
  keycodePressed[e.code] = true;
  if (!alphabet[e.code]) {
    alphabet[e.code] = {
      formDef: weightArray(stylesFns)(),
      formFn: formsFn[rand(0, formsFn.length - 1)],
    };
  }
  const fn = () => {
    if (keycodePressed[e.code]) {
      const alphabetItem = alphabet[e.code];
      console.log('alphbetItem:', alphabetItem);
      const animationItem: AnimationItem = {
        timeline: initTimeline(),
        instances: alphabetItem.formDef.init.map((initStyle) => {
          const element = getElement(document.body);
          $(element).css(initStyle);
          const instance: AnimationItemInstance = {
            element,
            instanceTimeline: initTimeline(),
          };
          return instance;
        }),
      };
      currentAnimation.set(alphabetItem, animationItem);
      animateTimeline({
        animationItem: animationItem,
        styles: alphabetItem.formDef.start,
        time: 5,
      });
    }
  };
  fn();
});

document.addEventListener('keyup', (e) => {
  keycodePressed[e.code] = false;
  const alphabetItem = alphabet[e.code];
  const animationItem = currentAnimation.get(alphabetItem);
  for (const instance of animationItem.instances) {
    instance.tween?.pause();
    instance.tween?.kill();
  }
  const timeline = initTimeline();
  animateTimeline({
    animationItem,
    styles: alphabetItem.formDef.end,
    time: 2,
  });
  timeline.eventCallback('onComplete', () => {
    for (const instance of animationItem.instances) {
      $(instance.element).remove();
    }
  });
  // });
});

$(document.body).css({
  margin: 0,
  padding: 0,
});

// interface GeneratedArgs {}
// class SuperFunction {
//   items: any[];
//   constructor(public args: any, protected _genFunction: Function) {}
// }

// new SuperFunction(
//   {
//     r: [rand, [0, 255]],
//     g: [rand, [0, 255]],
//     b: [rand, [0, 255]],
//   },
//   (o) => {
//     o.color;
//   },
// );
