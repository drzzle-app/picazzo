/*
============================
 Drzzle Nav Plugin
============================
*/
(($) => {
  $.fn.drzNav = function drzNav() {
    const $this = $(this);
    const $inner = $this.find('.drzNav-inner');
    const $navList = $this.find('.drzNav-list');
    const $dropDownLink = $this.find('.drzNav-link-dropDown');
    const $subDropDownLink = $this.find('.drzNav-link-subDropDown');
    const $navHamburger = $this.find('.drzNav-hamburger');
    const $navLogo = $this.find('.drzNav-logo');
    const $navSearch = $this.find('.drzNav-search');
    const $navCart = $this.find('.drzNav-cart');
    const $linksWidth = ~~($navList.outerWidth());
    const slShowCls = 'drzNav-subList-show';
    const slCls = '.drzNav-subList';
    // options
    let $opts = $this.attr('data-nav-slide');
    const defaults = {
      slideDirection: 'left',
    };
    // configure custom options
    if (typeof $opts !== typeof undefined && $opts !== false && $opts !== '') {
      $opts = {
        slideDirection: $opts,
      };
      $opts = $.extend(true, {}, defaults, $opts);
    } else {
      $opts = defaults;
    }
    const slideDirection = $opts.slideDirection;

    // Assign defaults for variables
    let navIsContained = false;
    let sliderIsOpen = false;
    let $navWidth = ~~($this.outerWidth());
    let $hamburgerWidth = 0;
    let $logoWidth = 0;
    let $logoMarginLeft = 0;
    let $logoMarginRight = 0;
    let $searchWidth = 0;
    let $searchMarginLeft = 0;
    let $searchMarginRight = 0;
    let $cartWidth = 0;
    let $cartMarginLeft = 0;
    let $cartMarginRight = 0;

    if ($navHamburger.is(':visible')) {
      $hamburgerWidth = ~~($navHamburger.outerWidth());
    }
    if ($navLogo.is(':visible')) {
      $logoWidth = ~~($navLogo.outerWidth());
    }

    // Insert slide out container
    let $sliderContainer = $(
      `<div class="drzNav-overlay">
        <div class="drzNav-slideContainer drzNav-slideContainer-${slideDirection}">
          <div class="drzNav-sliderClose-row">
            <button class="drzNav-sliderClose-btn"></button>
          </div>
        </div>
      </div>`);

    $sliderContainer.insertAfter($this);
    const $sliderOverlay = $this.next('.drzNav-overlay');
    $sliderContainer = $sliderOverlay.find('.drzNav-slideContainer');
    const $closeSliderBtn = $sliderContainer.find('.drzNav-sliderClose-btn');

    $.expr.filters.offscreen = (el) => {
      const $el = $(el);
      const $window = $(window);
      return (
        $el.offset().left + ($el.outerWidth() - $window.scrollLeft()) > $window.width() ||
        $el.offset().left < $window.scrollLeft());
    };

    const navActions = {
      desktopDropDown($ddLink) {
        const $nextMenu = $ddLink.next(slCls);
        const delay = 400;
        let offTimer;
        $ddLink.mouseover(() => {
          if (!navIsContained) {
            clearTimeout(offTimer);
            $nextMenu.addClass(slShowCls);
            if ($nextMenu.is(':offscreen')) {
              const css = {
                top: '2px',
              };
              if ($this.hasClass('drzNav-links-right')) {
                css.left = '100%';
              } else if ($this.hasClass('drzNav-links-left') ||
                         $this.hasClass('drzNav-links-center')) {
                css.left = '-100%';
              }
              $nextMenu.css(css);
            }
          }
        }).mouseleave(() => {
          if (!navIsContained) {
            offTimer = setTimeout(() => {
              $nextMenu.removeClass(slShowCls);
            }, delay);
          }
        });
        $nextMenu.mouseover(() => {
          if (!navIsContained) {
            clearTimeout(offTimer);
            $nextMenu.addClass(slShowCls);
          }
        }).mouseleave(() => {
          if (!navIsContained) {
            offTimer = setTimeout(() => {
              $nextMenu.removeClass(slShowCls);
              navActions.removeSubInlines();
            }, delay);
          }
        });
      },
      removeSubInlines() {
        const $subLists = $this.find(slCls);
        $subLists.each(function removeAllInlines() {
          $(this).css({
            left: '',
            right: '',
            top: '',
          });
        });
      },
      sliderDropDown(e) {
        e.preventDefault();
        if (navIsContained || window.matchMedia(drzzle.viewports.mobile).matches) {
          const $el = $(e.currentTarget);
          $el.toggleClass('drzNav-rotateArrow');
          $el.next(slCls).toggleClass(slShowCls);
        }
      },
      openSlider(e) {
        if (typeof e !== typeof undefined && e !== false) {
          e.preventDefault();
        }
        if (!sliderIsOpen) {
          $sliderOverlay.fadeIn(200);
          $sliderContainer.addClass(`drzNav-slideContainer-${slideDirection}Show`);
        }
        sliderIsOpen = true;
      },
      closeSlider(e) {
        if (typeof e !== typeof undefined && e !== false) {
          e.preventDefault();
        }
        if (sliderIsOpen) {
          $sliderContainer.removeClass(`drzNav-slideContainer-${slideDirection}Show`);
          $sliderOverlay.fadeOut(200);
        }
        sliderIsOpen = false;
      },
      checkAnchor(e) {
        const $el = $(e.currentTarget);
        const $href = $el.attr('href');
        if (sliderIsOpen && $href.match(/^#|^\/#/gi)) {
          navActions.closeSlider();
          if ($href.match(/^#/gi)) {
            e.preventDefault();
          }
        }
      },
      resetNav() {
        // reset any arrows on dropdowns in the slider that may have been closed in desktop
        const $subLinks = $sliderContainer.find(slCls);
        $subLinks.each(function resetArrows() {
          const $link = $(this);
          if ($link.hasClass(slShowCls)) {
            $link.prev('a').addClass('drzNav-rotateArrow');
          } else {
            $link.prev('a').removeClass('drzNav-rotateArrow');
          }
        });
      },
      fitCheck() {
        $navWidth = ~~($inner.outerWidth());
        // recheck for hamburgerWidth and navWidth
        if ($navHamburger.is(':visible')) {
          $hamburgerWidth = ~~($navHamburger.outerWidth());
        } else {
          $hamburgerWidth = 0;
        }
        if ($navLogo.is(':visible') && $navLogo.length) {
          $logoWidth = ~~($navLogo.outerWidth());
          $logoMarginLeft = parseInt($navLogo.css('margin-left'), 10);
          $logoMarginRight = parseInt($navLogo.css('margin-right'), 10);
        } else {
          $logoWidth = 0;
          $logoMarginLeft = 0;
          $logoMarginRight = 0;
        }
        if ($navCart.is(':visible') && $navCart.length) {
          $cartWidth = ~~($navCart.outerWidth());
          $cartMarginLeft = parseInt($navCart.css('margin-left'), 10);
          $cartMarginRight = parseInt($navCart.css('margin-right'), 10);
        } else {
          $cartWidth = 0;
          $cartMarginLeft = 0;
          $cartMarginRight = 0;
        }
        if ($navSearch.is(':visible') && $navSearch.length) {
          $searchWidth = ~~($navSearch.outerWidth());
          $searchMarginLeft = parseInt($navSearch.css('margin-left'), 10);
          $searchMarginRight = parseInt($navSearch.css('margin-right'), 10);
        } else {
          $searchWidth = 0;
          $searchMarginLeft = 0;
          $searchMarginRight = 0;
        }
        // add in left/right padding & margins of nav items that don't normally get calculated
        const $navPadLeft = parseInt($inner.css('padding-left'), 10);
        const $navPadRight = parseInt($inner.css('padding-right'), 10);
        // nav is not there in editor, that's why
        const $navBuffer = parseInt($navWidth - ($logoWidth +
                                  $hamburgerWidth + $navPadLeft +
                                  $cartWidth + $cartMarginLeft + $cartMarginRight +
                                  $searchWidth + $searchMarginLeft +
                                  $searchMarginRight + $logoMarginLeft +
                                  $logoMarginRight + $navPadRight), 10);
        if ($linksWidth >= ($navBuffer - 1) ||
            window.matchMedia(drzzle.viewports.mobile).matches) {
          if (!navIsContained) {
            // hide slider just before it would break grid or if mobile
            $navList.hide();
            $navHamburger.addClass('drzNav-hamburger-show');
            navIsContained = true;
          }
        } else if (navIsContained) {
          // show again if it won't break or not in mobile
          $navList.show();
          $navHamburger.removeClass('drzNav-hamburger-show');
          navIsContained = false;
        }
        // close slider if slider is open and desktop links are also visible
        if (sliderIsOpen && $navList.is(':visible')) {
          navActions.closeSlider();
        }
      },
      findActiveLink($link) {
        const href = $link.attr('href');
        if (href === window.location.pathname) {
          $link.addClass('drzNav-activeLink');
        }
      },
      editorCheck($nav, val) {
        if (window.__editor) {
          $nav.parent().attr('data-nav-fixed', val);
        }
      },
    }; // End of nav actions
    navActions.editorCheck($this, false);
    // if plugin is in the editor, we need to grab the opacity
    // from a passed in parameter on color changes, otherwise
    // the nav's css transition delay will not give the correct
    // value.
    let findStop;
    // the magic behind sticky and fixed navs
    $.fn.drzNav.setScrolling = function setScrolling() {
      const $navs = $('.drzNav-sticky, .drzNav-fixed');
      const stickyCls = 'drzNav-sticky-set';
      $navs.removeClass(stickyCls);
      // storage for all the navs
      const store = {
        navs: [],
      };
      // scroll utils / getters
      const get = {
        top() {
          const $sections = $(`
            .section,
            .drzTopControlBar,
            .drz-app-bar,
            .drzTopLegend`,
          );
          let totalHeight = 0;
          $sections.each(function getSections() {
            const $el = $(this);
            const $pos = $el.css('position');
            if ($pos === 'fixed' || $pos === 'sticky') {
              totalHeight += $el.outerHeight();
            }
          });
          return totalHeight;
        },
        location(p) {
          // reset location of nav only if it isn't stuck
          if (!p.nav.stuck) {
            p.nav.startingLocation = p.top; // eslint-disable-line
          }
        },
        // for cases of fixed, transparent navs. auto add bg on scroll
        opacity($nav) {
          let opacity = $nav.css('background-color');
          opacity = opacity.split(',')[3];
          if (opacity) {
            opacity = opacity.replace(/[^0-9.]/g, '');
          } else {
            opacity = 1;
          }
          if (window.__editor) {
            opacity = $nav.attr('data-opacity');
          }
          return Number(opacity).valueOf();
        },
      };
      drzzle.window.off('scroll', findStop);
      $navs.each(function setSticky(i) {
        const $this = $(this);  // eslint-disable-line
        let view;
        let bump = 0;
        store.navs.push(
          {
            $: $this,
            startingLocation: ~~($this.offset().top),
            height: ~~($this.outerHeight()),
          },
        );

        const nav = store.navs[i];
        // Create sticky menu if option is selected
        if ($this.hasClass('drzNav-sticky')) {
          // checks on load
          if ((window.pageYOffset + get.top()) >= nav.startingLocation) {
            // nav is fixed / stuck
            nav.stuck = true;
            $this.addClass(stickyCls);
            $this.css('top', get.top());
            navActions.editorCheck(nav.$, true);
          } else {
            // nav is not yet fixed / stuck
            nav.stuck = false;
            $this.removeClass(stickyCls);
            $this.css('top', '');
            navActions.editorCheck(nav.$, false);
          }
          // callback to run on scroll
          findStop = () => {
            // if the previous nav is fixed then add the height of it to the
            // view threshold, this way the next nav becomes sticky just
            // underneath the previous.
            const previous = store.navs[i - 1];
            const previousIsStuck = previous ? previous.stuck : false;
            if (previousIsStuck) {
              // add the previous nav height to the view threshold
              bump = previous.height;
            }
            view = Math.round(
              drzzle.window.scrollTop() + get.top() + bump,
            );
            // always reset the offset top of each nav on scroll. we do this
            // because there are a lot of things that happen in the editor and
            // and when navs stick that throw off the top offset of each sticky
            // nav. This will cause navs to be stuck at the incorrect view if
            // not addressed.
            get.location({
              nav,
              top: ~~($this.offset().top),
            });
            // init the stick / unstick
            if (view > nav.startingLocation) {
              if (previous) {
                previous.$.css('top', `-${previous.height}px`);
              }
              nav.stuck = true;
              $this.addClass(stickyCls);
              $this.css('top', get.top());
              navActions.editorCheck(nav.$, true);
            } else {
              nav.stuck = false;
              $this.removeClass(stickyCls);
              $this.css('top', '');
              navActions.editorCheck(nav.$, false);
            }
          };
          drzzle.window.on('scroll', findStop);
        } else if ($this.hasClass('drzNav-fixed')) {
          navActions.editorCheck(nav.$, true);
          const opacity = get.opacity($this);
          let checkPoint = nav.startingLocation;
          nav.stuck = true;
          // only initiate the added class for transparent fixed menus
          if (window.pageYOffset > nav.height && opacity < 0.1) {
            $this.addClass(stickyCls);
            checkPoint = nav.height;
          }
          findStop = () => {
            view = Math.round(drzzle.window.scrollTop());
            if (view > checkPoint && opacity < 0.1) {
              $this.addClass(stickyCls);
              $this.css('top', get.top());
            } else {
              $this.removeClass(stickyCls);
              $this.css('top', '');
            }
          };
          drzzle.window.on('scroll', findStop);
        }
      });
    };

    // desktop dropdown hover events
    $dropDownLink.each(function attachHovers() {
      navActions.desktopDropDown($(this));
    });

    // desktop sublist hover events
    $subDropDownLink.each(function attachSubHovers() {
      navActions.desktopDropDown($(this));
    });

    // mobile dropdown click events
    $dropDownLink.click(navActions.sliderDropDown);
    $subDropDownLink.click(navActions.sliderDropDown);

    // here we set an active class for any links that are on an active page
    if (!window.__editor) {
      $navList.find('.drzNav-link').each(function getActiveLink() {
        navActions.findActiveLink($(this));
      });
    }

    // close slider for any anchor menu buttons
    $navList.find('.drzNav-link:not(.drzNav-link-dropDown)').click(navActions.checkAnchor);
    $navList.find('.drzNav-subLink:not(.drzNav-link-subDropDown)').click(navActions.checkAnchor);

    // Slider actions
    $navHamburger.click(navActions.openSlider);
    $closeSliderBtn.click(navActions.closeSlider);
    $sliderOverlay.click(navActions.closeSlider);
    $sliderContainer.click((e) => {
      e.stopPropagation();
    });

    // insert the clone for mobile after listeners have been attached
    const $navListClone = $navList.clone(true, true);
    $sliderContainer.append($navListClone);

    // Reset some things on nav on resizing
    let resizeTimer;
    const navResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(navActions.resetNav, 250);
      navActions.fitCheck();
    };
    drzzle.window.on('resize', navResize);
    // Init the check right on page load
    navActions.fitCheck();
    // init the scrolling plugin
    $.fn.drzNav.setScrolling();
    // destroy nav attachments
    $.fn.drzNav.destroy = ($el) => {
      $el.next('.drzNav-overlay').remove();
      $el.find('.drzNav-list').css('display', '');
      $el.find('.drzNav-hamburger').removeClass('drzNav-hamburger-show');
      drzzle.window.off('resize', navResize);
      drzzle.window.off('scroll', findStop);
      $el.find('*').off();
    };

    return this;
  };
})(jQuery);
