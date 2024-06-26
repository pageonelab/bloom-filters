/// <reference types="node" />
import BaseFilter from '../base-filter';
import { HashableInput } from '../utils';
import Long from 'long';
/**
 * Extended HashableInput type adding the Long type from the long package for using plain 64-bits number.
 */
export type XorHashableInput = HashableInput | Long;
/**
 * XOR-Filter for 8-bits and 16-bits fingerprint length.
 *
 * To use for fixed sets of elements only
 * Inspired from @see https://github.com/FastFilter/fastfilter_java
 * @author Arnaud GRALL
 * @example
 * ```js
 * const xor8 = new XorFilter(1) // default fingerprint of 8 bits
 * xor8.add(['a'])
 * xor8.has('a') // true
 * xor8.has('b') // false
 * const xor16 = new XorFilter(1, 16)
 * xor16.add(['a'])
 * xor16.has('a') // true
 * xor16.has('b') // false
 * ```
 */
export default class XorFilter extends BaseFilter {
    ALLOWED_FINGERPRINT_SIZES: number[];
    HASHES: number;
    OFFSET: number;
    FACTOR_TIMES_100: number;
    /**
     * Buffer array of fingerprints
     */
    _filter: Buffer[];
    /**
     * Number of bits per fingerprint
     */
    _bits: number;
    /**
     * Number of elements inserted in the filter
     */
    _size: number;
    /**
     * Size of each block (filter size / HASHES)
     */
    _blockLength: number;
    /**
     * Create an empty XorFilter for a number of `size` elements.
     * The fingerprint length can be choosen
     * @param size
     * @param bits_per_fingerprint
     */
    constructor(size: number, bits_per_fingerprint?: 8 | 16);
    /**
     * Return False if the element is not in the filter, True if it might be in the set with certain probability.
     * @param element
     * @returns
     */
    has(element: XorHashableInput): boolean;
    /**
     * Add elements to the filter, modify the filter in place.
     * Warning: Another call will override the previously created filter.
     * @param elements
     * @example
     * ```js
     * const xor = new XorFilter(1, 8)
     * xor.add(['alice'])
     * xor.has('alice') // true
     * xor.has('bob') // false
     * ```
     */
    add(elements: XorHashableInput[]): void;
    /**
     * Return True if the other XorFilter is equal
     * @param filter
     * @returns
     */
    equals(filter: XorFilter): boolean;
    /**
     * Return a XorFilter for a specified set of elements
     * @param elements
     * @returns
     */
    static create(elements: XorHashableInput[], bits_per_fingerprint?: 8 | 16): XorFilter;
    /**
     * @internal
     * @private
     * Return the optimal xor filter size
     * @param size
     * @returns
     */
    _getOptimalFilterSize(size: number): number;
    /**
     * @internal
     * @private
     * Read the buffer provided as int8, int16 or int32le based on the size of the finger prints
     * @param buffer
     * @returns
     */
    _readBuffer(buffer: Buffer): number;
    /**
     * @internal
     * @private
     * Generate the fingerprint of the hash
     * @param hash hash of the element
     * @returns
     */
    _fingerprint(hash: Long): Long;
    /**
     * @internal
     * @private
     * Transform any HashableInput into its Long representation
     * @param element
     * @param seed
     * @returns
     */
    _hashable_to_long(element: HashableInput, seed: number): Long;
    /**
     * @internal
     * @private
     * Hash a long into a Long
     * @param element
     * @returns
     */
    _hash64(element: Long, seed: number): Long;
    /**
     * Perform a modulo reduction using an optimiaze technique
     * @param hash
     * @param size
     * @returns
     */
    _reduce(hash: Long, size: number): number;
    /**
     * Hash the element
     * @param element
     * @param seed
     * @returns
     */
    _getHash(element: Long, seed: number, index: number): number;
    /**
     * Create the filter representing the elements to store.
     * We eliminate all duplicated entries before creating the array.
     * Follow the algorithm 2 and 3 of the paper (@see https://arxiv.org/pdf/1912.08258.pdf)
     * Inspired by Go impl from (@see https://github.com/FastFilter/xorfilter/blob/master/xorfilter.go)
     * @param elements array of elements to add in the filter
     * @param arraylength length of the filter
     * @returns
     */
    _create(elements: XorHashableInput[], arrayLength: number): void;
}
