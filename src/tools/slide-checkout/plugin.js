/* global jQuery */
(($) => {
  $.fn.drzSlideCheckout = function drzSlideCheckout(opts) {
    const defaults = {
      el: null,
      box: null,
      zIndex: null,
      taxPercent: 0,
      assetMap: {},
      currency: {
        type: 'USD',
        symbol: '&#36;',
      },
      api: '',
      cdn: 'https://drz-assets.s3.us-west-1.amazonaws.com',
    };
    const options = $.extend({}, defaults, opts);
    const drzzleStorage = window.localStorage.getItem('drzzleStorage');
    const storage = drzzleStorage ? JSON.parse(drzzleStorage) : {};
    storage.store = storage.store || {};
    const siteStore = storage.store[options.siteId] || {
      cartItems: [],
    };
    const classes = {
      open: 'drzSlideCheckout-open',
      disabled: 'drzSlideCheckout-checkout-btnDisabled',
      activeStep: 'drzSlideCheckout-step-active',
      activeLegend: 'drzSlideCheckout-step-legendActive',
      itemLegend: 'drzSlideCheckout-step-legendItem',
      checkoutBtn: 'drzSlideCheckout-checkout-btn',
      loader: 'drzSlideCheckout-loader',
      btnLoader: 'drzSlideCheckout-loader-btn',
      shipOptions: 'drzSlideCheckout-shipping-optionList',
      shipTotal: 'drzSlideCheckout-step-shipping',
      discountTotal: 'drzSlideCheckout-step-discount',
      alertShow: 'drzSlideCheckout-cart-alertOpen',
    };
    const $shoppingCart = $(this);
    $shoppingCart.each(function initShoppingCart() {
      const $slideCheckoutBox = $(this);
      const $openCartBtn = $(document).find('[name="open-shopping-cart"]');
      const $cartCount = $(document).find('.drzNav-cart-count');
      const $addToCart = $(document).find('[name="add-to-cart"]');
      const $backBtn = $slideCheckoutBox.find('.drzSlideCheckout-back');
      const $cartList = $slideCheckoutBox.find('.drzSlideCheckout-step-cartItems');
      const $preTaxTotal = $slideCheckoutBox.find('.drzSlideCheckout-step-preTaxTotal');
      const $discountBtn = $slideCheckoutBox.find('.drzSlideCheckout-apply-btn');
      const $discountError = $slideCheckoutBox.find('[name="discount-error"]');
      const $infoSubTotal = $slideCheckoutBox.find('[name="subtotal"]');
      const $shippingTotal = $slideCheckoutBox.find('[name="shipping"]');
      const $taxTotal = $slideCheckoutBox.find('[name="tax"]');
      const $discountTotal = $slideCheckoutBox.find('[name="discount"]');
      const $grandTotal = $slideCheckoutBox.find('[name="grand-total"]');
      const $checkoutBtn = $slideCheckoutBox.find(`.${classes.checkoutBtn}`);
      const $legendItem = $slideCheckoutBox.find(`.${classes.itemLegend}`);
      const $fromStepBtn = $slideCheckoutBox.find('[data-from-step="1"]');
      const $payBtn = $slideCheckoutBox.find('.drzSlideCheckout-checkout-pay[data-from-step="3"]');
      const $goToPaymentBtn = $slideCheckoutBox.find(`.${classes.checkoutBtn}[data-from-step="2"]`);
      const $selectShippingBtn = $slideCheckoutBox.find('.drzSlideCheckout-shipping-optionBtn');
      const $shippingOptsError = $slideCheckoutBox.find('[name="shipping-options-error"]');
      const $legendShippingBtn = $slideCheckoutBox.find(`.${classes.itemLegend}[data-from-step="2"]`);
      const $legendPayBtn = $slideCheckoutBox.find(`.${classes.itemLegend}[data-from-step="3"]`);
      const $shippingForm = $slideCheckoutBox.find('.drzSlideCheckout-form');
      const $discountForm = $slideCheckoutBox.find('.drzSlideCheckout-apply-form');
      const $paymentForm = $slideCheckoutBox.find('.drzSlideCheckout-form-payment');
      // payment billing address inputs
      const $billAddress = $paymentForm.find('[name="payment.billing.address"]');
      const $billApt = $paymentForm.find('[name="payment.billing.apt"]');
      const $billCity = $paymentForm.find('[name="payment.billing.city"]');
      const $billCountry = $paymentForm.find('[name="payment.billing.country"]');
      const $billState = $paymentForm.find('[name="payment.billing.state"]');
      const $zipCode = $paymentForm.find('[name="payment.billing.zipCode"]');
      const $btnLoader = $slideCheckoutBox.find(`.${classes.btnLoader}`);
      const $applyText = $slideCheckoutBox.find('.drzSlideCheckout-apply-text');
      const $shippingOptions = $slideCheckoutBox.find(`.${classes.shipOptions}`);
      const $shipTotal = $slideCheckoutBox.find(`.${classes.shipTotal}`);
      const $shipState = $slideCheckoutBox.find('[name="shipping.state"]');
      const $discountPrice = $slideCheckoutBox.find(`.${classes.discountTotal}`);
      const $finalList = $slideCheckoutBox.find('.drzSlideCheckout-items-final');
      const $finalCart = $slideCheckoutBox.find('#final-cart');
      const $accordionBtn = $slideCheckoutBox.find('.drzSlideCheckout-radio-accordionBtn');
      const $accordionRadio = $slideCheckoutBox.find('[data-radio-value]');
      const $payLoader = $slideCheckoutBox.find('.drzSlideCheckout-pay-loader');
      const $payText = $slideCheckoutBox.find('.drzSlideCheckout-checkout-payText');
      const $masks = $slideCheckoutBox.find('[data-mask]');
      // confirm items
      const $confirmEmail = $slideCheckoutBox.find('[name="email-confirm"]');
      const $confirmAddress = $slideCheckoutBox.find('[name="address-confirm"]');
      const $confirmMethod = $slideCheckoutBox.find('[name="shipping-method-confirm"]');
      const $lastStepCart = $slideCheckoutBox.find('[data-checkout-step="4"]');
      // successful purchase elements
      const $orderNumber = $slideCheckoutBox.find('#order-number');
      // error purchase elements
      const $paymentError = $slideCheckoutBox.find('.drzSlideCheckout-payment-error');
      const $alerts = $slideCheckoutBox.next('.drzSlideCheckout-cart-alert');

      if (options.zIndex) {
        $slideCheckoutBox.css({ zIndex: options.zIndex });
      }

      let cartItems = siteStore.cartItems;
      const mappedProducts = {};

      const methods = {
        toggleCheckout($box) {
          if ($box.hasClass(classes.open)) {
            $box.removeClass(classes.open);
            if (!methods.store.purchased) {
              methods.activeStep = 1;
              this.setActiveStep();
            }
          } else {
            $box.addClass(classes.open);
            methods.triggerAlert({ hide: true });
          }
        },
        store: {
          listening: false,
          purchased: false,
          totals: {},
          shopper: {
            contact: {
              firstName: '',
              lastName: '',
              email: '',
            },
            discountCode: '',
            payment: {
              cc: '',
              name: '',
              exp: '',
              code: '',
              zip: '',
              billing: {
                address: '',
                apt: '',
                city: '',
                country: '',
                state: '',
                zipCode: '',
              },
            },
            shipping: {
              address: '',
              apt: '',
              city: '',
              company: '',
              country: '',
              method: '',
              rateOption: '',
              phone: '',
              price: 0,
              rateId: '',
              state: '',
              zipCode: '',
            },
          },
        },
        debounce: null,
        activeStep: 1,
        highestStep: 1,
        countries: {},
        attachFormInputs($form) {
          const onUpdate = (e) => {
            const $this = $(e.currentTarget);
            let val = $this.val();
            const key = $this.attr('name');
            const keys = key.split('.');
            let store = methods.store.shopper;
            if ($this.is('select')) {
              $this.find('option[value=""]').prop('disabled', true);
              const name = $this.attr('name');
              const stateOverride = $this.find(`option[data-state-name="${val}"]`);
              if (stateOverride.length) {
                const iso = stateOverride.attr('data-state-iso');
                val = iso || val;
              }
              // here we inject state and region options based on the country
              if (name === 'payment.billing.country' || name === 'shipping.country') {
                if (methods.countries[val]) {
                  let $select;
                  // shipping address
                  if (name === 'shipping.country') {
                    $select = $shipState;
                  }
                  if (name === 'payment.billing.country') {
                    $select = $billState;
                  }
                  $select.empty().append($('<option selected value="">State</option>'));
                  const { regions = [] } = methods.countries[val];
                  const sortedRegions = regions.sort((a, b) => a.name.localeCompare(b.name));
                  $.each(sortedRegions, (i, country) => {
                    $select.append($(
                      `<option value"${country.iso}" data-state-iso="${country.iso}" data-state-name=${country.name}>${country.name}</option>`,
                    ));
                  });
                }
              }
            }
            keys.forEach((k, i) => {
              if (i === keys.length - 1) {
                store[k] = val;
              } else {
                store = store[k];
              }
            });
            const $helper = $this.prev('.drzSlideCheckout-form-helper');
            if (val !== '') {
              $helper.addClass('drzSlideCheckout-form-helperShow');
            } else {
              $helper.removeClass('drzSlideCheckout-form-helperShow');
            }
            const shopper = methods.store.shopper;
            const shipping = shopper.shipping;
            if (key === 'shipping.address' && methods.sameBillingAddress) {
              $billAddress.val(shipping.address);
              shopper.payment.billing.address = shipping.address;
            }
            if (key === 'shipping.apt' && methods.sameBillingAddress) {
              $billApt.val(shipping.apt);
              shopper.payment.billing.apt = shipping.apt;
            }
            if (key === 'shipping.city' && methods.sameBillingAddress) {
              $billCity.val(shipping.city);
              shopper.payment.billing.city = shipping.city;
            }
            if (key === 'shipping.country' && methods.sameBillingAddress) {
              $billCountry.val(shipping.country);
              shopper.payment.billing.country = shipping.country;
            }
            if (key === 'shipping.state' && methods.sameBillingAddress) {
              $billState.val(shipping.state);
              shopper.payment.billing.state = shipping.state;
            }
            if (key === 'shipping.zipCode' && methods.sameBillingAddress) {
              $zipCode.val(shipping.zipCode);
              shopper.payment.billing.zipCode = shipping.zipCode;
            }
          };
          const $input = $form.find('[data-event="input"]');
          $input.each(function attachInput() {
            $(this).on('input', onUpdate);
          });
          const $select = $form.find('[data-event="change"]');
          $select.each(function attachSelect() {
            $(this).on('change', onUpdate);
          });
        },
        onCartClick(e) {
          e.preventDefault();
          methods.toggleCheckout($slideCheckoutBox);
        },
        onRemoveItemClick(e) {
          const $btn = $(e.currentTarget);
          const index = $btn.attr('data-item-index');
          cartItems.splice(index, 1);
          methods.buildCart(cartItems);
          methods.saveCart(cartItems);
        },
        getInventory({ item }) {
          // step is in the event, the item is in the cart so we need to see
          // if the step is allowed in inventory on a "+" click
          const currentCount = item.count;
          const inventory = item.product.productInventory;
          const optionLimits = item.product.hasOptionLimit;
          if (!optionLimits && (currentCount <= inventory || inventory === -1)) {
            return inventory;
          }
          if (!optionLimits && currentCount > inventory) {
            return 0;
          }
          const selections = {};
          $.each(item.product.options, (i, option) => {
            const isSelect = option.type === 'select';
            // this is the selected option from the cart
            const picked = item.selectedOptions[option._id];
            if (isSelect && !picked) {
              selections[option.label] = option.items[0];
            } else if (isSelect && picked) {
              const find = picked.selected || picked;
              const opt = option.items.find(itm => itm.value === find);
              if ($.isNumeric(picked.count)) {
                opt.count = picked.count;
              }
              selections[option.label] = opt;
            }
          });
          const keys = Object.keys(selections);
          const allLimits = keys.map(k => selections[k].limit);
          const highestLimit = Math.max(...allLimits);
          // if all options are unlimited, return -1
          if (highestLimit === -1) {
            return -1;
          }
          // we loop in the scenario where there could be either
          // some unlimited and some limited or all limited. we
          // need to check inventory counts
          for (let i = 0; i < keys.length; i++) {
            const sel = selections[keys[i]];
            const unlimited = sel.limit === -1;
            const count = $.isNumeric(sel.count) ? sel.count : currentCount;
            if (count > sel.limit && !unlimited) {
              methods.lastOption = sel.value;
              return 0;
            }
          }
          return highestLimit;
        },
        lastOption: '',
        optionWarning: {},
        countWarning: {},
        onAddCount(e, params = {}) {
          // this could run on an "+" click or a new add-to-cart click
          let index;
          let added = true;
          let errorMsg = false;
          if ($.isNumeric(params.i)) {
            index = params.i;
          } else {
            const $btn = $(e.currentTarget);
            index = $btn.attr('data-item-index');
          }
          methods.countWarning = {};
          methods.optionWarning = {};
          const item = cartItems[index];
          const step = parseInt(item.product.countStep, 10);
          let itemInv;
          if (typeof params.inventory !== 'undefined') {
            // this is in the event the product with the same selected options are
            // in the cart so we just need to add to the count
            itemInv = params.inventory;
          } else {
            // this would be when the user clicks a "+" button from an item already
            // in the cart
            const testItem = methods.queryCounts({
              newCartItem: item,
              payload: { product: item.product._id },
              count: step,
            });
            itemInv = methods.getInventory({ item: testItem });
          }
          // max allowed is to limit how much a shopper can buy
          const maxAllowed = parseInt(item.product.maxPurchaseQuantity, 10);
          const newCount = item.count + step;
          const noInvLimit = itemInv === -1;
          const noMaxLimit = itemInv === -1;
          const noInventory = itemInv === 0;
          // does NOT have an inventory & max limit
          const fullyUnlimited = noInvLimit && noMaxLimit;
          // HAS an inventory & max limit
          const fullyLimited = !noInvLimit && !noMaxLimit;
          // inventory is limited but max quantity is unlimited
          const invLimitedMaxNot = !noInvLimit && noMaxLimit;
          // inventory is unlimited but max quantity is limited
          const maxLimitedInvNot = noInvLimit && !noMaxLimit;
          // inventory limit but no max allowed limit and desired count is less than
          // or equal to total inventory
          const addStepOne = invLimitedMaxNot && (newCount <= itemInv);
          // inventory & max allowed limited, desired count is under or equal to total inventory AND
          // desired count is less than or equal to the max allowed
          const addStepTwo = fullyLimited && newCount <= itemInv && newCount <= maxAllowed;
          // desired count is over maxAllowed
          const addOverMaxAllowed = fullyLimited && newCount > maxAllowed;
          // inventory limit but no max allowed limit and desired count is more
          // than total inventory
          const addMaxStepOne = invLimitedMaxNot && (newCount > itemInv);
          // inventory & max allowed limited, desired count is under the max allowed limit
          // but the new count is over the inventory limit
          const addMaxStepTwo = fullyLimited && newCount <= maxAllowed && newCount > itemInv;
          // max allowed limit but no inventory limit and desired count is less
          // than or equal to max allowed limit
          const addStepThree = maxLimitedInvNot && (newCount <= maxAllowed);
          // max allowed limit but no inventory limit and desired count is over max
          // allowed limit
          const makeMaxAllowedOne = maxLimitedInvNot && (newCount > maxAllowed);
          // inventory & max allowed limited, desired count is under or equal to total inventory AND
          // desired count is more than the max allowed
          const makeMaxAllowedTwo = fullyLimited && newCount <= itemInv && newCount > maxAllowed;
          if (noInventory) {
            // no inventory available to be added due to an option inventory limit
            // like size/color etc.
            added = false;
            if (!addOverMaxAllowed) {
              methods.optionWarning[index] = `Not enough ${methods.lastOption} items in stock.`;
              errorMsg = methods.optionWarning[index];
            }
          } else if (fullyUnlimited || addStepOne || addStepTwo || addStepThree) {
            item.count += step;
          } else if (addMaxStepOne || addMaxStepTwo) {
            // this will set the count to the most amount of times the step can fit
            // into the inventory limit
            item.count = Math.floor(itemInv / step) * step;
          } else if (makeMaxAllowedOne || makeMaxAllowedTwo) {
            item.count = maxAllowed;
          } else {
            methods.countWarning[index] = 'Limit Reached.';
            added = false;
            errorMsg = methods.countWarning[index];
          }
          // customer error checks
          if (addOverMaxAllowed) {
            methods.countWarning[index] = `Item limited to ${maxAllowed} per order.`;
          }
          methods.buildCart(cartItems);
          methods.saveCart(cartItems);
          return { added, errorMsg };
        },
        onRemoveCount(e) {
          const $btn = $(e.currentTarget);
          const index = $btn.attr('data-item-index');
          methods.countWarning = {};
          methods.optionWarning = {};
          const item = cartItems[index];
          const minAllowed = parseInt(item.product.minPurchaseQuantity, 10);
          const noMinLimit = minAllowed === -1;
          const step = parseInt(item.product.countStep, 10);
          const newCount = item.count - step;
          // no minimum purchase limit and desired count is greater than or
          // equal to step amount
          const removeStepOne = noMinLimit && newCount >= step;
          // item HAS a minimum quantity purchase limit and desired count
          // is greater than or equalt to minimum allowed or greater than or
          // equal to step amount
          const removeStepTwo = !noMinLimit && (newCount >= minAllowed || newCount >= step);
          // no minimum purchase limit and desired count is less than step amount
          const makeStepOne = noMinLimit && newCount < step;
          // item HAS a minimum quantity purchase limit and desired count
          // is less than the minimum allowed or less than the step amount
          const makeStepTwo = !noMinLimit && (newCount < minAllowed || newCount < step);

          if (removeStepOne || removeStepTwo) {
            item.count -= step;
          } else if (makeStepOne || makeStepTwo) {
            // TODO will this need to show trash can eventually on remove item
            item.count = 0;
          }
          methods.buildCart(cartItems);
          methods.saveCart(cartItems);
        },
        onSelectChange(e) {
          clearTimeout(methods.debounce);
          methods.debounce = setTimeout(() => {
            const $select = $(e.currentTarget);
            const index = $select.attr('data-item-index');
            const optionId = $select.attr('data-option-id');
            const selectedOption = $select.val();
            const item = cartItems[index];
            item.selectedOptions[optionId] = selectedOption;
            methods.countWarning = {};
            methods.optionWarning = {};
            // check based on options again,
            const testItem = methods.queryCounts({
              newCartItem: item,
              payload: { product: item.product._id },
              count: 0,
            });
            const inventory = methods.getInventory({ item: testItem });
            if (inventory === 0) {
              item.count = 0;
              methods.optionWarning[index] = `Not enough ${selectedOption} items in stock.`;
            }
            methods.buildCart(cartItems);
            methods.saveCart(cartItems);
          }, 250);
        },
        onTextChange(e) {
          clearTimeout(methods.debounce);
          methods.debounce = setTimeout(() => {
            const $textarea = $(e.currentTarget);
            const index = $textarea.attr('data-item-index');
            const optionId = $textarea.attr('data-option-id');
            const text = $textarea.val();
            cartItems[index].selectedOptions[optionId] = text;
            methods.saveCart(cartItems);
          }, 250);
        },
        onCheckChange(e) {
          clearTimeout(methods.debounce);
          methods.debounce = setTimeout(() => {
            const $checkbox = $(e.currentTarget);
            const index = $checkbox.attr('data-item-index');
            const optionId = $checkbox.attr('data-option-id');
            const checked = $checkbox.is(':checked');
            cartItems[index].selectedOptions[optionId] = checked;
            methods.saveCart(cartItems);
          }, 250);
        },
        onValidationError({ $form }) {
          if ($form.hasClass('drzSlideCheckout-form')) {
            methods.highestStep = 2;
          }
          if ($form.hasClass('drzSlideCheckout-form-payment')) {
            methods.highestStep = 3;
          }
        },
        saveCart(items) {
          storage.store[options.siteId] = { cartItems };
          window.localStorage.setItem('drzzleStorage', JSON.stringify(storage));
          return items;
        },
        getPreTaxTotal() {
          const dollars = `${options.currency.symbol}${Number(methods.preTaxTotal).toFixed(2)}`;
          const display = `${dollars} ${options.currency.type}`;
          $preTaxTotal.html(display);
        },
        getFromPercent(total, percent) {
          const p = percent || options.taxPercent;
          return parseFloat((p / 100) * total).toFixed(2);
        },
        getPriceNum(num) {
          return parseFloat(parseFloat(num).toFixed(2));
        },
        shipping: false,
        discount: false,
        getInfoTotals(params = {}) {
          const symbol = options.currency.symbol;
          const subtotal = methods.getPriceNum(methods.preTaxTotal);
          const tax = methods.getPriceNum(methods.taxTotal);
          let shipping = 0;
          let discount = 0;
          $infoSubTotal.html(`${symbol}${parseFloat(subtotal).toFixed(2)}`);
          $taxTotal.html(`${symbol}${parseFloat(tax).toFixed(2)}`);
          if ($.isNumeric(params.shipping)) {
            shipping = methods.getPriceNum(params.shipping);
            methods.shipping = shipping;
            $shippingTotal.show().html(`${symbol}${parseFloat(shipping).toFixed(2)}`);
          }
          if ($.isNumeric(params.discount)) {
            discount = methods.getPriceNum(params.discount);
            methods.discount = discount;
            $discountTotal.show().html(`${symbol}${parseFloat(discount).toFixed(2)}`);
          }
          const total = Number(
            methods.getPriceNum((methods.preTaxTotal + tax + shipping) - discount)).toFixed(2);
          $grandTotal.html(`${symbol}${total}`);
          methods.store.totals = {
            symbol,
            subtotal,
            shipping,
            discount,
            total,
          };
        },
        onApplyDiscount() {
          $applyText.hide();
          $btnLoader.show();
          $discountError.hide();
          $.ajax({
            type: 'GET',
            url: `${options.api}/v1/discounts`,
            data: {
              siteId: options.siteId,
              code: methods.store.shopper.discountCode,
            },
            contentType: 'application/json',
            success(res) {
              const payload = res.payload;
              let savings;
              if (payload.type === 'fixed') {
                savings = payload.savings;
              } else if (payload.type === 'percent') {
                savings = methods.getFromPercent(methods.preTaxTotal, payload.percent);
              }
              methods.getInfoTotals({
                shipping: methods.shipping,
                discount: savings,
              });
              $discountPrice.show();
            },
            error(e) {
              $discountError.show().html(e.responseJSON.payload.errorMessage);
            },
            complete() {
              $applyText.show();
              $btnLoader.hide();
            },
          });
        },
        buildCartItem(data, index) {
          const itemTotal = data.product.price * data.count;
          methods.totalItems += data.count;
          const hasError = methods.countWarning[index];
          const error = hasError ? `<div class="drzSlideCheckout-count-error">${hasError}</div>` : '';
          const hasOptError = methods.optionWarning[index];
          const optError = hasOptError ? `<div class="drzSlideCheckout-count-error">${hasOptError}</div>` : '';
          methods.preTaxTotal += itemTotal;
          if (data.product.isTaxable && options.taxPercent > 0 && !data.product.taxIncluded) {
            const tax = methods.getFromPercent(itemTotal);
            methods.taxTotal += parseFloat(tax);
          }
          let productOptions = '';
          let lastOptions = '';
          if (data.product.options && data.product.options.length > 0) {
            productOptions = '<div class="drzSlideCheckout-cart-itemOptions">';
            lastOptions = '<div class="drzSlideCheckout-last-options">';
            $.each(data.product.options, (i, option) => {
              const val = data.selectedOptions[option._id];
              let valText = '';
              // when values are strings
              if (typeof val === 'string') {
                valText = `${option.label}: ${val}`;
              } else if (typeof val === 'boolean' && val) {
                valText = option.label;
              }
              const optionEntry = valText !== '' ? `<span class="drzSlideCheckout-last-optionText">${valText}</span>` : '';
              lastOptions += optionEntry;
              if (option.type === 'select') {
                productOptions += `<div class="drzSlideCheckout-option-row"><div class="drzSlideCheckout-item-selectWrap">
                <label class="drzSlideCheckout-item-selectLabel" for="option-${option._id}">${option.label}</label>
                <select
                  data-item-index="${index}"
                  data-option-id="${option._id}"
                  data-count="${data.count}"
                  class="drzSlideCheckout-item-select"
                  id="option-${option._id}"
                  name="${option.label}">`;
                $.each(option.items, (j, item) => {
                  const selected = data.selectedOptions[option._id] === item.value ? ' selected' : '';
                  productOptions += `<option value="${item.value}"${selected}>${item.value}</option>`;
                });
                productOptions += '</select></div></div>';
              }
              if (option.type === 'checkbox') {
                const checked = data.selectedOptions[option._id] ? ' checked' : '';
                productOptions += `<div class="drzSlideCheckout-option-row">
                  <label class="drzSlideCheckout-itemCheckLabel" for="option-${option._id}">${option.label}</label>
                  <input
                    class="drzSlideCheckout-itemCheckbox"
                    data-item-index="${index}"
                    data-option-id="${option._id}"
                    id="option-${option._id}"
                    name="${option.label}"
                    type="checkbox"${checked} />
                </div>`;
              }
              if (option.type === 'textarea') {
                const text = data.selectedOptions[option._id] || '';
                productOptions += `<div class="drzSlideCheckout-option-row">
                  <label class="drzSlideCheckout-item-textLabel" for="option-${option._id}">${option.label}</label>
                  <textarea
                    class="drzSlideCheckout-item-textbox"
                    data-item-index="${index}"
                    data-option-id="${option._id}"
                    id="option-${option._id}"
                    name="${option.label}">${text}</textarea>
                </div>`;
              }
            });
            productOptions = `${productOptions}</div>`;
            lastOptions = `${lastOptions}</div>`;
          }
          const step = parseInt(data.product.countStep, 10);
          const newCount = data.count - step;
          const trashCount = newCount <= 0 ? ' drzSlideCheckout-cart-removeTrash' : '';
          // attach to final cart
          $finalList.append(`
            <div class="drzSlideCheckout-cart-itemLast">
              <div class="drzSlideCheckout-cart-leftCol">
                <img
                  class="drzSlideCheckout-cart-itemImg"
                  src="${options.assetMap[data.product._id] || data.product.image}"
                  alt="${data.product.name}" />
              </div>
              <div class="drzSlideCheckout-cart-itemInfo">
                <span class="drzSlideCheckout-cart-itemTitleLast">
                  <span>
                    ${data.product.name}
                    <span class="drzSlideCheckout-cart-itemLastTimes">x ${data.count}</span>
                  </span>
                  <span class="drzSlideCheckout-cart-itemLastPrice">
                    ${options.currency.symbol}${data.product.price}
                  </span>
                </span>
                ${lastOptions}
              </div>
            </div>
          `);
          return `
          <li class="drzSlideCheckout-cart-item" id="cart-item-${data.product._id}">
            <div class="drzSlideCheckout-cart-leftCol">
              <img
                class="drzSlideCheckout-cart-itemImg"
                src="${options.assetMap[data.product._id] || data.product.image}"
                alt="${data.product.name}" />
            </div>
            <div class="drzSlideCheckout-cart-itemInfo">
              <span class="drzSlideCheckout-cart-itemTitle">
                ${data.product.name}
              </span>
              <div class="drzSlideCheckout-item-detailsGrid">
                <div>
                  <span class="drzSlideCheckout-cart-itemPrice">
                    ${data.product.originalPrice ? `<span class="drzSlideCheckout-cart-itemPriceOriginal">${options.currency.symbol}${data.product.originalPrice}</span>` : ''}
                    ${options.currency.symbol}${data.product.price} ${options.currency.type}
                  </span>
                  <div class="drzSlideCheckout-cart-mainBtns">
                    <div class="drzSlideCheckout-cart-itemCounter">
                      <button
                        class="drzSlideCheckout-cart-remove${trashCount}"
                        data-item-index="${index}"
                        name="remove-count-${data.product.name}">
                      </button>
                      <div class="drzSlideCheckout-cart-itemCount">${data.count}</div>
                      <button
                        class="drzSlideCheckout-cart-add"
                        data-item-index="${index}"
                        name="add-count-${data.product.name}">
                      </button>
                    </div>
                    ${error}${optError}
                    <div class="drzSlideCheckout-cart-itemFooter">
                      <span class="drzSlideCheckout-cartItemTotal">Total: ${options.currency.symbol}${Number(itemTotal).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div>
                ${productOptions}
                </div>
              </div>
            </div>
            <div class="drzSlideCheckout-cart-itemRemove">
              <button
                class="drzSlideCheckout-cart-itemRemoveBtn"
                data-item-index="${index}"
                name="remove-item-${data.product.name}">
                Remove
              </button>
            </div>
          </li>
          `;
        },
        totalItems: 0,
        buildCart(list) {
          // remove cart list first
          $cartList.empty();
          $finalList.empty();
          methods.preTaxTotal = 0;
          methods.taxTotal = 0;
          methods.totalItems = 0;
          // build all cart items
          if (list.length < 1) {
            // this is in the event a user got to any next steps, came back
            // then removed all items. don't want to allow them to checkout again
            methods.highestStep = 1;
            $cartList.append($('<span class="drzSlideCheckout-hint-text">There are no items in your cart.</span>'));
            $checkoutBtn
              .addClass(classes.disabled)
              .prop('disabled', true);
          } else {
            $.each(list, (index, value) => {
              const $cartItem = $(methods.buildCartItem(value, index));
              const $removeItemBtn = $cartItem.find('.drzSlideCheckout-cart-itemRemoveBtn');
              const $removeItemTrash = $cartItem.find('.drzSlideCheckout-cart-removeTrash');
              const $addCountBtn = $cartItem.find('.drzSlideCheckout-cart-add');
              const $removeCountBtn = $cartItem.find('.drzSlideCheckout-cart-remove');
              $removeItemBtn.click(methods.onRemoveItemClick);
              $addCountBtn.click(methods.onAddCount);
              $removeCountBtn.click(methods.onRemoveCount);
              if ($removeItemTrash.length) {
                $removeItemTrash.click(methods.onRemoveItemClick);
              }
              // dynamic option listeners
              $cartItem.find('select')
                .change(methods.onSelectChange)
                .on('blur', () => this.buildCart(cartItems));
              $cartItem.find('textarea')
                .on('input', methods.onTextChange)
                .on('blur', () => this.buildCart(cartItems));
              $cartItem.find('input[type="checkbox"]')
                .change(methods.onCheckChange)
                .on('blur', () => this.buildCart(cartItems));
              $cartList.append($cartItem);
            });
            $checkoutBtn
              .removeClass(classes.disabled)
              .prop('disabled', false);
          }
          $cartCount.each(function setIconCount() {
            const $count = $(this);
            if (methods.totalItems < 1) {
              $count.hide();
            } else {
              $count.show();
            }
            $count.html(`(${methods.totalItems})`);
          });
          methods.getPreTaxTotal();
          methods.setActiveStep();
          // set buttons back to disabled
          $goToPaymentBtn.addClass(classes.disabled).prop('disabled', true);
          $shippingOptions.empty();
          methods.getInfoTotals({
            shipping: 0.00,
            discount: methods.discount,
          });
          $shipTotal.addClass(classes.shipTotal);
        },
        setActiveStep() {
          $slideCheckoutBox.find('[data-checkout-step]').removeClass(classes.activeStep);
          $slideCheckoutBox.find(`[data-checkout-step="${methods.activeStep}"]`).addClass(classes.activeStep);
          $legendItem.removeClass(classes.activeLegend);
          $legendItem.eq(methods.activeStep - 1).addClass(classes.activeLegend);
        },
        orderNumber: null,
        onPayClick(e) {
          if (!methods.store.purchased) {
            const $btn = $(e.currentTarget);
            const $hint = $btn.next('.drzSlideCheckout-purchasing-text');
            methods.store.purchased = true;
            $paymentError.hide();
            $payLoader.show();
            $payText.hide();
            $hint.removeClass('hide');
            $.ajax({
              type: 'POST',
              url: `${options.api}/v1/purchase`,
              data: JSON.stringify({
                siteId: options.siteId,
                date: new Date().toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                shopper: methods.store.shopper,
                cartItems: cartItems.map(item => ({
                  _id: item.product._id,
                  count: item.count,
                  name: item.product.name,
                  selectedOptions: item.selectedOptions,
                })),
              }),
              dataType: 'json',
              contentType: 'application/json',
              success(res) {
                const payload = res.payload;
                methods.activeStep = 4;
                methods.highestStep = 4;
                methods.setActiveStep();
                methods.fillConfirmation({
                  cartItems,
                  orderNumber: payload.orderNumber,
                });
                cartItems.splice(0, cartItems.length);
                methods.saveCart(cartItems);
                methods.totalItems = 0;
                $cartCount.each(function setIconCounts() {
                  $(this).hide().html('');
                });
                $backBtn.html('Back to Store');
                if (window.matchMedia(drzzle.viewports.mobile).matches) {
                  $('html, body').animate({ scrollTop: 0 }, 'fast');
                }
              },
              error(error) {
                methods.store.purchased = false;
                let message = 'There was an error processing order.';
                if (error.responseJSON) {
                  message = error.responseJSON.payload.errorMessage;
                }
                $paymentError.show().html(message);
              },
              complete() {
                $payLoader.hide();
                $payText.show();
                $hint.addClass('hide');
              },
            });
          }
        },
        fillConfirmation({ orderNumber }) {
          $orderNumber.html(`Order #${orderNumber}`);
          const $cart = $finalCart.clone();
          $cart.find('.drzSlideCheckout-checkout-pay').parent().remove();
          $lastStepCart.append($cart);
        },
        onShippingClick(evt) {
          const $btn = $(evt.currentTarget);
          $btn.addClass('drzSlideCheckout-shipping-loading');
          $shippingOptions.hide();
          $shippingOptsError.hide();
          $.ajax({
            type: 'GET',
            url: `${options.api}/v1/shipping`,
            data: {
              siteId: options.siteId,
              shipping: JSON.stringify(methods.store.shopper.shipping),
              contact: JSON.stringify(methods.store.shopper.contact),
              cartItems: JSON.stringify(
                cartItems.map(item => ({
                  _id: item.product._id,
                  count: item.count,
                  name: item.product.name,
                })),
              ),
            },
            contentType: 'application/json',
            success(res) {
              const payload = res.payload;
              const shipOptions = payload.options;
              $shippingOptions.html(shipOptions.map((option) => {
                const logo = !option.logo ? `<svg version="1.1" id="Layer_1" x="0px" y="0px"
                width="100%" height="100%" viewBox="0 0 512 303" style="fill:#656565;enable-background:new 0 0 512 303;" xml:space="preserve">
                <style type="text/css">
                .st0{fill-rule:evenodd;clip-rule:evenodd;}
                </style>
                <path class="st0" d="M365,3.016C409.391,13.316,426.371,39.273,447.66,75H365V3.016z M105.578,78c8.691,0,15,4.195,15,14
                c0,8.27-6.691,14.977-14.957,15H15c-8.285,0-15,6.719-15,15c0,8.285,6.715,15,15,15h135c8.363,0,15.059,6.711,15.059,15
                c0,8.285-6.715,15-15,15H15c-8.285,0-15,6.715-15,15s6.715,15,15,15h33v45c0,8.285,6.715,15,15,15h30.152
                c5.375,26.477,28.77,46,56.348,46s50.973-19.523,56.348-46h152.305c5.375,26.477,28.77,46,56.348,46s50.973-19.523,56.348-46H497
                c8.285,0,15-6.715,15-15v-90c0-44.012-46.422-46.934-46.465-47H350c-8.285,0-15-6.715-15-15V0H63c-8.285,0-15,6.715-15,15v33H30
                c-8.285,0-15,6.715-15,15s6.715,15,15,15H105.578z M433.945,226.055c10.738,10.738,10.738,28.156,0,38.895
                C416.672,282.223,387,269.934,387,245.5C387,221.07,416.672,208.781,433.945,226.055z M168.945,226.055
                c10.738,10.738,10.738,28.156,0,38.895C151.672,282.223,122,269.934,122,245.5C122,221.07,151.672,208.781,168.945,226.055z"/>
                </svg>` : '<span></span>';
                return `
                  <label class="drzSlideCheckout-shipping-option" for="${option.id}">
                    <input
                      type="radio"
                      class="drzSlideCheckout-shipping-check"
                      ${option.checked ? 'checked' : ''}
                      data-price="${option.price}"
                      value="${option.label}"
                      id="${option.id}"
                      name="shipping-option" />
                    <span class="drzSlideCheckout-shipping-label">
                      ${logo}
                      <span>
                        ${option.label}
                      </span>
                    </span>
                    <span class="drzSlideCheckout-shipping-price">
                      $${methods.getPriceNum(option.price)}
                    </span>
                  </label>
                `;
              }).join(''));
              $goToPaymentBtn.prop('disabled', false).removeClass(classes.disabled);
              // add shipping to totals and show
              const getShipping = $radio => parseFloat(parseFloat($radio.attr('data-price')).toFixed(2));
              const radios = $shippingOptions.find('.drzSlideCheckout-shipping-check');
              radios.on('change', (e) => {
                const option = $(e.currentTarget);
                const shipping = getShipping(option);
                methods.store.shopper.shipping.method = option.val();
                methods.store.shopper.shipping.rateOption = option.attr('id');
                methods.store.shopper.shipping.price = shipping;
                methods.getInfoTotals({
                  shipping,
                  discount: methods.discount,
                });
              });
              const selected = $shippingOptions.find('.drzSlideCheckout-shipping-check:checked');
              const shipping = getShipping(selected);
              methods.store.shopper.shipping.rateId = payload.shipment.id;
              methods.store.shopper.shipping.method = selected.val();
              methods.store.shopper.shipping.rateOption = selected.attr('id');
              methods.store.shopper.shipping.price = shipping;
              methods.getInfoTotals({
                shipping,
                discount: methods.discount,
              });
              $shipTotal.removeClass(classes.shipTotal);
              $accordionRadio.on('change', methods.onBillAddressChange);
            },
            error(e) {
              $shippingOptsError.show().html(e.responseJSON.payload.errorMessage);
            },
            complete() {
              $btn.removeClass('drzSlideCheckout-shipping-loading');
              $shippingOptions.show();
            },
          });
        },
        onFromClick(e) {
          e.preventDefault();
          // for after form validations
          const $btn = $(e.currentTarget);
          const from = ~~($btn.attr('data-from-step'));
          let nextStep = from + 1;
          if ($btn.hasClass(classes.itemLegend)) {
            // disallow moving back if purchased or purchasing
            if (methods.store.purchased) {
              return;
            }
            // these clicks come from the top legend
            nextStep = from;
            if (from > methods.highestStep) {
              return;
            }
          } else if (nextStep > methods.highestStep) {
            // this triggers when shopper clicks on a next btn
            methods.highestStep = nextStep;
          }
          if (nextStep === 2) {
            methods.getInfoTotals({
              discount: methods.discount,
              shipping: methods.shipping,
            });
          }
          if (nextStep === 3) {
            const shopper = methods.store.shopper;
            const shipping = shopper.shipping;
            $confirmEmail.html(shopper.contact.email);
            $confirmAddress.html(`${shipping.address}, ${shipping.city} ${shipping.state} ${shipping.zipCode}, ${shipping.country}`);
            $confirmMethod.html(`${shipping.method} (${options.currency.symbol}${shipping.price})`);
          }
          methods.activeStep = nextStep;
          methods.setActiveStep();
        },
        onClickAddToCart(e) {
          e.preventDefault();
          const $btn = $(e.currentTarget);
          if ($btn.hasClass(classes.disabled)) {
            return;
          }
          const optionAttr = $btn.attr('data-product-options');
          const detail = {
            product: $btn.attr('data-product-id'),
          };
          if (typeof optionAttr === 'string') {
            const parsed = $.parseJSON(optionAttr);
            detail.selectedOptions = parsed.selectedOptions;
            detail.count = parseInt(parsed.count, 10);
          }
          const addToCart = new CustomEvent('addToCart', { detail });
          window.dispatchEvent(addToCart);
        },
        onAccordionClick(e) {
          const $btn = $(e.currentTarget);
          const $index = $btn.parent().index();
          const $content = $btn.next('.drzSlideCheckout-radio-accordionContent');
          const $accordion = $btn.closest('.drzSlideCheckout-radio-accordion');
          $accordion.find('.drzSlideCheckout-radio-accordionContent')
            .each(function collapse() {
              const $item = $(this);
              const $itemIndex = $item.parent().index();
              if ($index !== $itemIndex) {
                $(this).slideUp('fast');
              }
            });
          if ($content.length) {
            $content.slideDown('fast');
          }
        },
        sameBillingAddress: true,
        onBillAddressChange(e) {
          const $radio = $(e.currentTarget);
          const val = $radio.attr('data-radio-value');
          const shopper = methods.store.shopper;
          if (val === 'different') {
            methods.sameBillingAddress = false;
            $billAddress.val('');
            shopper.payment.billing.address = '';
            $billApt.val('');
            shopper.payment.billing.apt = '';
            $billCity.val('');
            shopper.payment.billing.city = '';
            $billCountry.val('');
            shopper.payment.billing.country = '';
            $billState.val('');
            shopper.payment.billing.state = '';
            $zipCode.val('');
            shopper.payment.billing.zipCode = '';
          }
          if (val === 'same') {
            methods.sameBillingAddress = true;
            const shipping = shopper.shipping;
            $billAddress.val(shipping.address);
            shopper.payment.billing.address = shipping.address;
            $billApt.val(shipping.apt);
            shopper.payment.billing.apt = shipping.apt;
            $billCity.val(shipping.city);
            shopper.payment.billing.city = shipping.city;
            $billCountry.val(shipping.country);
            shopper.payment.billing.country = shipping.country;
            $billState.val(shipping.state);
            shopper.payment.billing.state = shipping.state;
            $zipCode.val(shipping.zipCode);
            shopper.payment.billing.zipCode = shipping.zipCode;
          }
        },
        optionsSame(first, second) {
          const f = Object.keys(first);
          if (f.length !== Object.keys(second).length) {
            return false;
          }
          for (let i = 0; i < f.length; i++) {
            const key = f[i];
            if (first[key] !== second[key]) {
              return false;
            }
          }
          return true;
        },
        queryCounts({ newCartItem, payload, count }) {
          const testCounts = {
            nonOptionCount: 0,
          };
          cartItems.forEach((item) => {
            if (item.product._id === payload.product) {
              $.each(item.selectedOptions, (id, val) => {
                const optId = `${id}-${val}`;
                if ($.isNumeric(testCounts[optId])) {
                  testCounts[optId] += item.count;
                } else {
                  testCounts[optId] = item.count;
                }
              });
              testCounts.nonOptionCount += item.count;
            }
          });
          const testOptions = {};
          // here we take the new cart item and add the count (step) to
          // the rest to get a total, this will bypass the standard step
          // addition in getInventory
          $.each(newCartItem.selectedOptions, (id, val) => {
            const optId = `${id}-${val}`;
            if ($.isNumeric(testCounts[optId])) {
              testCounts[optId] += count;
            } else {
              testCounts[optId] = count;
            }
            testOptions[id] = {
              selected: val,
              count: testCounts[optId],
            };
          });
          const testItem = $.extend(true, {}, newCartItem);
          testItem.selectedOptions = testOptions;
          testItem.count = testCounts.nonOptionCount + count;
          return testItem;
        },
        defaulSelOptions(product) {
          const selected = {};
          product.options.forEach((option) => {
            if (option.type === 'select' && option.items && option.items.length > 0) {
              selected[option._id] = option.items[0].value;
            }
          });
          return selected;
        },
        onProductAdded(e) {
          // this will run when a user clicks on an add to cart button on the page
          if (!methods.store.purchased) {
            const payload = e.detail;
            const index = cartItems.findIndex(item => item.product._id === payload.product);
            const alert = {
              show: true,
              error: false,
              message: 'Item Added to Cart!',
            };
            let added = false;
            let errorMsg = false;
            const product = mappedProducts[payload.product];
            if (!product) {
              errorMsg = 'Item no longer available.';
            }
            const countStep = product && product.countStep ? parseInt(product.countStep, 10) : 0;
            const count = $.isNumeric(payload.count) ? payload.count : countStep;
            const selectedOptions = payload.selectedOptions || methods.defaulSelOptions(product);
            const shopper = { count, selectedOptions };
            const newCartItem = $.extend(true, shopper, { product });
            if (index === -1 && product) {
              const inventory = methods.getInventory({ item: newCartItem });
              const canAdd = inventory > 0 || inventory === -1;
              const cannotAdd = inventory === 0;
              if (canAdd) {
                cartItems.push(newCartItem);
                added = true;
              } else if (cannotAdd) {
                errorMsg = 'Item currently out of stock.';
              }
            }
            if (index >= 0 && product) {
              // this would mean that at least one of the product is already in the cart
              const testItem = methods.queryCounts({ newCartItem, payload, count });
              const inventory = methods.getInventory({ item: testItem });
              const canAdd = inventory > 0 || inventory === -1;
              const cannotAdd = inventory === 0;
              const cartedIndex = cartItems.findIndex(item => item.product._id === payload.product
                && methods.optionsSame(
                  selectedOptions,
                  item.selectedOptions,
                ));
              if (cartedIndex >= 0 && canAdd) {
                // this is in the event the product with the same selected options are
                // in the cart so we just need to add to the count
                const addCount = methods.onAddCount(null, { i: cartedIndex, inventory });
                added = addCount.added;
                errorMsg = addCount.errorMsg;
              }

              if (cartedIndex < 0 && canAdd) {
                // this is in the event a user wants to add the same product in the
                // cart but with different select options (ex: size, color etc.)
                cartItems.push(newCartItem);
                added = true;
              }

              if (cannotAdd) {
                errorMsg = 'Item currently out of stock.';
              }
            }
            if (!added) {
              alert.error = true;
              alert.message = `Something went wrong. ${errorMsg || ''}`;
            }
            methods.triggerAlert(alert);
            methods.saveCart(cartItems);
            methods.buildCart(cartItems);
          }
        },
        $alert: null,
        attachAlert() {
          const $alertBox = $(`
            <div class="drzSlideCheckout-cart-alert">
              <div class="drzSlideCheckout-cart-alertIcon"></div>
              <div class="drzSlideCheckout-cart-alertContent">
                <div class="drzSlideCheckout-cart-alertRow">
                  <a href="#" class="drzSlideCheckout-cart-alertClose"></a>
                </div>
                <div class="drzSlideCheckout-cart-alertMsg">
                  Message here
                </div>
                <button
                  href="#"
                  name="alert-checkout"
                  class="drzSlideCheckout-cart-alertCO">Checkout</button>
              </div>
            </div>
          `);
          methods.$alert = $alertBox;
          $alertBox.find('[name="alert-checkout"]').click(methods.onCartClick);
          $alertBox.find('.drzSlideCheckout-cart-alertClose').click((e) => {
            e.preventDefault();
            methods.triggerAlert({ hide: true });
          });
          $alertBox.insertAfter($slideCheckoutBox);
        },
        triggerAlert(params) {
          if (params.show) {
            // if triggering an alert if it's already open, need to
            // close and reanimate
            if (methods.$alert.hasClass(classes.alertShow)) {
              methods.$alert.removeClass(classes.alertShow);
              setTimeout(() => {
                methods.$alert.addClass(classes.alertShow);
              }, 250);
            } else {
              methods.$alert.addClass(classes.alertShow);
            }
          }
          if (params.hide) {
            methods.$alert.removeClass(classes.alertShow);
          }
          if (params.error) {
            methods.$alert.addClass('drzSlideCheckout-cart-alertError');
          } else {
            setTimeout(() => {
              methods.$alert.removeClass('drzSlideCheckout-cart-alertError');
            }, 300);
          }
          if (params.message) {
            methods.$alert.find('.drzSlideCheckout-cart-alertMsg')
              .html(`<span role="alert">${params.message}</span>`);
          }
        },
        mapCart(cart = []) {
          // We use this to update any items saved in the cart from a users
          // previous session. In some cases, a store may update product info
          // so we always want that up to date in the frontend
          const map = [];
          cart.forEach((item) => {
            if (mappedProducts[item.product._id]) {
              const updated = $.extend(true, item, {
                product: mappedProducts[item.product._id],
              });
              map.push(updated);
            }
          });
          return map;
        },
        fetchProducts() {
          // fetch all products on pages
          const $productBtns = $('[data-product-id]');
          $productBtns.addClass(classes.disabled);
          const pageProducts = $productBtns.map(function mapProducts() {
            return $(this).attr('data-product-id');
          }).get();
          if (Array.isArray(cartItems)) {
            const cartItemIds = cartItems.map(item => item.product._id);
            cartItemIds.forEach((_id) => {
              if (!pageProducts.includes(_id)) {
                pageProducts.push(_id);
              }
            });
          }
          $.ajax({
            type: 'GET',
            url: `${options.api}/v1/products`,
            data: {
              siteId: options.siteId,
              products: JSON.stringify(pageProducts),
            },
            contentType: 'application/json',
            success(res) {
              $productBtns.removeClass(classes.disabled);
              res.payload.forEach((product) => {
                mappedProducts[product._id] = $.extend({}, product);
                if (product.outOfStock) {
                  // overall droplet element
                  $(`[data-product-droplet="${product._id}"]`).addClass('drzSlideCheckout-outOfStock');
                  // for any droplet elements that need no stock text
                  $(`[data-no-stock="${product._id}"]`).text('Out of Stock');
                  // any add to cart buttons that need to be disabled
                  $(`[name="add-to-cart"][data-product-id="${product._id}"]`).addClass(classes.disabled);
                }
              });
              cartItems = methods.mapCart(cartItems);
              methods.buildCart(cartItems);
            },
          });
        },
      };
      if (options.assetMap && typeof options.assetMap === 'string') {
        options.assetMap = JSON.parse(options.assetMap);
      }
      // bind all listeners
      $openCartBtn.click(methods.onCartClick);
      $backBtn.click(methods.onCartClick);
      // note: need to split some of the next button callbacks so
      // they do not fire twice (ie with the form validation callback)
      $fromStepBtn.click(methods.onFromClick);
      $legendShippingBtn.click(methods.onFromClick);
      $legendPayBtn.click(methods.onFromClick);
      methods.attachFormInputs($shippingForm);
      $shippingForm.drzFormValidate(methods.onFromClick, $goToPaymentBtn);
      $shippingForm.drzFormValidate(
        methods.onShippingClick,
        $selectShippingBtn,
        methods.onValidationError,
      );
      methods.attachFormInputs($discountForm);
      $discountForm.drzFormValidate(
        methods.onApplyDiscount,
        $discountBtn,
        methods.onValidationError,
      );
      // payment form
      methods.attachFormInputs($paymentForm);
      $paymentForm.drzFormValidate(
        methods.onPayClick,
        $payBtn,
        methods.onValidationError,
      );
      // add to cart listeners
      if (!methods.store.listening) {
        methods.store.listening = window.addEventListener(
          'addToCart',
          methods.onProductAdded,
        );
      }
      $addToCart.click(methods.onClickAddToCart);
      $accordionBtn.click(methods.onAccordionClick);
      $masks.each(function setMask() {
        const $mask = $(this);
        const mask = $mask.attr('data-mask');
        $mask.mask(mask);
      });
      if (!$alerts.length) {
        methods.attachAlert();
      }
      methods.fetchProducts();
      // pull in countries from our cdn
      $.getJSON(`${options.cdn}/info/shipping-countries.json?${Date.now()}`, (data) => {
        methods.countries = data;
      });
    });

    return $shoppingCart;
  };
})(jQuery);
