/*
============================
 Drzzle Countdown Plugin
============================
*/
(($) => {
  $.fn.drzCountDown = function countDown() {
    const $countDown = $(this);
    $countDown.each(function initPlugin() {
      const $this = $(this);
      const $endMsg = $this.find('.drzCountdown-endedMsg');
      const $timer = $this.find('.drzCountdown-timerContainer');
      let countDownInterval;
      let checkStartInterval;
      let sets;

      const actions = {
        tempDate() {
          // create a temp date if no sets exist. (today + 24hrs added)
          const tempDate = new Date(new Date()
            .getTime() + (1 * 24 * 60 * 60 * 1000));
          return tempDate;
        },
        orderSets(a, b) {
          // chronologically order sets
          return new Date(a.end).getTime() - new Date(b.end).getTime();
        },
        getBuffer(opts) {
          // calculate the time to excecute the next set if a buffer exists
          let buffer = false;
          if (opts.buffer) {
            const duration = opts.buffer.split(' ')[1];
            let amount = opts.buffer.split(' ')[0];
            amount = parseInt(amount, 10);
            if (duration.match(/second/gi)) {
              buffer = amount * 1000;
            } else if (duration.match(/minute/gi)) {
              buffer = (amount * 60) * 1000;
            } else if (duration.match(/hour/gi)) {
              buffer = (amount * 3600) * 1000;
            }
            buffer = new Date(opts.end).getTime() + buffer;
            buffer = new Date(buffer);
          }
          return buffer;
        },
        getRemainingTime(end) {
          // intervals use this to compare remaining time
          const start = new Date();
          const t = Date.parse(end) - Date.parse(start);
          let s = Math.floor((t / 1000) % 60);
          if (s < 0) {
            s = 0;
          }
          let m = Math.floor((t / 1000 / 60) % 60);
          if (m < 0) {
            m = 0;
          }
          let h = Math.floor((t / (1000 * 60 * 60)) % 24);
          if (h < 0) {
            h = 0;
          }
          let d = Math.floor(t / (1000 * 60 * 60 * 24));
          if (d < 0) {
            d = 0;
          }
          const payload = {
            total: t,
            days: d,
            hours: h,
            minutes: m,
            seconds: s,
          };
          return payload;
        },
        checkStart(set, sets, i) {
          // check if any initial sets are finished
          const st = actions.getRemainingTime(set.end);
          let hasPassed = false;
          // if start time is here,
          if (st.total <= 0) {
            hasPassed = true;
            actions.countDownEnded($this, sets, i);
          } else {
            // helper for editor
            $endMsg.hide();
            $timer.show();
          }
          return hasPassed;
        },
        updateTime($clock, set, sets, i) {
          // get spans where clock numbers are held
          const $daysSpan = $clock.find('.drzCountdown-days');
          const $hoursSpan = $clock.find('.drzCountdown-hours');
          const $minutesSpan = $clock.find('.drzCountdown-minutes');
          const $secondsSpan = $clock.find('.drzCountdown-seconds');
          const t = actions.getRemainingTime(set.end);
          // update the numbers in each part of the clock
          $daysSpan.html(t.days);
          $hoursSpan.html((`0${t.hours}`).slice(-2));
          $minutesSpan.html((`0${t.minutes}`).slice(-2));
          $secondsSpan.html((`0${t.seconds}`).slice(-2));

          // if time ends
          if (t.total <= 0) {
            clearInterval(countDownInterval);
            actions.countDownEnded($this, sets, i);
          }
        },
        sameTime(date, currently) {
          return date.getFullYear() === currently.getFullYear() &&
          date.getMonth() === currently.getMonth() &&
          date.getDate() === currently.getDate() &&
          date.getHours() === currently.getHours() &&
          date.getMinutes() === currently.getMinutes() &&
          date.getSeconds() === currently.getSeconds();
        },
        getNextOccurance(set) {
          const time = new Date(set.end);
          const seconds = time.getSeconds();
          const minutes = time.getMinutes();
          const hours = time.getHours();
          const next = new Date();
          const newDate = new Date();
          let dow;
          // currently the only allowed occurrance is weekly
          if (set.recurring.match(/week/gi)) {
            let day = set.end.toString();
            day = day.split(' ')[0];
            if (day.match(/Sun/gi)) {
              dow = 0;
            } else if (day.match(/Mon/gi)) {
              dow = 1;
            } else if (day.match(/Tue/gi)) {
              dow = 2;
            } else if (day.match(/Wed/gi)) {
              dow = 3;
            } else if (day.match(/Thu/gi)) {
              dow = 4;
            } else if (day.match(/Fri/gi)) {
              dow = 5;
            } else if (day.match(/Sat/gi)) {
              dow = 6;
            }
            const n = dow + (7 - next.getDay());
            newDate.setDate(next.getDate() + (n % 7));
            newDate.setSeconds(seconds);
            newDate.setMinutes(minutes);
            newDate.setHours(hours);

            // when the last end time in recurring list is built, it will
            // inifinately loop, so we need to properly add a week to it.
            if (newDate < new Date() || actions.sameTime(newDate, new Date())) {
              newDate.setUTCDate(newDate.getUTCDate() + 7);
            }
          }
          return newDate;
        },
        recurring(sets) {
          let recurringSets = [];
          for (let i = 0; i <= sets.length - 1; i++) {
            const set = sets[i];
            if (set.recurring) {
              set.end = actions.getNextOccurance(set);
              recurringSets.push(set);
            }
          }
          // if there are any recurring sets, init them
          if (recurringSets.length > 0) {
            $endMsg.hide();
            $timer.show();
            recurringSets = recurringSets.sort(actions.orderSets);
            actions.initCountDown($this, recurringSets[0], recurringSets, 0);
          }
        },
        countDownEnded($el, sets, i) {
          clearInterval(checkStartInterval);
          clearInterval(countDownInterval);
          const liveSet = sets[i];
          $timer.hide();
          $endMsg.show();
          $endMsg.html(
            `<h4 class="drz-h4 drzCountdown-endMessage">
              ${liveSet.endMessage || ''}
            </h4>`);

          // check if there is another countdown then buffer
          const newIndex = i + 1;
          const nextSet = sets[newIndex];
          const buffer = actions.getBuffer(liveSet);
          if (typeof nextSet !== typeof undefined && nextSet !== false) {
            if (buffer) {
              checkStartInterval = setInterval(() => {
                const t = actions.getRemainingTime(buffer);
                if (t.total <= 0) {
                  // if buffer time is now passed, proceed with next
                  $endMsg.hide();
                  $timer.show();
                  actions.initCountDown($this, nextSet, sets, newIndex);
                  clearInterval(checkStartInterval);
                }
              }, 500);
            } else {
              // run initCountDown on next if no buffer
              $endMsg.hide();
              $timer.show();
              actions.initCountDown($this, nextSet, sets, newIndex);
            }
          } else if (liveSet.buffer) {
            // if all countdowns sets are done, find the next "recurring one(s) and start that one"
            checkStartInterval = setInterval(() => {
              const t = actions.getRemainingTime(buffer);
              if (t.total <= 0) {
                // if buffer time is now passed, proceed with next
                $endMsg.hide();
                $timer.show();
                actions.recurring(sets);
                clearInterval(checkStartInterval);
              }
            }, 100);
          } else {
            actions.recurring(sets);
          }
        },
        initCountDown(el, set, sets, i) {
          actions.updateTime(el, set, sets, i);
          countDownInterval = setInterval(() => {
            actions.updateTime(el, set, sets, i);
          }, 1000);
        },
      };
      // init plugin
      function initSetChecks() {
        // set the current endtime
        let $opts = $this.attr('data-countdown');
        // default options
        const defaultSet = [
          {
            end: actions.tempDate(),
            buffer: false,
            endMessage: 'Countdown Ended!',
            recurring: false,
          },
        ];
        // configure custom options
        if (typeof $opts !== typeof undefined && $opts !== false) {
          $opts = JSON.parse($opts);
          sets = $opts.sets.length;
          $opts.sets = $opts.sets.sort(actions.orderSets);
          if (sets > 0) {
            for (let i = 0; i <= sets - 1; i++) {
              const set = $.extend(true, {}, defaultSet[0], $opts.sets[i]);
              $opts.sets[i] = set;
              // check if any of the end times have passed
              if (!actions.checkStart(set, $opts.sets, i)) {
                actions.initCountDown($this, set, $opts.sets, i);
                return;
              }
            }
          } else {
            // if no sets exist, start default
            actions.initCountDown($this, defaultSet[0], defaultSet, 0);
          }
        } else {
          // if no options passed at all, start default
          actions.initCountDown($this, defaultSet[0], defaultSet, 0);
        }
      }
      initSetChecks();
      $.fn.drzCountDown.reset = () => {
        clearInterval(countDownInterval);
        clearInterval(checkStartInterval);
        initSetChecks();
      };
    });
    return this;
  };
})(jQuery);
