(($) => {
  $.fn.drzProductFeed = function productFeed(options) {
    const $productFeed = $(this);
    const $curData = $productFeed.attr('data-currency');
    const $sort = $productFeed.attr('data-sort') || 'newest';
    const $filterAttr = $productFeed.attr('data-filter');
    const $filters = $filterAttr ? $filterAttr.split(',') : false;
    const $limitAttr = $productFeed.attr('data-items');
    const $limit = $limitAttr ? parseInt($limitAttr, 10) : 4;
    const $matchAttr = $productFeed.attr('data-match');
    const $match = $matchAttr || 'all';
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
            <span class="drzProduct-feed-price">
            ${$currency.symbol}${data.prices[$currency.type]}
            <button data-product="${data._id}" class="drzProduct-feed-buyBtn"></button>
            </span>
          </div>
        </a>
        `;
      },
      buyClick(e) {
        e.preventDefault();
        if (options.onCartAdd) {
          options.onCartAdd(e);
        }
      },
    };
    const list = options.feed || [];
    // set by newest by default
    let products = list.sort((a, b) => new Date(b.publishedOn) - new Date(a.publishedOn));
    if ($sort === 'oldest') {
      products = products.reverse();
    }
    products = products.slice(0, $limit);
    if ($filters) {
      // match all option
      if ($match === 'all') {
        products = products.filter(p => $filters.every(f => p.categories.indexOf(f) > -1));
      }
      // match some option
      if ($match === 'some') {
        products = products.filter(p => $filters.some(f => p.categories.indexOf(f) >= 0));
      }
    }
    $productFeed.each(function initPlugin() {
      const $this = $(this);
      const $cardList = $this.find('.drzProduct-feed-cards');
      if (products.length > 0) {
        $.each(products, (index, value) => {
          const $newCard = $(methods.buildCard(value));
          const $buyBtn = $newCard.find('.drzProduct-feed-buyBtn');
          $buyBtn.click(methods.buyClick);
          $cardList.append($newCard);
        });
      } else if (!$this.find('.drzProduct-feed-empty').length) {
        $this.append($('<span class="drzProduct-feed-empty">No Products Found</span>'));
      }
      $.fn.drzProductFeed.destroy = ($el) => {
        const $emptyMsg = $el.find('.drzProduct-feed-empty');
        if ($emptyMsg.length) {
          $emptyMsg.remove();
        }
        $el.find('.drzProduct-feed-cards').html('');
      };
    });
    return $productFeed;
  };
})(jQuery);
