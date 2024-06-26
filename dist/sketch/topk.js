"use strict";
/* file: topk.ts
MIT License

Copyright (c) 2019-2020 Thomas Minier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_filter_1 = __importDefault(require("../base-filter"));
var count_min_sketch_1 = __importDefault(require("./count-min-sketch"));
var exportable_1 = require("../exportable");
var lodash_1 = require("lodash");
/**
 * A MinHeap stores items sorted by ascending frequency
 * @author Thomas Minier
 */
var MinHeap = /** @class */ (function () {
    function MinHeap() {
        this._content = [];
    }
    Object.defineProperty(MinHeap.prototype, "length", {
        /**
         * Get the number of items in the heap
         */
        get: function () {
            return this._content.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MinHeap.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (value) {
            this._content = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Access an item at a given index
     * @param index - Index of the item
     * @return The item or `undefined` if the index is out of the array
     */
    MinHeap.prototype.get = function (index) {
        return this._content[index];
    };
    /**
     * Add a new element to the heap and keep items sorted by ascending frequency
     * @param element - Element to insert
     */
    MinHeap.prototype.add = function (element) {
        // kepp items sorted by frequency
        var index = (0, lodash_1.sortedIndexBy)(this._content, element, function (heapElement) { return heapElement.frequency; });
        this._content.splice(index, 0, element);
    };
    /**
     * Remove an item at a given index and keep items sorted by ascending frequency
     * @param index - Index of the item to remove
     */
    MinHeap.prototype.remove = function (index) {
        this._content.splice(index, 1);
    };
    /**
     * Remove and returns the element with the smallest frequency in the heap
     * @return The element with the smallest frequency in the heap
     */
    MinHeap.prototype.popMin = function () {
        return this._content.shift();
    };
    /**
     * Get the index of an element by its value
     * @param value - Value of the element to search for
     * @return Index of the element or -1 if it is not in the heap
     */
    MinHeap.prototype.indexOf = function (value) {
        // TODO optimize
        return this._content.findIndex(function (heapElement) { return heapElement.value === value; });
        // const index = sortedIndexBy(this._content, {value, frequency: 0}, heapElement => heapElement.value)
        // if (this._content[index] !== undefined && this._content[index].value === value) {
        //   return index
        // }
        // return -1
    };
    /**
     * Clear the content of the heap
     */
    MinHeap.prototype.clear = function () {
        this._content = [];
    };
    return MinHeap;
}());
/**
 * A TopK computes the ranking of elements in a multiset (by an arbitrary score) and returns the `k` results with the highest scores.
 * This implementation of the TopK problem sorts items based on their estimated cardinality in the multiset.
 * It is based on a Count Min Sketch, for estimating the cardinality of items, and a MinHeap, for implementing a sliding window over the `k` results with the highest scores.
 * @author Thomas Minier
 * @author Arnaud Grall
 */
var TopK = /** @class */ (function (_super) {
    __extends(TopK, _super);
    /**
     * Constructor
     * @param k - How many elements to store
     * @param errorRate - The error rate
     * @param accuracy  - The probability of accuracy
     */
    function TopK(k, errorRate, accuracy) {
        var _this = _super.call(this) || this;
        _this._k = k;
        _this._errorRate = errorRate;
        _this._accuracy = accuracy;
        _this._sketch = count_min_sketch_1.default.create(errorRate, accuracy);
        _this._heap = new MinHeap();
        return _this;
    }
    /**
     * Add an element to the TopK
     * @param element - Element to add
     */
    TopK.prototype.add = function (element, count) {
        if (count === void 0) { count = 1; }
        if (0 >= count) {
            throw "count must be > 0 (was ".concat(count, ")");
        }
        this._sketch.update(element, count);
        var frequency = this._sketch.count(element);
        if (this._heap.length < this._k ||
            frequency >= this._heap.get(0).frequency // eslint-disable-line @typescript-eslint/no-non-null-assertion
        ) {
            var index = this._heap.indexOf(element);
            // remove the entry if it is already in the MinHeap
            if (index > -1) {
                this._heap.remove(index);
            }
            // add the new entry
            this._heap.add({
                value: element,
                frequency: frequency,
            });
            // if there is more items than K, then remove the smallest item in the heap
            if (this._heap.length > this._k) {
                this._heap.popMin();
            }
        }
    };
    /**
     * Clear the content of the TopK
     */
    TopK.prototype.clear = function () {
        this._sketch = count_min_sketch_1.default.create(this._errorRate, this._accuracy);
        this._heap.clear();
    };
    /**
     * Get the top-k values as an array of objects {value: string, frequency: number, rank: number}
     * @return The top-k values as an array of objects {value: string, frequency: number, rank: number}
     */
    TopK.prototype.values = function () {
        var res = [];
        for (var i = this._heap.length - 1; i >= 0; i--) {
            var elt = this._heap.get(i); // eslint-disable-line @typescript-eslint/no-non-null-assertion
            res.push({
                value: elt.value,
                frequency: elt.frequency,
                rank: this._heap.length - i,
            });
        }
        return res;
    };
    /**
     * Get the top-k values as an iterator that yields objects {value: string, frequency: number, rank: number}.
     * WARNING: With this method, values are produced on-the-fly, hence you should not modify the TopK
     * while the iteration is not completed, otherwise the generated values may not respect the TopK properties.
     * @return The top-k values as an iterator of object {value: string, frequency: number, rank: number}
     */
    TopK.prototype.iterator = function () {
        var heap = this._heap;
        return (function () {
            var i, elt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = heap.length - 1;
                        _a.label = 1;
                    case 1:
                        if (!(i >= 0)) return [3 /*break*/, 4];
                        elt = heap.get(i) // eslint-disable-line @typescript-eslint/no-non-null-assertion
                        ;
                        return [4 /*yield*/, {
                                value: elt.value,
                                frequency: elt.frequency,
                                rank: heap.length - i,
                            }];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i--;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        })();
    };
    __decorate([
        (0, exportable_1.Field)(),
        __metadata("design:type", Number)
    ], TopK.prototype, "_k", void 0);
    __decorate([
        (0, exportable_1.Field)(),
        __metadata("design:type", Number)
    ], TopK.prototype, "_errorRate", void 0);
    __decorate([
        (0, exportable_1.Field)(),
        __metadata("design:type", Number)
    ], TopK.prototype, "_accuracy", void 0);
    __decorate([
        (0, exportable_1.Field)(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        function (sketch) { return sketch.saveAsJSON(); }, function (json) { return count_min_sketch_1.default.fromJSON(json); }),
        __metadata("design:type", count_min_sketch_1.default)
    ], TopK.prototype, "_sketch", void 0);
    __decorate([
        (0, exportable_1.Field)(function (heap) { return heap.content; }, function (json) {
            var heap = new MinHeap();
            heap.content = json;
            return heap;
        }),
        __metadata("design:type", MinHeap
        /**
         * Constructor
         * @param k - How many elements to store
         * @param errorRate - The error rate
         * @param accuracy  - The probability of accuracy
         */
        )
    ], TopK.prototype, "_heap", void 0);
    TopK = __decorate([
        (0, exportable_1.AutoExportable)('TopK', ['_seed']),
        __param(0, (0, exportable_1.Parameter)('_k')),
        __param(1, (0, exportable_1.Parameter)('_errorRate')),
        __param(2, (0, exportable_1.Parameter)('_accuracy')),
        __metadata("design:paramtypes", [Number, Number, Number])
    ], TopK);
    return TopK;
}(base_filter_1.default));
exports.default = TopK;
