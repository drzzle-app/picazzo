/*
=================================
 Drzzle Form Validation Plugin
=================================
*/
(($) => {
  $.fn.drzFormValidate = function formValidate(fn, $btn) {
    const $form = $(this);
    $form.each(function initValidation() {
      const $this = $(this);
      $this.attr('novalidate', true);
      const types = `
        input[type=text],
        input[type=email],
        input[type=number],
        input[type=date],
        input[type=tel],
        input[type=url],
        input[type=password],
        textarea,
        select
      `;

      $.expr.pseudos.required = function check(field) {
        return $(field).attr('data-validator') === 'required';
      };

      let errors = false;

      const validate = {
        type(e, field) {
          const typeMsg = field.typeMsg;
          if (!field.input.val().match(field.format)) {
            e.preventDefault();
            errors = true;
            field.input.next('.drzValidator-msg')
              .find('.drzValidator-msg-type')
              .html(typeMsg)
              .fadeIn();
          }
          field.input.keyup(() => {
            if (field.input.val().match(field.format)) {
              errors = false;
              field.input.removeClass('drzValidator-req-border');
              field.input.next('.drzValidator-msg')
                .find('.drzValidator-msg-type')
                .fadeOut();
            } else {
              errors = true;
              field.input.addClass('drzValidator-req-border');
              field.input.next('.drzValidator-msg')
                .find('.drzValidator-msg-type')
                .html(typeMsg)
                .fadeIn();
            }
          });
        },
      };

      const onSubmit = (e) => {
        e.preventDefault();
        $this.find(types)
          .not('.checkbox-group input')
          .not('.radio-group input').each(function inputCheck() {
            const $el = $(this);
            const inputType = $el.attr('type');
            let msg;
            const $newMsgElement = $(`
              <div class="drzValidator-msg">
                <div class="drzValidator-msg-required"></div>
                <div class="drzValidator-msg-type"></div>
                <div class="drzValidator-msg-min"></div>
                <div class="drzValidator-msg-max"></div>
                <div class="drzValidator-msg-value"></div>
                <div class="drzValidator-msg-regex"></div>
              </div>'
            `);

            if (!$el.next('.drzValidator-msg').length) {
              $newMsgElement.insertAfter($el);
            }

            if ($el.is(':required')) {
              $el.keyup(() => {
                if ($el.val() !== '') {
                  errors = false;
                  $el.removeClass('drzValidator-req-border');
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-required')
                    .fadeOut();
                } else {
                  errors = true;
                  $el.addClass('drzValidator-req-border');
                  const $msgAttr = $el.attr('data-validator-msg');
                  if (typeof $msgAttr !== typeof undefined && $msgAttr !== false) {
                    msg = $el.attr('data-validator-msg');
                  } else {
                    msg = 'This value is required.';
                  }
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-required')
                    .html(msg)
                    .fadeIn();
                }
              });

              // key up functions for blank value validation
              $el.keyup(() => {
                if ($el.val() !== '') {
                  errors = false;
                  $el.removeClass('drzValidator-req-border');
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-required')
                    .fadeOut();
                } else {
                  errors = true;
                  $el.addClass('drzValidator-req-border');
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-required')
                    .html(msg)
                    .fadeIn();
                }
              });
            }

            if ($el.is(':required') && $el.val() === '') {
              e.preventDefault();
              errors = true;
              $el.addClass('drzValidator-req-border');

              // set the error message
              const $msgAttr = $el.attr('data-validator-msg');

              // check for custom msg, if none, assign the default
              if (typeof $msgAttr !== typeof undefined && $msgAttr !== false) {
                msg = $el.attr('data-validator-msg');
              } else {
                msg = 'This value is required.';
              }

              $el.next('.drzValidator-msg')
                .find('.drzValidator-msg-required')
                .html(msg)
                .fadeIn();
            }

            // min, max validation
            let $minAttr = $el.attr('data-validator-min');
            let $maxAttr = $el.attr('data-validator-max');
            let $inputValue;
            let minMsg;
            let maxMsg;

            if ((typeof $minAttr !== typeof undefined &&
                $minAttr !== false) ||
                (typeof $maxAttr !== typeof undefined &&
                $maxAttr !== false)) {
              // if min attribute exists
              if (typeof $minAttr !== typeof undefined && $minAttr !== false) {
                $minAttr = $el.attr('data-validator-min');
                if (inputType === 'number') {
                  minMsg = `Value must be at least ${$minAttr}.`;
                  $inputValue = ~~($el.val());
                } else {
                  minMsg = `There is a minimun limit of ${$minAttr} charachters for this value.`;
                  $inputValue = $el.val().length;
                }
              }

              // if max attribute exists
              if (typeof $maxAttr !== typeof undefined && $maxAttr !== false) {
                $maxAttr = $el.attr('data-validator-max');
                if (inputType === 'number') {
                  $inputValue = ~~($el.val());
                  maxMsg = `Value must not be greater than ${$maxAttr}.`;
                } else {
                  maxMsg = `There is a maximum limit of ${$maxAttr} charachters for this value.`;
                  $inputValue = $el.val().length;
                }
              }

              // if user input is less than the min value
              if ($el.val() !== '' || $el.is(':required')) {
                if ($inputValue < $minAttr) {
                  e.preventDefault();
                  errors = true;
                  $el.addClass('drzValidator-req-border');
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-min')
                    .html(minMsg)
                    .fadeIn();
                }
                // keyup for min/max number inputs
                $el.keyup(() => {
                  if (inputType === 'number') {
                    $inputValue = ~~($el.val());
                  } else {
                    $inputValue = $el.val().length;
                  }
                  if ($el.val() !== '') {
                    if ($inputValue < $minAttr) {
                      errors = true;
                      $el.addClass('drzValidator-req-border');
                      $el.next('.drzValidator-msg')
                        .find('.drzValidator-msg-min')
                        .html(minMsg)
                        .fadeIn();
                    } else {
                      if (typeof $maxAttr === typeof undefined && $maxAttr === false) {
                        errors = false;
                        $el.removeClass('drzValidator-req-border');
                      }
                      if (typeof $maxAttr !== typeof undefined && $maxAttr !== false &&
                        $inputValue <= $maxAttr) {
                        errors = false;
                        $el.removeClass('drzValidator-req-border');
                      }
                      $el.next('.drzValidator-msg').find('.drzValidator-msg-min').fadeOut();
                    }
                  }
                });

                // if user input is more than the max value
                if ($inputValue > $maxAttr) {
                  e.preventDefault();
                  errors = true;
                  $el.addClass('drzValidator-req-border');
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-max')
                    .html(maxMsg)
                    .fadeIn();
                }
                $el.keyup(() => {
                  if (inputType === 'number') {
                    $inputValue = ~~($el.val());
                  } else {
                    $inputValue = $el.val().length;
                  }
                  if ($el.val() !== '') {
                    if ($inputValue > $maxAttr) {
                      errors = true;
                      $el.addClass('drzValidator-req-border');
                      $el.next('.drzValidator-msg')
                        .find('.drzValidator-msg-max')
                        .html(maxMsg)
                        .fadeIn();
                    } else {
                      if (typeof $minAttr === typeof undefined && $minAttr === false) {
                        errors = false;
                        $el.removeClass('drzValidator-req-border');
                      }
                      if (typeof $minAttr !== typeof undefined && $minAttr !== false &&
                         $inputValue >= $minAttr) {
                        errors = false;
                        $el.removeClass('drzValidator-req-border');
                      }
                      $el.next('.drzValidator-msg')
                        .find('.drzValidator-msg-max')
                        .fadeOut();
                    }
                  }
                });
              }
            } // end min, max validation

            // number value only check
            let $valAttr = $el.attr('data-validator-value');
            let valMsg;

            if (typeof $valAttr !== typeof undefined && $valAttr !== false && $valAttr.match(/number/i)) {
              $valAttr = $el.attr('data-validator-value');
              valMsg = 'Value must be an integer.';

              if ($el.val() !== '' || $el.is(':required')) {
                if (!$.isNumeric($el.val())) {
                  e.preventDefault();
                  errors = true;
                  $el.addClass('drzValidator-req-border');
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-value')
                    .html(valMsg)
                    .fadeIn();
                }
                $el.keyup(() => {
                  if ($el.val() !== '') {
                    if (!$.isNumeric($el.val())) {
                      errors = true;
                      $el.addClass('drzValidator-req-border');
                      $el.next('.drzValidator-msg')
                        .find('.drzValidator-msg-value')
                        .html(valMsg)
                        .fadeIn();
                    } else {
                      errors = false;
                      $el.removeClass('drzValidator-req-border');
                      $el.next('.drzValidator-msg')
                        .find('.drzValidator-msg-value')
                        .fadeOut();
                    }
                  }
                });
              }
            }

            // regex value only check
            let $regexAttr = $el.attr('data-validator-regex');
            let regexMsg;

            if (typeof $regexAttr !== typeof undefined && $regexAttr !== false) {
              $regexAttr = $el.attr('data-validator-regex');
              $regexAttr = new RegExp($regexAttr, 'gi');
              if ($el.attr('data-validator-regex-msg')) {
                regexMsg = $el.attr('data-validator-regex-msg');
              } else {
                regexMsg = 'Value not entered in a correct format.';
              }

              if ($el.val() !== '' || $el.is(':required')) {
                if (!$el.val().match($regexAttr)) {
                  e.preventDefault();
                  errors = true;
                  $el.addClass('drzValidator-req-border');
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-regex')
                    .html(regexMsg)
                    .fadeIn();
                }
                $el.keyup(() => {
                  if ($el.val() !== '') {
                    if (!$el.val().match($regexAttr)) {
                      errors = true;
                      $el.addClass('drzValidator-req-border');
                      $el.next('.drzValidator-msg')
                        .find('.drzValidator-msg-regex')
                        .html(regexMsg)
                        .fadeIn();
                    } else {
                      errors = false;
                      $el.removeClass('drzValidator-req-border');
                      $el.next('.drzValidator-msg')
                        .find('.drzValidator-msg-regex')
                        .fadeOut();
                    }
                  }
                });
              }
            }

            // email validation
            if (inputType === 'email' && $el.val() !== '') {
              if (typeof $msgAttr !== typeof undefined && $msgAttr !== false) { // eslint-disable-line
                msg = $el.attr('data-validator-msg');
              } else {
                msg = 'This value is required.';
              }
              validate.type(e, {
                input: $el,
                check: 'email',
                typeMsg: 'Valid email required.',
                format: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
              });
            }

            // phone validation
            if (inputType === 'tel' && $el.val() !== '') {
              if (typeof $msgAttr !== typeof undefined && $msgAttr !== false) { // eslint-disable-line
                msg = $el.attr('data-validator-msg');
              } else {
                msg = 'This value is required.';
              }
              validate.type(e, {
                input: $el,
                check: 'tel',
                typeMsg: 'Valid phone number required. Try format 000-000-0000 or (000)-000-0000.',
                format: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
              });
            }

            // website validation
            if (inputType === 'url') {
              if (typeof $msgAttr !== typeof undefined && $msgAttr !== false) { // eslint-disable-line
                msg = $el.attr('data-validator-msg');
              } else {
                msg = 'This value is required.';
              }
              validate.type(e, {
                input: $el,
                check: 'url',
                typeMsg: 'Valid URL required',
                format: /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
              });
            }

            // select (dropdown) validation
            if ($el.is('select')) {
              $el.change(() => {
                if ($el.val() !== '') {
                  errors = false;
                  $el.removeClass('drzValidator-req-border');
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-required')
                    .fadeOut();
                } else {
                  errors = true;
                  $el.addClass('drzValidator-req-border');
                  $el.next('.drzValidator-msg')
                    .find('.drzValidator-msg-required')
                    .html(msg)
                    .fadeIn();
                }
              });
            } // end select validation
          });

        // checkbox and radio validation
        $this.find('.checkbox-group, .radio-group').each(function initOptions() {
          const $el = $(this);
          const $newMsgElement = $('<div class="drzValidator-msg"><div class="drzValidator-msg-required"></div></div>');
          let type;
          let findType;

          if ($el.hasClass('radio-group')) {
            findType = $el.find('input[type=radio]');
            type = 'input[type=radio]';
          }

          if ($el.hasClass('checkbox-group')) {
            findType = $el.find('input[type=checkbox]');
            type = 'input[type=checkbox]';
          }

          if ($el.is(':required') && $el.find(`${type}:checked`).length <= 0) {
            e.preventDefault();
            errors = true;
            findType.addClass('drzValidator-req-border');

            if (!$el.find('.drzValidator-msg').length) {
              $el.append($newMsgElement);
            }

            // set the error message
            const $msgAttr = $el.attr('data-validator-msg');
            let msg;

            // check for custom msg, if none assign the default
            if (typeof $msgAttr !== typeof undefined && $msgAttr !== false) {
              msg = $el.attr('data-validator-msg');
            } else {
              msg = 'You must check at least one.';
            }
            $el.find('.drzValidator-msg')
              .find('.drzValidator-msg-required')
              .html(msg)
              .fadeIn();

            // on checked
            findType.change(() => {
              if ($el.find(`${type}:checked`).length > 0) {
                errors = false;
                findType.removeClass('drzValidator-req-border');
                $el.find('.drzValidator-msg')
                  .find('.drzValidator-msg-required')
                  .fadeOut();
              } else {
                errors = true;
                findType.addClass('drzValidator-req-border');
                $el.find('.drzValidator-msg')
                  .find('.drzValidator-msg-required')
                  .html(msg)
                  .fadeIn();
              }
            });
          }
        });
        // run form logic after validation passes
        if (fn && !errors) {
          fn();
        }
      };

      if ($btn) {
        $btn.click(onSubmit);
      } else {
        $this.submit(onSubmit);
      }

      // Destroy method
      $.fn.drzFormValidate.destroy = ($el) => {
        $el.find(types).each(function removeEvents() {
          const $field = $(this);
          const $type = $field.attr('type');
          if ($field.is('select') || $type === 'radio' || $type === 'checkbox') {
            $field.off('change');
          } else {
            $field.off('keyup');
          }
        });
        $el.find('.drzValidator-msg').remove();
        $el.find('.drzValidator-req-border').removeClass('drzValidator-req-border');
      };
    });
    return this;
  };
})(jQuery);
