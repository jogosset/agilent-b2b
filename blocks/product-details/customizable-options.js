const SELECTABLE_SINGLE_TYPES = new Set(['drop_down', 'radio']);
const SELECTABLE_MULTI_TYPES = new Set(['checkbox', 'multiple']);
const ENTERED_TYPES = new Set(['field', 'area', 'date', 'date_time', 'time']);

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function decodeUid(value) {
  try {
    return atob(value);
  } catch {
    return '';
  }
}

function selectedValues(value) {
  if (Array.isArray(value)) return value;
  return isNonEmptyString(value) ? [value] : [];
}

export function createCustomOptionsState(options, initialConfiguration = {}) {
  const selected = Array.isArray(initialConfiguration.optionsUIDs)
    ? initialConfiguration.optionsUIDs
    : [];
  const entered = Array.isArray(initialConfiguration.enteredOptions)
    ? initialConfiguration.enteredOptions
    : [];

  return Object.fromEntries(options.map((option) => {
    const valueUids = new Set((option.values || []).map((value) => value.uid));
    if (SELECTABLE_MULTI_TYPES.has(option.type)) {
      return [option.uid, selected.filter((uid) => valueUids.has(uid))];
    }
    if (SELECTABLE_SINGLE_TYPES.has(option.type)) {
      return [option.uid, selected.find((uid) => valueUids.has(uid)) || ''];
    }
    if (ENTERED_TYPES.has(option.type)) {
      return [option.uid, entered.find((value) => value.uid === option.uid)?.value || ''];
    }
    return [option.uid, ''];
  }));
}

export function validateCustomOptions(options, state) {
  const errors = {};

  options.forEach((option) => {
    if (!option.supported) {
      errors[option.uid] = 'This option type is not supported by the storefront.';
      return;
    }
    if (!option.required) return;

    const value = state[option.uid];
    if (SELECTABLE_MULTI_TYPES.has(option.type) && selectedValues(value).length === 0) {
      errors[option.uid] = 'Choose at least one option.';
    } else if (SELECTABLE_SINGLE_TYPES.has(option.type) && !isNonEmptyString(value)) {
      errors[option.uid] = 'Choose an option.';
    } else if (ENTERED_TYPES.has(option.type) && !isNonEmptyString(value)) {
      errors[option.uid] = 'Enter a value.';
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

export function normalizeEnteredValue(type, value) {
  if (type === 'date_time') {
    const normalized = value.replace('T', ' ');
    return normalized.length === 16 ? `${normalized}:00` : normalized;
  }
  if (type === 'time' && value.length === 5) return `${value}:00`;
  return value;
}

export function mergeCustomOptions(configuration, options, state) {
  const currentConfiguration = configuration || {};
  const groupPaths = new Set(options.map((option) => decodeUid(option.uid)).filter(Boolean));
  const existingSelected = Array.isArray(currentConfiguration.optionsUIDs)
    ? currentConfiguration.optionsUIDs
    : [];
  const retainedSelected = existingSelected.filter((uid) => {
    const decoded = decodeUid(uid);
    return ![...groupPaths].some((path) => decoded.startsWith(`${path}/`));
  });

  const customSelected = options.flatMap((option) => {
    if (!option.supported || (!SELECTABLE_SINGLE_TYPES.has(option.type)
      && !SELECTABLE_MULTI_TYPES.has(option.type))) return [];
    const allowed = new Set((option.values || []).map((value) => value.uid));
    return selectedValues(state[option.uid]).filter((uid) => allowed.has(uid));
  });

  const customEnteredUids = new Set(
    options.filter((option) => ENTERED_TYPES.has(option.type)).map((option) => option.uid),
  );
  const retainedEntered = (Array.isArray(currentConfiguration.enteredOptions)
    ? currentConfiguration.enteredOptions
    : []).filter((entry) => !customEnteredUids.has(entry.uid));
  const customEntered = options
    .filter((option) => option.supported && ENTERED_TYPES.has(option.type))
    .flatMap((option) => {
      const value = state[option.uid];
      if (!isNonEmptyString(value)) return [];
      return [{ uid: option.uid, value: normalizeEnteredValue(option.type, value) }];
    });

  return {
    ...currentConfiguration,
    optionsUIDs: [...new Set([...retainedSelected, ...customSelected])],
    enteredOptions: [...retainedEntered, ...customEntered],
  };
}

export function formatOptionAdjustment(value, currency, locale) {
  const price = Number(value?.price);
  if (!Number.isFinite(price) || price === 0) return '';
  if (value.priceType === 'percent') {
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
    }).format(Math.abs(price));
    return `${price > 0 ? '+' : '-'}${formatted}%`;
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    signDisplay: 'always',
  }).format(price);
}

function validBridgeValue(value) {
  return value
    && isNonEmptyString(value.uid)
    && isNonEmptyString(value.title)
    && Number.isFinite(Number(value.price))
    && ['fixed', 'percent'].includes(value.priceType);
}

function validBridgeOption(option) {
  return option
    && isNonEmptyString(option.uid)
    && isNonEmptyString(option.title)
    && isNonEmptyString(option.type)
    && typeof option.required === 'boolean'
    && typeof option.supported === 'boolean'
    && Array.isArray(option.values)
    && option.values.every(validBridgeValue);
}

export function validateBridgePayload(payload, sku) {
  if (!payload
    || payload.sku !== sku
    || !Array.isArray(payload.options)
    || !payload.options.every(validBridgeOption)) {
    throw new Error('Invalid custom-option response.');
  }
  return payload;
}

let controllerSequence = 0;

function optionLabel(value, currency, locale) {
  const adjustment = formatOptionAdjustment(value, currency, locale);
  return adjustment ? `${value.title} (${adjustment})` : value.title;
}

function appendRequiredIndicator(element, required) {
  if (!required) return;
  const indicator = document.createElement('span');
  indicator.className = 'product-details__custom-option-required';
  indicator.setAttribute('aria-hidden', 'true');
  indicator.textContent = ' *';
  element.append(indicator);
}

function setControlError(fieldset, message) {
  const error = fieldset.querySelector('.product-details__custom-option-error');
  const controls = fieldset.querySelectorAll('input, select, textarea');
  error.textContent = message || '';
  error.hidden = !message;
  controls.forEach((control) => {
    if (message) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  });
}

function createErrorElement(id) {
  const error = document.createElement('p');
  error.id = id;
  error.className = 'product-details__custom-option-error';
  error.hidden = true;
  return error;
}

function createChoiceLabel(input, value, currency, locale) {
  const label = document.createElement('label');
  label.className = 'product-details__custom-option-choice';
  const text = document.createElement('span');
  text.textContent = optionLabel(value, currency, locale);
  label.append(input, text);
  return label;
}

function createSelectControl({
  option, state, describedBy, onValue,
}) {
  const select = document.createElement('select');
  select.className = 'product-details__custom-option-select';
  select.name = option.uid;
  select.required = option.required;
  select.setAttribute('aria-describedby', describedBy);

  const neutral = document.createElement('option');
  neutral.value = '';
  neutral.textContent = 'Choose an option';
  select.append(neutral);
  option.values.forEach((value) => {
    const item = document.createElement('option');
    item.value = value.uid;
    item.textContent = optionLabel(value, state.currency, state.locale);
    select.append(item);
  });
  select.value = state.values[option.uid] || '';
  select.addEventListener('change', () => onValue(select.value));
  return select;
}

function createChoiceControls({
  option, state, describedBy, onValue,
}) {
  const choices = document.createElement('div');
  choices.className = 'product-details__custom-option-choices';
  const isMulti = SELECTABLE_MULTI_TYPES.has(option.type);
  const selected = new Set(selectedValues(state.values[option.uid]));

  if (!isMulti && !option.required) {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = option.uid;
    input.value = '';
    input.checked = selected.size === 0;
    input.setAttribute('aria-describedby', describedBy);
    input.addEventListener('change', () => input.checked && onValue(''));
    choices.append(createChoiceLabel(input, {
      title: 'No selection',
      price: 0,
      priceType: 'fixed',
    }, state.currency, state.locale));
  }

  option.values.forEach((value, index) => {
    const input = document.createElement('input');
    input.type = isMulti ? 'checkbox' : 'radio';
    input.name = option.uid;
    input.value = value.uid;
    input.checked = selected.has(value.uid);
    input.required = option.required && !isMulti && index === 0;
    input.setAttribute('aria-describedby', describedBy);
    input.addEventListener('change', () => {
      if (!isMulti) {
        if (input.checked) onValue(value.uid);
        return;
      }
      const next = new Set(selectedValues(state.values[option.uid]));
      if (input.checked) next.add(value.uid);
      else next.delete(value.uid);
      onValue([...next]);
    });
    choices.append(createChoiceLabel(input, value, state.currency, state.locale));
  });
  return choices;
}

function createEnteredControl({
  option, state, describedBy, onValue,
}) {
  const control = option.type === 'area'
    ? document.createElement('textarea')
    : document.createElement('input');
  const inputTypes = {
    field: 'text',
    date: 'date',
    date_time: 'datetime-local',
    time: 'time',
  };
  if (control instanceof HTMLInputElement) control.type = inputTypes[option.type] || 'text';
  control.className = 'product-details__custom-option-input';
  control.name = option.uid;
  control.required = option.required;
  control.value = state.values[option.uid] || '';
  control.setAttribute('aria-describedby', describedBy);
  if (Number.isInteger(option.maxCharacters) && option.maxCharacters > 0) {
    control.maxLength = option.maxCharacters;
  }
  control.addEventListener('input', () => onValue(control.value));
  return control;
}

function createOptionFieldset(option, index, state, onValue) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'product-details__custom-option';
  const legend = document.createElement('legend');
  legend.id = `${state.id}-legend-${index}`;
  legend.textContent = option.title;
  appendRequiredIndicator(legend, option.required);
  fieldset.append(legend);

  const errorId = `${state.id}-error-${index}`;
  const error = createErrorElement(errorId);
  if (!option.supported) {
    const unsupported = document.createElement('p');
    unsupported.className = 'product-details__custom-option-unsupported';
    unsupported.setAttribute('role', 'alert');
    unsupported.textContent = `The “${option.title}” option uses a type that this storefront cannot submit. Contact the merchant before ordering.`;
    fieldset.append(unsupported, error);
    return fieldset;
  }

  const controlOptions = {
    option,
    state,
    describedBy: errorId,
    onValue: (value) => onValue(option.uid, value),
  };
  let control;
  if (option.type === 'drop_down') control = createSelectControl(controlOptions);
  else if (option.type === 'radio'
    || SELECTABLE_MULTI_TYPES.has(option.type)) control = createChoiceControls(controlOptions);
  else control = createEnteredControl(controlOptions);
  control.setAttribute?.('aria-labelledby', legend.id);

  if (ENTERED_TYPES.has(option.type)) {
    const adjustment = formatOptionAdjustment(option, state.currency, state.locale);
    if (adjustment) {
      const price = document.createElement('p');
      price.className = 'product-details__custom-option-adjustment';
      price.textContent = `Price adjustment: ${adjustment}`;
      fieldset.append(price);
    }
  }
  fieldset.append(control, error);
  return fieldset;
}

export function createCustomOptionsController({
  element,
  endpoint,
  sku,
  storeView,
  currency = 'USD',
  locale = 'en-US',
  initialConfiguration = {},
  fetchImpl = window.fetch.bind(window),
  onValidityChange = () => {},
  onConfigurationChange = () => {},
}) {
  controllerSequence += 1;
  const renderState = {
    id: `custom-options-${controllerSequence}`,
    currency,
    locale,
    values: {},
  };
  let options = [];
  let loadState = 'idle';
  let hasReportedErrors = false;

  function validity() {
    if (loadState !== 'ready') return { valid: false, errors: {} };
    return validateCustomOptions(options, renderState.values);
  }

  function notify() {
    const result = validity();
    const supported = options.every((option) => option.supported);
    onValidityChange({
      ready: loadState === 'ready' && supported,
      valid: result.valid,
    });
    if (loadState === 'ready') {
      onConfigurationChange((configuration) => mergeCustomOptions(
        configuration,
        options,
        renderState.values,
      ));
    }
  }

  function displayErrors(errors) {
    options.forEach((option, index) => {
      const fieldset = element.querySelectorAll('.product-details__custom-option')[index];
      if (fieldset) setControlError(fieldset, errors[option.uid]);
    });
  }

  function onValue(uid, value) {
    renderState.values[uid] = value;
    const result = validity();
    if (hasReportedErrors) displayErrors(result.errors);
    notify();
  }

  function renderOptions() {
    element.replaceChildren();
    element.className = 'product-details__custom-options';
    element.removeAttribute('aria-busy');
    if (options.length === 0) {
      element.hidden = true;
      return;
    }
    element.hidden = false;
    const heading = document.createElement('h2');
    heading.className = 'product-details__custom-options-heading';
    heading.textContent = 'Configure this product';
    const fields = document.createElement('div');
    fields.className = 'product-details__custom-options-fields';
    options.forEach((option, index) => {
      fields.append(createOptionFieldset(option, index, renderState, onValue));
    });
    element.append(heading, fields);
  }

  function renderLoading() {
    element.hidden = false;
    element.className = 'product-details__custom-options product-details__custom-options--loading';
    element.setAttribute('aria-busy', 'true');
    const message = document.createElement('p');
    message.textContent = 'Loading product options…';
    element.replaceChildren(message);
  }

  function renderFailure() {
    element.hidden = false;
    element.className = 'product-details__custom-options product-details__custom-options--error';
    element.removeAttribute('aria-busy');
    const alert = document.createElement('div');
    alert.setAttribute('role', 'alert');
    const message = document.createElement('p');
    message.textContent = 'Product options could not be loaded. Retry before adding this product to the cart.';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Retry';
    retry.addEventListener('click', () => load());
    alert.append(message, retry);
    element.replaceChildren(alert);
  }

  async function load() {
    loadState = 'loading';
    renderLoading();
    notify();
    try {
      if (!isNonEmptyString(endpoint)) throw new Error('Missing custom-option endpoint.');
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.set('sku', sku);
      url.searchParams.set('store', storeView);
      const response = await fetchImpl(url, {
        method: 'GET',
        credentials: 'omit',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Custom-option request failed.');
      const payload = validateBridgePayload(await response.json(), sku);
      const priorValues = renderState.values;
      options = payload.options;
      const restored = createCustomOptionsState(options, initialConfiguration);
      renderState.values = Object.fromEntries(options.map((option) => [
        option.uid,
        Object.hasOwn(priorValues, option.uid) ? priorValues[option.uid] : restored[option.uid],
      ]));
      loadState = 'ready';
      renderOptions();
      notify();
      return payload;
    } catch {
      loadState = 'error';
      renderFailure();
      notify();
      return null;
    }
  }

  function validate({ report = false } = {}) {
    hasReportedErrors = hasReportedErrors || report;
    const result = validity();
    if (hasReportedErrors) displayErrors(result.errors);
    return result.valid && loadState === 'ready' && options.every((option) => option.supported);
  }

  function mergeConfiguration(configuration) {
    return mergeCustomOptions(configuration, options, renderState.values);
  }

  return {
    load,
    mergeConfiguration,
    validate,
  };
}
