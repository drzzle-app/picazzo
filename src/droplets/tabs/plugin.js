/*
============================
 Drzzle Tabs Plugin
============================
*/
(($) => {
  $.fn.drzTabs = function drzTabs() {
    const $tabs = $(this);
    const tabsClass = 'drzTabs';
    const tabsMenuClass = 'drzTabs-menu';
    const desktopTabClass = 'drzTabs-tab';
    const desktopLinkClass = 'drzTabs-tabLink';
    const activeTabClass = 'drzTabs-activeTab';
    const mobileTabClass = 'drzTabs-mobileTab';
    const tabContentWrap = 'drzTabs-content';
    const tabContentClass = 'drzTabs-tabContent';

    const tabActions = {
      tabsAreMobile: false,
      setActive(e) {
        e.preventDefault();
        const $el = $(e.currentTarget);
        const $thisSet = $el.closest(`.${tabsClass}`);
        const $tabSiblings = $thisSet.find(`.${desktopTabClass}`);
        const $mTabSiblings = $thisSet.find(`.${mobileTabClass}`);
        let $tabIndex;
        let $variationTab;
        const showSpeed = 200;

        if ($el.hasClass(mobileTabClass)) {
          tabActions.tabsAreMobile = true;
        } else {
          tabActions.tabsAreMobile = false;
        }

        if (tabActions.tabsAreMobile) {
          $tabIndex = $el.parent()
            .children(`.${mobileTabClass}`)
            .index($el);
          $variationTab = $tabSiblings.eq($tabIndex);
        } else {
          $tabIndex = $el.index();
          $variationTab = $mTabSiblings.eq($tabIndex);
        }

        const $activeContent = $thisSet
          .find(`.${tabContentClass}`)
          .eq($tabIndex);

        $tabSiblings.removeClass(activeTabClass);
        $mTabSiblings.removeClass(activeTabClass);
        $el.addClass(activeTabClass);
        $variationTab.addClass(activeTabClass);

        if (tabActions.tabsAreMobile) {
          // when closing mobile tab, remove active state
          if ($activeContent.is(':visible')) {
            $el.removeClass(activeTabClass);
          }

          $activeContent.siblings(`.${tabContentClass}`).slideUp(showSpeed);
          $activeContent.slideToggle(showSpeed);
        } else {
          // If in desktop or tablet
          $activeContent.siblings(`.${tabContentClass}`).hide();
          $activeContent.show();
        }
      },
      setFirstTab($tab, $tabMobile, $tabContent, $tabMenu) {
        $tab.addClass(activeTabClass);
        $tabMobile.addClass(activeTabClass);
        $tabContent.show();
        // make sure left content border extends beyond left menu
        if ($tab.hasClass('drzTabs-tab-left')) {
          tabActions.setLeftHeight(
            $tabContent,
            $tabMenu);
        }
      },
      resetTabs($hiddenActive, $tabContent, $tabMenu) {
        // if all mobile tabs are collapsed, re open correct content if moving to desktop
        const $findContent = $tabContent.eq($hiddenActive);
        if (!window.matchMedia(drzzle.viewports.mobile).matches && !$findContent.is(':visible')) {
          $findContent.show();
        }
        // make sure left content border extends beyond left menu
        if ($tabMenu.hasClass('drzTabs-menu-left')) {
          tabActions.setLeftHeight(
            $tabContent,
            $tabMenu);
        }
      },
      setLeftHeight($tabContent, $tabMenu) {
        if (!window.matchMedia(drzzle.viewports.mobile).matches) {
          $tabContent.parent().css('min-height', parseInt($tabMenu.outerHeight() + 25, 10));
        } else {
          $tabContent.parent().css('min-height', 1);
        }
      },
      removeActives($el) {
        $el.children().each(function remove() {
          const $this = $(this);
          if ($this.hasClass(activeTabClass)) {
            $this.removeClass(activeTabClass);
          }
          if ($this.attr('style')) {
            $this.css('display', '');
          }
        });
      },
    };

    const $tabMenu = $tabs.find(`.${tabsMenuClass}`);
    const $tabLink = $tabs.find(`.${desktopTabClass}`);
    const $tabContent = $tabs.find(`.${tabContentClass}`);

    $tabLink.click(tabActions.setActive);
    // Insert tab text into the mobile tab buttons
    function attachMobile($m) {
      $tabs.find(`.${desktopTabClass}`).each(function insertMobileText() {
        const $tab = $(this);
        const $index = $tab.index();
        $m.eq($index)
          .text($tab.find(`.${desktopLinkClass}`).text());
      });
    }

    // inject accordion buttons for mobile
    $(`<div class="${mobileTabClass}"></div>`).insertBefore($tabContent);
    const $mobileTab = $tabs.find(`.${mobileTabClass}`);
    attachMobile($mobileTab);

    // set first tab active
    tabActions.setFirstTab(
      $tabLink.first(),
      $mobileTab.first(),
      $tabContent.first(),
      $tabMenu);

    $mobileTab.click(tabActions.setActive);

    // reset tabs when resizing screen
    let resizeTimer;
    drzzle.window.resize(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const $hiddenActive = $tabs.find(`.${activeTabClass}`).index();
        tabActions.resetTabs(
          $hiddenActive,
          $tabContent,
          $tabMenu);
      }, 250);
    });

    $.fn.drzTabs.destroy = ($el) => {
      // grab attached selectors and remove/ attached data
      $el.find(`.${desktopTabClass}`).off('click');
      $el.find(`.${mobileTabClass}`).remove();
      $el.find(`.${tabContentWrap}`).css('min-height', 1);
      tabActions.removeActives($el.find(`.${tabsMenuClass}`));
      tabActions.removeActives($el.find(`.${tabContentWrap}`));
    };

    return this;
  };
})(jQuery);
