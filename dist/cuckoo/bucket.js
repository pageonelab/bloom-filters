"use strict";
/* file : bucket.ts
MIT License

Copyright (c) 2017-2020 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils = __importStar(require("../utils"));
var exportable_1 = require("../exportable");
var exportable_2 = require("../exportable");
/**
 * A Bucket is a container of a fixed number of values, used in various bloom filters.
 * @extends Exportable
 * @author Thomas Minier
 * @private
 */
var Bucket = /** @class */ (function () {
    /**
     * Constructor
     * @param size - The maximum number of elements in the bucket
     */
    function Bucket(size) {
        this._elements = utils.allocateArray(size, null);
        this._size = size;
        this._length = 0;
    }
    Bucket_1 = Bucket;
    Object.defineProperty(Bucket.prototype, "size", {
        /**
         * Get the maximum number of element in the bucket
         */
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bucket.prototype, "length", {
        /**
         * Get the number of elements currenlty in the bucket
         */
        get: function () {
            return this._length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Test if the bucket has any space available
     * @return True if te bucket has any space available, False if if its full
     */
    Bucket.prototype.isFree = function () {
        return this._length < this._size;
    };
    /**
     * Get the index of the first empty slot in the bucket
     * @return The index of the first empty slot, or -1 if the bucket is full
     */
    Bucket.prototype.nextEmptySlot = function () {
        return (0, lodash_1.indexOf)(this._elements, null);
    };
    /**
     * Get the element at the given index in the bucket
     * @param index - The index to access
     * @return The element at the given index
     */
    Bucket.prototype.at = function (index) {
        return this._elements[index];
    };
    /**
     * Try to add an element to the bucket
     * @param element - The element to add in the bucket
     * @return True if the insertion is a success, False if the bucket is full
     */
    Bucket.prototype.add = function (element) {
        if (element === null || !this.isFree()) {
            return false;
        }
        this.set(this.nextEmptySlot(), element);
        this._length++;
        return true;
    };
    /**
     * Try to remove an element from the bucket
     * @param element - The element to remove from the bucket
     * @return True if the element has been successfully removed, False if it was not in the bucket
     */
    Bucket.prototype.remove = function (element) {
        var index = (0, lodash_1.indexOf)(this._elements, element);
        if (index <= -1) {
            return false;
        }
        this.unset(index);
        return true;
    };
    /**
     * Test an element for membership
     * @param element - The element to look for in the bucket
     * @return True is the element is in the bucket, otherwise False
     */
    Bucket.prototype.has = function (element) {
        return (0, lodash_1.indexOf)(this._elements, element) > -1;
    };
    /**
     * Set an element at the given index in the bucket
     * @param index - The index at where the element should be inserted
     * @param element - The element to insert
     */
    Bucket.prototype.set = function (index, element) {
        this._elements[index] = element;
    };
    /**
     * Unset the element at the given index
     * @param index - The index of the element that should be unset
     */
    Bucket.prototype.unset = function (index) {
        this._elements[index] = null;
        this._length--;
    };
    /**
     * Randomly swap an element of the bucket with a given element, then return the replaced element
     * @param element - The element to be inserted
     * @param random - Factory function used to generate random function
     * @return The element that have been swapped with the parameter
     */
    Bucket.prototype.swapRandom = function (element, random) {
        if (random === void 0) { random = Math.random; }
        var index = utils.randomInt(0, this._length - 1, random);
        var tmp = this._elements[index];
        this._elements[index] = element;
        return tmp;
    };
    /**
     * Swap an element of the bucket with a given index and element, then return the replaced element
     * @param index - The index at where the element should be inserted
     * @param element - The element to be inserted
     * @return The element that have been swapped with the parameter
     */
    Bucket.prototype.swap = function (index, element) {
        var tmp = this._elements[index];
        this._elements[index] = element;
        return tmp;
    };
    /**
     * Test if two buckets are equals: they have the same size, length and content
     * @param bucket - The other bucket with which to compare
     * @return True if the two buckets are equals, False otherwise
     */
    Bucket.prototype.equals = function (bucket) {
        if (this._size !== bucket.size || this._length !== bucket.length)
            return false;
        return this._elements.every(function (elt, index) { return (0, lodash_1.eq)(bucket.at(index), elt); });
    };
    var Bucket_1;
    Bucket = Bucket_1 = __decorate([
        (0, exportable_1.Exportable)({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            export: (0, exportable_2.cloneObject)('Bucket', '_size', '_elements'),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            import: function (json) {
                if ((json.type !== 'Bucket' || !('_size' in json), !('_elements' in json)) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
                ) {
                    throw new Error('Cannot create a Bucket from a JSON export which does not represent a bucket');
                }
                var bucket = new Bucket_1(json._size); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                json._elements.forEach(function (elt, i) {
                    if (elt !== null) {
                        bucket._elements[i] = elt;
                        bucket._length++;
                    }
                });
                return bucket;
            },
        }),
        __metadata("design:paramtypes", [Number])
    ], Bucket);
    return Bucket;
}());
exports.default = Bucket;
