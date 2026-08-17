import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createCustomOptionsState,
  formatOptionAdjustment,
  mergeCustomOptions,
  normalizeEnteredValue,
  validateBridgePayload,
  validateCustomOptions,
} from '../../blocks/product-details/customizable-options.js';

const optionOneUid = 'Y3VzdG9tLW9wdGlvbi8x';
const optionOneValueA = 'Y3VzdG9tLW9wdGlvbi8xLzE=';
const optionOneValueB = 'Y3VzdG9tLW9wdGlvbi8xLzI=';
const optionTwoUid = 'Y3VzdG9tLW9wdGlvbi8y';
const optionTwoValueA = 'Y3VzdG9tLW9wdGlvbi8yLzM=';
const fieldUid = 'Y3VzdG9tLW9wdGlvbi8z';

const options = [
  {
    uid: optionOneUid,
    title: 'Platform',
    type: 'drop_down',
    required: true,
    supported: true,
    values: [
      {
        uid: optionOneValueA, title: '7890B GC', price: 0, priceType: 'fixed',
      },
      {
        uid: optionOneValueB, title: '8890 GC', price: 150, priceType: 'fixed',
      },
    ],
  },
  {
    uid: optionTwoUid,
    title: 'Material',
    type: 'checkbox',
    required: false,
    supported: true,
    values: [{
      uid: optionTwoValueA, title: 'Hastelloy', price: 125, priceType: 'fixed',
    }],
  },
  {
    uid: fieldUid,
    title: 'Engraving',
    type: 'field',
    required: true,
    supported: true,
    values: [],
  },
];

test('createCustomOptionsState restores selectable and entered cart values', () => {
  assert.deepEqual(createCustomOptionsState(options, {
    optionsUIDs: [optionOneValueB, optionTwoValueA, 'configurable-value'],
    enteredOptions: [{ uid: fieldUid, value: '  Lab 7  ' }],
  }), {
    [optionOneUid]: optionOneValueB,
    [optionTwoUid]: [optionTwoValueA],
    [fieldUid]: '  Lab 7  ',
  });
});

test('validateCustomOptions accepts optional empty values and rejects missing required values', () => {
  const state = createCustomOptionsState(options);
  assert.deepEqual(validateCustomOptions(options, state), {
    valid: false,
    errors: {
      [optionOneUid]: 'Choose an option.',
      [fieldUid]: 'Enter a value.',
    },
  });

  state[optionOneUid] = optionOneValueA;
  state[fieldUid] = '   ';
  assert.equal(validateCustomOptions(options, state).valid, false);

  state[fieldUid] = 'Instrument A';
  assert.deepEqual(validateCustomOptions(options, state), { valid: true, errors: {} });
});

test('validateCustomOptions handles required multi-value controls and unsupported options', () => {
  const multi = [{
    ...options[1],
    required: true,
    type: 'multiple',
  }];
  assert.equal(validateCustomOptions(multi, { [optionTwoUid]: [] }).valid, false);
  assert.equal(validateCustomOptions(multi, { [optionTwoUid]: [optionTwoValueA] }).valid, true);

  const unsupported = [{
    uid: 'unsupported', title: 'Upload', type: 'file', required: false, supported: false, values: [],
  }];
  assert.deepEqual(validateCustomOptions(unsupported, { unsupported: '' }), {
    valid: false,
    errors: { unsupported: 'This option type is not supported by the storefront.' },
  });
});

test('mergeCustomOptions replaces only matching custom groups and preserves drop-in values', () => {
  const configuration = {
    sku: '8890B-GC',
    quantity: 2,
    optionsUIDs: ['configurable-value', optionOneValueA, optionTwoValueA],
    enteredOptions: [
      { uid: 'gift-card-message', value: 'Keep this' },
      { uid: fieldUid, value: 'Old engraving' },
    ],
  };
  const state = {
    [optionOneUid]: optionOneValueB,
    [optionTwoUid]: [],
    [fieldUid]: '  New engraving  ',
  };

  assert.deepEqual(mergeCustomOptions(configuration, options, state), {
    sku: '8890B-GC',
    quantity: 2,
    optionsUIDs: ['configurable-value', optionOneValueB],
    enteredOptions: [
      { uid: 'gift-card-message', value: 'Keep this' },
      { uid: fieldUid, value: '  New engraving  ' },
    ],
  });
  assert.deepEqual(configuration.optionsUIDs, ['configurable-value', optionOneValueA, optionTwoValueA]);
});

test('mergeCustomOptions submits every selected checkbox value without duplicates', () => {
  const secondValue = 'Y3VzdG9tLW9wdGlvbi8yLzQ=';
  const checkboxOptions = [{
    ...options[1],
    values: [...options[1].values, { uid: secondValue, title: 'Standard' }],
  }];
  assert.deepEqual(mergeCustomOptions(
    { optionsUIDs: [optionTwoValueA] },
    checkboxOptions,
    { [optionTwoUid]: [optionTwoValueA, secondValue, optionTwoValueA] },
  ).optionsUIDs, [optionTwoValueA, secondValue]);
});

test('normalizeEnteredValue converts browser temporal values for Commerce', () => {
  assert.equal(normalizeEnteredValue('date', '2026-08-14'), '2026-08-14');
  assert.equal(normalizeEnteredValue('date_time', '2026-08-14T16:30'), '2026-08-14 16:30:00');
  assert.equal(normalizeEnteredValue('date_time', '2026-08-14T16:30:45'), '2026-08-14 16:30:45');
  assert.equal(normalizeEnteredValue('time', '16:30'), '16:30:00');
  assert.equal(normalizeEnteredValue('field', '  keep whitespace  '), '  keep whitespace  ');
});

test('formatOptionAdjustment formats fixed, percent, and zero adjustments', () => {
  assert.equal(formatOptionAdjustment({ price: 150, priceType: 'fixed' }, 'USD', 'en-US'), '+$150.00');
  assert.equal(formatOptionAdjustment({ price: 12.5, priceType: 'percent' }, 'USD', 'en-US'), '+12.5%');
  assert.equal(formatOptionAdjustment({ price: 0, priceType: 'fixed' }, 'USD', 'en-US'), '');
});

test('validateBridgePayload accepts its strict contract and rejects malformed success data', () => {
  const payload = { sku: '8890B-GC', options };
  assert.equal(validateBridgePayload(payload, '8890B-GC'), payload);
  assert.throws(() => validateBridgePayload({ sku: 'OTHER', options }, '8890B-GC'), /Invalid custom-option response/);
  assert.throws(() => validateBridgePayload({ sku: '8890B-GC', options: [{}] }, '8890B-GC'), /Invalid custom-option response/);
  assert.throws(() => validateBridgePayload(null, '8890B-GC'), /Invalid custom-option response/);
});
