(($) => {
  $.fn.drzProductFeed = function productFeed(params) {
    const $productFeed = $(this);
    const $curData = $productFeed.attr('data-currency');
    const $sort = $productFeed.attr('data-sort') || 'newest';
    const $filterAttr = $productFeed.attr('data-filter');
    const $filters = $filterAttr ? $filterAttr.split(',') : [];
    const $limitAttr = $productFeed.attr('data-items');
    const $limit = $limitAttr ? parseInt($limitAttr, 10) : 4;
    let $currency = { type: 'usd', symbol: '&#36;' };
    if ($curData) {
      $currency = JSON.parse($curData);
    }
    const methods = {
      buildCard(data) {
        return `
        <a class="drzProduct-feed-card" href="${data.pageLink}">
          <div class="drzProduct-feed-cardImageWrap">
            <img class="drzProduct-feed-cardImage" src="${data.itemImage}" alt="${data.itemName}" />
          </div>
          <div class="drzProduct-feed-cardInfo">
            <span class="drzProduct-feed-name">${data.itemName}</span>
            <span class="drzProduct-feed-price">${$currency.symbol}${data.prices[$currency.type]}</span>
          </div>
        </a>
        `;
      },
    };
    const list = params.feed || [];
    // set by newest by default
    let products = list.sort((a, b) => new Date(b.created) - new Date(a.created));
    if ($sort === 'oldest') {
      products = products.reverse();
    }
    products = products.slice(0, $limit);
    if ($filters) {
      products = products.filter(p => $filters.every(f => p.categories.indexOf(f) > -1));
    }
    $productFeed.each(function initPlugin() {
      const $this = $(this);
      const $cardList = $this.find('.drzProduct-feed-cards');
      if (products.length > 0) {
        $.each(products, (index, value) => {
          const $newCard = $(methods.buildCard(value));
          $cardList.append($newCard);
        });
      } else if (!$this.find('.drzProduct-feed-empty').length) {
        $this.append($('<span class="drzProduct-feed-empty">No Products Found</span>'));
      }
    });
    $.fn.drzProductFeed.destroy = () => {
      const $emptyMsg = $productFeed.find('.drzProduct-feed-empty');
      if ($emptyMsg.length) {
        $emptyMsg.remove();
      }
    };
    return $productFeed;
  };
})(jQuery);
