/* global describe beforeEach it */
/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';

describe('Countdown jQuery Plugin Actions', () => {
  beforeEach(() => {
    const $el = $('<div class="drzCountDown"></div>');
    $('body').append($el);
    $el.drzCountDown();
  });

  it('should show plugin as defined', () => {
    expect($.fn.drzCountDown).to.not.be.undefined;
    expect($.fn.drzCountDown.test).to.not.be.undefined;
    expect($.fn.drzCountDown.test.orderSets).to.not.be.undefined;
    expect($.fn.drzCountDown.test.getBuffer).to.not.be.undefined;
    expect($.fn.drzCountDown.test.getRemainingTime).to.not.be.undefined;
    expect($.fn.drzCountDown.test.checkStart).to.not.be.undefined;
    expect($.fn.drzCountDown.test.getNextOccurance).to.not.be.undefined;
  });
});
