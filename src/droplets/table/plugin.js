/*
===================================
 Drzzle Responsive Tables Plugin
===================================
*/
(($) => {
  $.fn.responsiveTables = function responsiveTables() {
    const $table = $(this);
    $table.each(function initTable() {
      const $this = $(this);
      const mobileTitleClass = 'drzTable-mobileTitle';
      const $headTitle = $this.find('thead tr td');
      $this.find('tbody tr td').each(function addMobile() {
        const $tableData = $(this);
        const $index = $tableData.index();
        $tableData.prepend(`<b class="${mobileTitleClass}">${$headTitle.eq($index).html()}: </b>`);
      });
      $.fn.responsiveTables.destroy = ($el) => {
        $el.find(`.${mobileTitleClass}`).remove();
      };
    });
    return this;
  };
})(jQuery);
