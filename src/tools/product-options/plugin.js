/* global jQuery */
(($) => {
  $.fn.drzProductOptions = function productOptions() {
    const $droplet = $(this);
    const methods = {
      payload: {},
      updateOptions({ $addBtn }) {
        $addBtn.each(function setDefaultSelected() {
          const $b = $(this);
          $b.attr('data-product-options', JSON.stringify(methods.payload));
        });
      },
    };
    $droplet.each(function initProductOptions() {
      const $product = $(this);
      const $addBtn = $product.find('[name="add-to-cart"]');
      const $selects = $product.find('select[data-product-option]');
      const $productCount = $product.find('[name="product-count"]');
      const $countBtns = $product.find('[name="add-product-count"], [name="remove-product-count"]');
      const selectedOptions = {};
      $selects.each(function setSelect() {
        const $select = $(this);
        const id = $select.attr('data-product-option');
        selectedOptions[id] = $select.val();
        $select.change((e) => {
          methods.payload.selectedOptions[id] = $(e.currentTarget).val();
          methods.updateOptions({ $addBtn });
        });
      });
      $countBtns.click((e) => {
        e.preventDefault();
        methods.payload.count = $productCount.text();
        methods.updateOptions({ $addBtn });
      });
      const count = $productCount.text();
      methods.payload = { selectedOptions, count };
      methods.updateOptions({ $addBtn });
    });
    return $droplet;
  };
})(jQuery);
