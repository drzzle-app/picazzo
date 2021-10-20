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
    const $button = $(this);
    const $slideCheckoutBox = options.box;
    const classes = {
      open: 'drzSlideCheckout-open',
      disabled: 'drzSlideCheckout-checkout-btnDisabled',
      activeStep: 'drzSlideCheckout-step-active',
      activeLegend: 'drzSlideCheckout-step-legendActive',
      itemLegend: 'drzSlideCheckout-step-legendItem',
      loader: 'drzSlideCheckout-loader',
      shipOptions: 'drzSlideCheckout-shipping-optionList',
      shipTotal: 'drzSlideCheckout-step-shipping',
    };
    const $addToCart = $(document).find('[name="add-to-cart"]');
    const $backBtn = $slideCheckoutBox.find('.drzSlideCheckout-back');
    const $cartList = $slideCheckoutBox.find('.drzSlideCheckout-step-cartItems');
    const $preTaxTotal = $slideCheckoutBox.find('.drzSlideCheckout-step-preTaxTotal');
    const $infoSubTotal = $slideCheckoutBox.find('[name="subtotal"]');
    const $shippingTotal = $slideCheckoutBox.find('[name="shipping"]');
    const $taxTotal = $slideCheckoutBox.find('[name="tax"]');
    const $discountTotal = $slideCheckoutBox.find('[name="discount"]');
    const $grandTotal = $slideCheckoutBox.find('[name="grand-total"]');
    const $checkboxBtn = $slideCheckoutBox.find('.drzSlideCheckout-checkout-btn');
    const $legendItem = $slideCheckoutBox.find(`.${classes.itemLegend}`);
    const $fromStepBtn = $slideCheckoutBox.find('[data-from-step]').not('[data-from-step="2"]');
    const $goToPaymentBtn = $slideCheckoutBox.find('.drzSlideCheckout-checkout-btn[data-from-step="2"]');
    const $selectShippingBtn = $slideCheckoutBox.find('.drzSlideCheckout-shipping-optionBtn');
    const $legendPaymentBtn = $slideCheckoutBox.find('.drzSlideCheckout-step-legendItem[data-from-step="2"]');
    const $shippingForm = $slideCheckoutBox.find('.drzSlideCheckout-form');
    const $shippingLoader = $slideCheckoutBox.find(`.${classes.loader}`);
    const $shippingOptions = $slideCheckoutBox.find(`.${classes.shipOptions}`);
    const $shipTotal = $slideCheckoutBox.find(`.${classes.shipTotal}`);
    const drzzleStorage = window.localStorage.getItem('drzzleStorage');
    const storage = drzzleStorage ? JSON.parse(drzzleStorage) : {};
    storage.store = storage.store || {};
    const siteStore = storage.store[options.siteId] || {
      cartItems: [],
    };

    if (options.zIndex) {
      $slideCheckoutBox.css({ zIndex: options.zIndex });
    }

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
            // {
            //   _id: 1,
            //   type: 'select',
            //   label: 'Size',
            //   items: [
            //     {
            //       value: 'S',
            //     },
            //     {
            //       value: 'M',
            //     },
            //   ],
            // },
            // {
            //   _id: 2,
            //   type: 'checkbox',
            //   label: 'Gift',
            //   items: [
            //     {
            //       value: false,
            //     },
            //   ],
            // },
          ],
        },
        count: 2,
        // selectedOptions: {
        //   1: 'M',
        //   2: true,
        // },
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
              _id: 1,
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
              _id: 2,
              type: 'checkbox',
              label: 'Gift',
              items: [
                {
                  value: false,
                },
              ],
            },
            {
              _id: 3,
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

    const methods = {
      // TODO: reset back to 1?
      toggleCheckout($box) {
        if ($box.hasClass(classes.open)) {
          $box.removeClass(classes.open);
        } else {
          $box.addClass(classes.open);
        }
      },
      store: {
        listening: false,
      },
      activeStep: 1,
      highestStep: 1,
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
      // TODO debounce these
      onSelectChange(e) {
        const $select = $(e.currentTarget);
        const index = $select.attr('data-item-index');
        const optionId = $select.attr('data-option-id');
        const selectedOption = $select.val();
        cartItems[index].selectedOptions[optionId] = selectedOption;
        methods.saveCart(cartItems);
      },
      onTextChange(e) {
        const $textarea = $(e.currentTarget);
        const index = $textarea.attr('data-item-index');
        const optionId = $textarea.attr('data-option-id');
        const text = $textarea.val();
        cartItems[index].selectedOptions[optionId] = text;
        methods.saveCart(cartItems);
      },
      onCheckChange(e) {
        const $checkbox = $(e.currentTarget);
        const index = $checkbox.attr('data-item-index');
        const optionId = $checkbox.attr('data-option-id');
        const checked = $checkbox.is(':checked');
        cartItems[index].selectedOptions[optionId] = checked;
        methods.saveCart(cartItems);
      },
      onValidationError() {
        // TODO disable proceed to checkout button,
        // TODO make highestStep the shipping step
      },
      saveCart(items) {
        // siteStore.cartItems = items;
        // siteStore.
        // window.localStorage.setItem('drzzleStorage', JSON.stringify(siteStore));
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
      getInfoTotals(params = {}) {
        const symbol = options.currency.symbol;
        const subtotal = methods.preTaxTotal;
        const tax = parseFloat(methods.getPercent(methods.preTaxTotal));
        let shipping = 0;
        let discount = 0;
        $infoSubTotal.html(`${symbol}${subtotal}`);
        $taxTotal.html(`${symbol}${tax}`);
        if ($.isNumeric(params.shipping)) {
          shipping = params.shipping;
          $shippingTotal.show().html(`${symbol}${shipping}`);
        }
        if ($.isNumeric(params.discount)) {
          discount = params.discount;
          $discountTotal.show().html(`${symbol}${discount}`);
        }
        const total = (methods.preTaxTotal + tax + shipping) - discount;
        $grandTotal.html(`${symbol}${total}`);
      },
      preTaxTotal: 0,
      buildCartItem(data, index) {
        const itemTotal = data.product.price * data.count;
        const error = methods.countWarning[index] ? `<div class="drzSlideCheckout-count-error">${methods.countWarning[index]}</div>` : '';
        methods.preTaxTotal += itemTotal;
        let productOptions = '';
        if (data.product.options && data.product.options.length > 0) {
          productOptions = '<div class="drzSlideCheckout-cart-itemOptions">';
          $.each(data.product.options, (i, option) => {
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
        }
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
        methods.preTaxTotal = 0;
        // build all cart items
        if (list.length < 1) {
          // this is in the event a user got to any next steps, came back
          // then removed all items. don't want to allow them to checkout again
          methods.highestStep = 1;
          $checkboxBtn
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
            $cartItem.find('select').change(methods.onSelectChange);
            $cartItem.find('textarea').on('input', methods.onTextChange);
            $cartItem.find('input[type="checkbox"]').change(methods.onCheckChange);
            $cartList.append($cartItem);
          });
          $checkboxBtn
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
      onShippingClick() {
        $shippingLoader.show();
        $shippingOptions.hide();
        // TODO fetch real shipping options!
        setTimeout(() => {
          const shipOptions = [
            { type: 'UPS Ground', price: '0', checked: true },
            { type: 'UPS Express', price: '10.33' },
            { type: 'Next Day Air', price: '35' },
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
                $${option.price}
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
            methods.getInfoTotals({ shipping });
          });
          const selected = $shippingOptions.find('.drzSlideCheckout-shipping-check:checked');
          const shipping = getShipping(selected);
          methods.getInfoTotals({ shipping });
          $shipTotal.removeClass(classes.shipTotal);
        }, 1500);
      },
      onFromClick(e) {
        e.preventDefault();
        // for after form validations
        const $btn = $(e.currentTarget);
        const from = ~~($btn.attr('data-from-step'));
        let nextStep = from + 1;
        if ($btn.hasClass(classes.itemLegend)) {
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
          methods.getInfoTotals();
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
      onProductAdded(e) {
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
      },
    };

    // TODO bind this to the box instead then search for buttons
    $button.each(function initSlideCheckout() {
      const $this = $(this);
      $this.click(methods.onCartClick);
      $backBtn.click(methods.onCartClick);
      methods.buildCart(cartItems);
      // note: need to split some of the next button callbacks so
      // they do not fire twice (ie with the form validation callback)
      $fromStepBtn.click(methods.onFromClick);
      $legendPaymentBtn.click(methods.onFromClick);
      $goToPaymentBtn.click(methods.onFromClick);
      $shippingForm.drzFormValidate(methods.onShippingClick, $selectShippingBtn);
      // add to cart listeners
      if (!methods.store.listening) {
        methods.store.listening = window.addEventListener(
          'addToCart',
          methods.onProductAdded,
        );
      }
      $addToCart.click(methods.onClickAddToCart);
      $goToPaymentBtn.addClass(classes.disabled).prop('disabled', true);
    });

    return $button;
  };
})(jQuery);
