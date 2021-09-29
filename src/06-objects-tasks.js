/* eslint-disable */
/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function(){
  return this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return new proto.constructor(...Object.values(obj));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

 const orderError = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
 const noDubs = 'Element, id and pseudo-element should not occur more then one time inside the selector';

 const types = {
   ELEMENT: 1,
   ID: 2,
   CLASS: 3,
   ATTR: 4,
   PSEUDO_CLASS: 5,
   PSEUDO_ELEMENT: 6,
 };

 class Builder {
   constructor() {
     this.lastType = 0;
     this.result = '';
   }

   setType(type) {
     switch (type) {
       case types.ELEMENT:
       case types.ID:
       case types.PSEUDO_ELEMENT: {
         if (type === this.lastType) {
           throw new Error(noDubs);
         }
         break;
       }
       default:
     }

     if (type < this.lastType) throw new Error(orderError);

     this.lastType = type;
   }

   element(value) {
     this.setType(types.ELEMENT);
     this.result += `${value}`;
     return this;
   }

   id(value) {
     this.setType(types.ID);
     this.result += `#${value}`;
     return this;
   }

   class(value) {
     this.setType(types.CLASS);
     this.result += `.${value}`;
     return this;
   }

   attr(value) {
     this.setType(types.ATTR);
     this.result += `[${value}]`;
     return this;
   }

   pseudoClass(value) {
     this.setType(types.PSEUDO_CLASS);
     this.result += `:${value}`;
     return this;
   }

   pseudoElement(value) {
     this.setType(types.PSEUDO_ELEMENT);
     this.result += `::${value}`;
     return this;
   }

   stringify() {
     return this.result;
   }
 }

const cssSelectorBuilder = {
  element(value) {
    return new Builder().element(value);
  },

  id(value) {
    return new Builder().id(value);
  },

  class(value) {
    return new Builder().class(value);
  },

  attr(value) {
    return new Builder().attr(value);
  },

  pseudoClass(value) {
    return new Builder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Builder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const a = selector1.stringify();
    const b = selector2.stringify();

    const result = {
      stringify() {
        return `${a} ${combinator} ${b}`;
      },
    };

    return result;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
