"use strict";
/* file : invertible-bloom-lookup-tables.ts
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
var cell_1 = __importDefault(require("./cell"));
var exportable_1 = require("../exportable");
var utils_1 = require("../utils");
var formulas_1 = require("../formulas");
/**
 * An Invertible Bloom Lookup Table is a space-efficient and probabilistic data-structure for solving the set-difference problem efficiently without the use of logs or other prior context. It computes the set difference with communication proportional to the size of the difference between the sets being compared.
 * They can simultaneously calculate D(A−B) and D(B−A) using O(d) space. This data structure encodes sets in a fashion that is similar in spirit to Tornado codes’ construction [6], in that it randomly combines elements using the XOR function
 * Reference: Eppstein, D., Goodrich, M. T., Uyeda, F., & Varghese, G. (2011). What's the difference?: efficient set reconciliation without prior context. ACM SIGCOMM Computer Communication Review, 41(4), 218-229.
 * @see {@link http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.220.6282&rep=rep1&type=pdf} for more details about Invertible Bloom Lookup Tables
 * @author Arnaud Grall
 * @author Thomas Minier
 */
var InvertibleBloomFilter = /** @class */ (function (_super) {
    __extends(InvertibleBloomFilter, _super);
    /**
     * Construct an Invertible Bloom Lookup Table
     * @param size - The number of cells in the InvertibleBloomFilter. It should be set to d * alpha, where d is the number of difference and alpha is a constant
     * @param hashCount - The number of hash functions used (empirically studied to be 3 or 4 in most cases)
     */
    function InvertibleBloomFilter(size, hashCount) {
        if (hashCount === void 0) { hashCount = 3; }
        var _this = _super.call(this) || this;
        if (Buffer === undefined) {
            throw new Error('No native Buffer implementation bound in your JavaScript env. If you are in a Web browser, consider importing the polyfill "feross/buffer" (https://github.com/feross/buffer).');
        }
        if (hashCount <= 0) {
            throw new Error('The hashCount must be a non-zero, positive integer');
        }
        _this._size = size;
        _this._hashCount = hashCount;
        // the number of elements in the array is n = alpha * size
        _this._elements = (0, utils_1.allocateArray)(_this._size, function () { return cell_1.default.empty(); });
        return _this;
    }
    InvertibleBloomFilter_1 = InvertibleBloomFilter;
    /**
     * Create an Invertible Bloom filter optimal for an expected size and error rate.
     * @param nbItems - Number of items expected to insert into the IBLT
     * @param errorRate - Expected error rate
     * @return A new Invertible Bloom filter optimal for the given parameters.
     */
    InvertibleBloomFilter.create = function (nbItems, errorRate) {
        var size = (0, formulas_1.optimalFilterSize)(nbItems, errorRate);
        var nbHashes = (0, formulas_1.optimalHashes)(size, nbItems);
        return new InvertibleBloomFilter_1(size, nbHashes);
    };
    /**
     * Create an Invertible Bloom filter from a set of Buffer and optimal for an error rate.
     * @param items - An iterable to yield Buffers to be inserted into the filter
     * @param errorRate - Expected error rate
     * @return A new Invertible Bloom filter filled with the iterable's items.
     */
    InvertibleBloomFilter.from = function (items, errorRate) {
        var array = Array.from(items);
        var filter = InvertibleBloomFilter_1.create(array.length, errorRate);
        array.forEach(function (item) { return filter.add(item); });
        return filter;
    };
    Object.defineProperty(InvertibleBloomFilter.prototype, "hashCount", {
        /**
         * Return the number of hash functions used
         * @return {Number}
         */
        get: function () {
            return this._hashCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InvertibleBloomFilter.prototype, "size", {
        /**
         * Get the number of cells of the filter
         */
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InvertibleBloomFilter.prototype, "length", {
        /**
         * Get the number of elements added in the filter
         * Complexity in time: O(alpha*d)
         */
        get: function () {
            return this._elements.reduce(function (a, b) { return a + b.count; }, 0) / this._hashCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InvertibleBloomFilter.prototype, "elements", {
        /**
         * Return the cells used to store elements in this InvertibleBloomFilter
         */
        get: function () {
            return this._elements;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Add an element to the InvertibleBloomFilter
     * @param element - The element to insert
     */
    InvertibleBloomFilter.prototype.add = function (element) {
        var hashes = this._hashing.hashTwiceAsString(JSON.stringify(element.toJSON()), this.seed);
        var indexes = this._hashing.getDistinctIndexes(hashes.first, this._size, this._hashCount, this.seed);
        for (var i = 0; i < this._hashCount; ++i) {
            this._elements[indexes[i]].add(element, Buffer.from(hashes.first));
        }
    };
    /**
     * Remove an element from the filter
     * @param element - The element to remove
     * @return True if the element has been removed, False otheriwse
     */
    InvertibleBloomFilter.prototype.remove = function (element) {
        var hashes = this._hashing.hashTwiceAsString(JSON.stringify(element.toJSON()), this.seed);
        var indexes = this._hashing.getDistinctIndexes(hashes.first, this._size, this._hashCount, this.seed);
        for (var i = 0; i < this._hashCount; ++i) {
            this._elements[indexes[i]] = this._elements[indexes[i]].xorm(new cell_1.default(Buffer.from(element), Buffer.from(hashes.first), 1));
        }
        return true;
    };
    /**
     * Test if an item is in the filter.
     * @param  element - The element to test
     * @return False if the element is not in the filter, true if "may be" in the filter.
     */
    InvertibleBloomFilter.prototype.has = function (element) {
        var hashes = this._hashing.hashTwiceAsString(JSON.stringify(element.toJSON()), this.seed);
        var indexes = this._hashing.getDistinctIndexes(hashes.first, this._size, this._hashCount, this.seed);
        for (var i = 0; i < this._hashCount; ++i) {
            if (this._elements[indexes[i]].count === 0) {
                return false;
            }
            else if (this._elements[indexes[i]].count === 1) {
                if (this._elements[indexes[i]].idSum.equals(element)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * List all entries from the filter using a Generator.
     * The generator ends with True if the operation has not failed, False otheriwse.
     * It is not recommended to modify an IBLT while listing its entries!
     * @return A generator that yields all filter's entries.
     */
    InvertibleBloomFilter.prototype.listEntries = function () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var that = this;
        var seenBefore = [];
        return (function () {
            var _loop_1, index, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _loop_1 = function (index) {
                            var localCell;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        localCell = that._elements[index];
                                        if (!(localCell.count > 0 &&
                                            seenBefore.findIndex(function (b) { return b.equals(localCell.idSum); }) === -1)) return [3 /*break*/, 3];
                                        if (!that.has(localCell.idSum)) return [3 /*break*/, 2];
                                        seenBefore.push(localCell.idSum);
                                        return [4 /*yield*/, localCell.idSum];
                                    case 1:
                                        _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2: return [2 /*return*/, { value: false }];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < that._elements.length - 1)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(index)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, true];
                }
            });
        })();
    };
    /**
     * Substract the filter with another {@link InvertibleBloomFilter}, and returns the resulting filter.
     * @param  remote - The filter to substract with
     * @return A new InvertibleBloomFilter which is the XOR of the local and remote one
     */
    InvertibleBloomFilter.prototype.substract = function (iblt) {
        if (this.size !== iblt.size) {
            throw new Error('The two Invertible Bloom Filters must be of the same size');
        }
        var res = new InvertibleBloomFilter_1(iblt._size, iblt._hashCount);
        res.seed = this.seed;
        for (var i = 0; i < this.size; ++i) {
            res._elements[i] = this._elements[i].xorm(iblt._elements[i]);
        }
        return res;
    };
    /**
     * Test if two InvertibleBloomFilters are equals
     * @param iblt - The filter to compare with
     * @return True if the two filters are equals, False otherwise
     */
    InvertibleBloomFilter.prototype.equals = function (iblt) {
        if (iblt._size !== this._size ||
            iblt._hashCount !== this._hashCount ||
            iblt.seed !== this.seed) {
            return false;
        }
        else {
            for (var i = 0; i < iblt._elements.length; ++i) {
                if (!iblt._elements[i].equals(this._elements[i])) {
                    return false;
                }
            }
            return true;
        }
    };
    /**
     * Decode an InvertibleBloomFilter based on its substracted version
     * @return The results of the deconding process
     */
    InvertibleBloomFilter.prototype.decode = function (additional, missing) {
        if (additional === void 0) { additional = []; }
        if (missing === void 0) { missing = []; }
        var pureList = [];
        var cell = null;
        // checking for all pure cells
        for (var i = 0; i < this._elements.length; ++i) {
            cell = this._elements[i];
            if (cell.isPure()) {
                pureList.push(i);
            }
        }
        while (pureList.length !== 0) {
            cell = this._elements[pureList.pop()]; // eslint-disable-line @typescript-eslint/no-non-null-assertion
            var id = cell.idSum;
            var c = cell.count;
            if (cell.isPure()) {
                if (c === 1) {
                    additional.push(id);
                }
                else if (c === -1) {
                    missing.push(id);
                }
                else {
                    throw new Error('Please report, not possible');
                }
                var hashes = this._hashing.hashTwiceAsString(JSON.stringify(id.toJSON()), this.seed);
                var indexes = this._hashing.getDistinctIndexes(hashes.first, this._size, this._hashCount, this.seed);
                for (var i = 0; i < indexes.length; ++i) {
                    this._elements[indexes[i]] = this._elements[indexes[i]].xorm(new cell_1.default(id, Buffer.from(hashes.first), c));
                    if (this._elements[indexes[i]].isPure()) {
                        pureList.push(indexes[i]);
                    }
                }
            }
        }
        if (this._elements.findIndex(function (e) { return !e.isEmpty(); }) > -1) {
            return {
                success: false,
                reason: {
                    cell: cell,
                    iblt: this,
                },
                additional: additional,
                missing: missing,
            };
        }
        else {
            return {
                success: true,
                additional: additional,
                missing: missing,
            };
        }
    };
    var InvertibleBloomFilter_1;
    __decorate([
        (0, exportable_1.Field)(),
        __metadata("design:type", Number)
    ], InvertibleBloomFilter.prototype, "_size", void 0);
    __decorate([
        (0, exportable_1.Field)(),
        __metadata("design:type", Number)
    ], InvertibleBloomFilter.prototype, "_hashCount", void 0);
    __decorate([
        (0, exportable_1.Field)(undefined, function (json) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var res = json.map(function (elt) {
                var c = new cell_1.default(Buffer.from(elt._idSum), Buffer.from(elt._hashSum), elt._count);
                c.seed = elt._seed;
                return c;
            });
            return res;
        }),
        __metadata("design:type", Array)
    ], InvertibleBloomFilter.prototype, "_elements", void 0);
    InvertibleBloomFilter = InvertibleBloomFilter_1 = __decorate([
        (0, exportable_1.AutoExportable)('InvertibleBloomFilter', ['_seed']),
        __param(0, (0, exportable_1.Parameter)('_size')),
        __param(1, (0, exportable_1.Parameter)('_hashCount')),
        __metadata("design:paramtypes", [Number, Object])
    ], InvertibleBloomFilter);
    return InvertibleBloomFilter;
}(base_filter_1.default));
exports.default = InvertibleBloomFilter;
