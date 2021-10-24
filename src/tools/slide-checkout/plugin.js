/* global jQuery */
(($) => {
  $.fn.drzSlideCheckout = function drzSlideCheckout(opts) {
    const defaults = {
      el: null,
      box: null,
      zIndex: null,
      taxPercent: 0,
      currency: {
        type: 'USD',
        symbol: '&#36;',
      },
    };
    const options = $.extend({}, defaults, opts);
    const drzzleStorage = window.localStorage.getItem('drzzleStorage');
    const storage = drzzleStorage ? JSON.parse(drzzleStorage) : {};
    storage.store = storage.store || {};
    const siteStore = storage.store[options.siteId] || {
      cartItems: [],
    };
    const cartItems = [
      {
        product: {
          _id: 'product-id-1',
          image: '/static/images/product-feature/t-shirt-mock-green.svg',
          name: 'Green Shirt',
          price: 25.22,
          isTaxable: true,
          taxIncluded: true,
          productQuantity: 5,
          maxPurchaseQuantity: 5,
          minPurchaseQuantity: 1,
          countStep: 2,
          shippable: true,
          options: [
            {
              _id: '11',
              type: 'select',
              label: 'Size',
              items: [
                {
                  value: 'S',
                },
                {
                  value: 'M',
                },
              ],
            },
            {
              _id: '22',
              type: 'checkbox',
              label: 'Gift',
              items: [
                {
                  value: false,
                },
              ],
            },
          ],
        },
        count: 2,
        selectedOptions: {
          11: 'M',
          22: false,
        },
      },
      {
        product: {
          _id: 'product-id-2',
          image: '/static/images/product-feature/t-shirt-mock-green.svg',
          name: 'Green Shirt',
          price: 5,
          isTaxable: true,
          taxIncluded: true,
          productQuantity: 5,
          maxPurchaseQuantity: 5,
          minPurchaseQuantity: 1,
          countStep: 1,
          shippable: true,
          options: [
            {
              _id: '1',
              type: 'select',
              label: 'Size',
              items: [
                {
                  value: 'S',
                },
                {
                  value: 'M',
                },
              ],
            },
            {
              _id: '2',
              type: 'checkbox',
              label: 'Gift',
              items: [
                {
                  value: false,
                },
              ],
            },
            {
              _id: '3',
              type: 'textarea',
              label: 'Notes',
              items: [
                {
                  value: false,
                },
              ],
            },
          ],
        },
        count: 4,
        selectedOptions: {
          1: 'S',
          2: true,
          3: 'some text 2',
        },
      },
    ];
    // TODO to come from api if needed?
    // const mappedProducts = {};
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
    };

    const $shoppingCart = $(this);

    $shoppingCart.each(function initShoppingCart() {
      const $slideCheckoutBox = $(this);
      const $openCartBtn = $(document).find('[name="open-shopping-cart"]');
      const $addToCart = $(document).find('[name="add-to-cart"]');
      const $backBtn = $slideCheckoutBox.find('.drzSlideCheckout-back');
      const $cartList = $slideCheckoutBox.find('.drzSlideCheckout-step-cartItems');
      const $preTaxTotal = $slideCheckoutBox.find('.drzSlideCheckout-step-preTaxTotal');
      const $discountBtn = $slideCheckoutBox.find('.drzSlideCheckout-apply-btn');
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
      const $shippingLoader = $slideCheckoutBox.find(`.${classes.loader}`);
      const $btnLoader = $slideCheckoutBox.find(`.${classes.btnLoader}`);
      const $applyText = $slideCheckoutBox.find('.drzSlideCheckout-apply-text');
      const $shippingOptions = $slideCheckoutBox.find(`.${classes.shipOptions}`);
      const $shipTotal = $slideCheckoutBox.find(`.${classes.shipTotal}`);
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

      if (options.zIndex) {
        $slideCheckoutBox.css({ zIndex: options.zIndex });
      }

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
              phone: '',
              price: 0,
              state: '',
              zipCode: '',
            },
          },
        },
        debounce: null,
        activeStep: 1,
        highestStep: 1,
        attachFormInputs($form) {
          const onUpdate = (e) => {
            const $this = $(e.currentTarget);
            const val = $this.val();
            const key = $this.attr('name');
            const keys = key.split('.');
            let store = methods.store.shopper;
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
        countWarning: {},
        onAddCount(e, i) {
          let index;
          if ($.isNumeric(i)) {
            index = i;
          } else {
            const $btn = $(e.currentTarget);
            index = $btn.attr('data-item-index');
          }
          methods.countWarning[index] = false;
          const item = cartItems[index];
          const itemStock = item.product.productQuantity;
          const maxAllowed = item.product.maxPurchaseQuantity;
          const noStockLimit = itemStock === -1;
          const noMaxLimit = maxAllowed === -1;
          const newCount = item.count + item.product.countStep;
          const bothLimits = !noStockLimit && !noMaxLimit;
          if (noStockLimit && noMaxLimit) {
            item.count += item.product.countStep;
          } else if (!noStockLimit && noMaxLimit && (newCount <= itemStock)) {
            item.count += item.product.countStep;
          } else if (!noStockLimit && noMaxLimit && (newCount > itemStock)) {
            item.count = itemStock;
          } else if (noStockLimit && !noMaxLimit && (newCount <= maxAllowed)) {
            item.count = item.product.countStep;
          } else if (noStockLimit && !noMaxLimit && (newCount > maxAllowed)) {
            item.count = maxAllowed;
          } else if (bothLimits && newCount <= itemStock && newCount <= maxAllowed) {
            item.count += item.product.countStep;
          } else if (bothLimits && newCount <= itemStock && newCount > maxAllowed) {
            item.count = maxAllowed;
          } else if (bothLimits && newCount <= maxAllowed && newCount > itemStock) {
            item.count += itemStock;
          } else {
            methods.countWarning[index] = 'Limit Reached.';
          }
          methods.buildCart(cartItems);
          methods.saveCart(cartItems);
        },
        onRemoveCount(e) {
          const $btn = $(e.currentTarget);
          const index = $btn.attr('data-item-index');
          methods.countWarning[index] = false;
          const item = cartItems[index];
          const minAllowed = item.product.minPurchaseQuantity;
          const noMinLimit = minAllowed === -1;
          const newCount = item.count - item.product.countStep;
          if (noMinLimit && newCount >= 1) {
            item.count -= item.product.countStep;
          } else if (noMinLimit && newCount < item.product.countStep) {
            item.count = item.product.countStep;
          } else if (!noMinLimit && newCount >= minAllowed) {
            item.count -= item.product.countStep;
          } else if (!noMinLimit && newCount < minAllowed) {
            item.count = minAllowed;
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
            cartItems[index].selectedOptions[optionId] = selectedOption;
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
          // siteStore.cartItems = items;
          // siteStore.
          // window.localStorage.setItem('drzzleStorage', JSON.stringify(siteStore));
          // TODO test some actual data with media
          return items;
        },
        getPreTaxTotal() {
          const dollars = `${options.currency.symbol}${methods.preTaxTotal}`;
          const display = `${dollars} ${options.currency.type}`;
          $preTaxTotal.html(display);
        },
        getPercent(total) {
          return parseFloat((options.taxPercent / 100) * total).toFixed(2);
        },
        getPriceNum(num) {
          return parseFloat(parseFloat(num).toFixed(2));
        },
        shipping: false,
        discount: false,
        getInfoTotals(params = {}) {
          const symbol = options.currency.symbol;
          const subtotal = methods.getPriceNum(methods.preTaxTotal);
          const tax = parseFloat(methods.getPercent(methods.preTaxTotal));
          let shipping = 0;
          let discount = 0;
          $infoSubTotal.html(`${symbol}${subtotal}`);
          $taxTotal.html(`${symbol}${tax}`);
          if ($.isNumeric(params.shipping)) {
            shipping = methods.getPriceNum(params.shipping);
            methods.shipping = shipping;
            $shippingTotal.show().html(`${symbol}${shipping}`);
          }
          if ($.isNumeric(params.discount)) {
            discount = methods.getPriceNum(params.discount);
            methods.discount = discount;
            $discountTotal.show().html(`${symbol}${discount}`);
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
          // TODO fetch discount api,
          $applyText.hide();
          $btnLoader.show();
          setTimeout(() => {
            methods.getInfoTotals({
              shipping: methods.shipping,
              discount: 10,
            });
            $applyText.show();
            $btnLoader.hide();
            // TODO only show discount if successful
            $discountPrice.show();
          }, 500);
        },
        buildCartItem(data, index) {
          const itemTotal = data.product.price * data.count;
          const error = methods.countWarning[index] ? `<div class="drzSlideCheckout-count-error">${methods.countWarning[index]}</div>` : '';
          methods.preTaxTotal += itemTotal;
          // TODO Need to calculate tax here, check if item is taxable
          // TODO Need to calculate shipping here?, check if item is shippable?
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
          // attach to final cart
          $finalList.append(`
            <div class="drzSlideCheckout-cart-itemLast">
              <div class="drzSlideCheckout-cart-leftCol">
                <img
                  class="drzSlideCheckout-cart-itemImg"
                  src="${data.product.image}"
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
                src="${data.product.image}"
                alt="${data.product.name}" />
            </div>
            <div class="drzSlideCheckout-cart-itemInfo">
              <span class="drzSlideCheckout-cart-itemTitle">
                ${data.product.name}
              </span>
              <div class="drzSlideCheckout-item-detailsGrid">
                <div>
                  <span class="drzSlideCheckout-cart-itemPrice">
                    ${options.currency.symbol}${data.product.price} ${options.currency.type}
                  </span>
                  <div class="drzSlideCheckout-cart-mainBtns">
                    <div class="drzSlideCheckout-cart-itemCounter">
                      <button
                        class="drzSlideCheckout-cart-remove"
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
                    ${error}
                    <div class="drzSlideCheckout-cart-itemFooter">
                      <span class="drzSlideCheckout-cartItemTotal">Total: ${options.currency.symbol}${itemTotal}</span>
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
        buildCart(list) {
          // remove cart list first
          $cartList.empty();
          $finalList.empty();
          methods.preTaxTotal = 0;
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
            // TODO if at least 1 shippable
            $.each(list, (index, value) => {
              const $cartItem = $(methods.buildCartItem(value, index));
              const $removeItemBtn = $cartItem.find('.drzSlideCheckout-cart-itemRemoveBtn');
              const $addCountBtn = $cartItem.find('.drzSlideCheckout-cart-add');
              const $removeCountBtn = $cartItem.find('.drzSlideCheckout-cart-remove');
              $removeItemBtn.click(methods.onRemoveItemClick);
              $addCountBtn.click(methods.onAddCount);
              $removeCountBtn.click(methods.onRemoveCount);
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
          methods.getPreTaxTotal();
          methods.setActiveStep();
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
            const $hint = $btn.next('.drzSlideCheckout-hint-text');
            methods.store.purchased = true;
            $paymentError.hide();
            $payLoader.show();
            $payText.hide();
            $hint.removeClass('hide');
            setTimeout(() => {
              $payLoader.hide();
              $payText.show();
              $hint.addClass('hide');
              methods.activeStep = 4;
              methods.highestStep = 4;
              methods.setActiveStep();
              methods.fillConfirmation({
                cartItems,
                orderNumber: '1234-5678-98433',
              });
              cartItems.splice(0, cartItems.length);
              methods.saveCart(cartItems);
              $backBtn.html('Back to Store');
              if (window.matchMedia(drzzle.viewports.mobile).matches) {
                $('html, body').animate({ scrollTop: 0 }, 'fast');
              }
              // TODO methods.store.purchased = false; if failed
              // $paymentError.show().html('error');
            }, 3000);
          }
        },
        fillConfirmation({ orderNumber }) {
          $orderNumber.html(`Order #${orderNumber}`);
          const $cart = $finalCart.clone();
          $cart.find('.drzSlideCheckout-checkout-pay').parent().remove();
          $lastStepCart.append($cart);
        },
        onShippingClick() {
          $shippingLoader.show();
          $shippingOptions.hide();
          // TODO fetch real shipping options!
          setTimeout(() => {
            const shipOptions = [
              { type: 'UPS Ground', price: 0, checked: true },
              { type: 'UPS Express', price: 10.334444 },
              { type: 'Next Day Air', price: 35 },
            ];
            $shippingOptions.html(shipOptions.map(option => `
              <label class="drzSlideCheckout-shipping-option" for="${option.type}">
                <span class="drzSlideCheckout-shipping-label">
                  ${option.type}
                </span>
                <input
                  type="radio"
                  class="drzSlideCheckout-shipping-check"
                  ${option.checked ? 'checked' : ''}
                  data-price="${option.price}"
                  value="${option.type}"
                  id="${option.type}"
                  name="shipping-option" />
                <span class="drzSlideCheckout-shipping-price">
                  $${methods.getPriceNum(option.price)}
                </span>
              </label>
            `).join(''));
            $shippingLoader.hide();
            $shippingOptions.show();
            $goToPaymentBtn.prop('disabled', false).removeClass(classes.disabled);
            // add shipping to totals and show
            const getShipping = $radio => parseFloat(parseFloat($radio.attr('data-price')).toFixed(2));
            const radios = $shippingOptions.find('.drzSlideCheckout-shipping-check');
            radios.on('change', (e) => {
              const option = $(e.currentTarget);
              const shipping = getShipping(option);
              methods.store.shopper.shipping.method = option.val();
              methods.store.shopper.shipping.price = shipping;
              methods.getInfoTotals({
                shipping,
                discount: methods.discount,
              });
            });
            const selected = $shippingOptions.find('.drzSlideCheckout-shipping-check:checked');
            const shipping = getShipping(selected);
            methods.store.shopper.shipping.method = selected.val();
            methods.store.shopper.shipping.price = shipping;
            methods.getInfoTotals({
              shipping,
              discount: methods.discount,
            });
            $shipTotal.removeClass(classes.shipTotal);
            $accordionRadio.on('change', methods.onBillAddressChange);
          }, 500);
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
          const addToCart = new CustomEvent('addToCart', { detail: {
            product: $btn.attr('data-product-id'),
          } });
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
        onProductAdded(e) {
          if (!methods.store.purchased) {
            const payload = e.detail;
            console.log('add to cart: ', payload);
            const index = cartItems.findIndex(item => item._id === payload.product);
            if (index === -1) {
              // TODO need to fetch all products from $addToCart id's
              // TODO maybe add loaders on add to cart buttons?
              // cartItems.push({});
            } else {
              // methods.onAddCount(null, index);
            }
            // TODO check for options
            methods.saveCart(cartItems);
            methods.buildCart(cartItems);
          }
        },
      };

      // bind all listeners
      $openCartBtn.click(methods.onCartClick);
      $backBtn.click(methods.onCartClick);
      methods.buildCart(cartItems);
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
      $goToPaymentBtn.addClass(classes.disabled).prop('disabled', true);
      $accordionBtn.click(methods.onAccordionClick);
      $masks.each(function setMask() {
        const $mask = $(this);
        const mask = $mask.attr('data-mask');
        $mask.mask(mask);
      });
    });

    return $shoppingCart;
  };
})(jQuery);
