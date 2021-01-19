/*
============================
 Drzzle Maps Plugin
============================
*/
(($) => {
  $.fn.drzMap = function styleMap() {
    const $googleMap = $(this);
    $googleMap.each(function initPlugin() {
      const $this = $(this);
      const $mapNode = $this.find('.drzMap-container');
      const $zoomInBtn = $this.find('.drzMap-zoomIn').get(0);
      const $zoomOutBtn = $this.find('.drzMap-zoomOut').get(0);
      const $googleContainer = $this.find('.drzMap-container').get(0);
      const $addressSection = $this.find('.drzMap-address');
      const $win = $(window);
      // google map custom marker icon - .png fallback for IE11
      const isIE11 = navigator.userAgent.toLowerCase().indexOf('trident') > -1;

      const actions = {
        getHex(c) {
          if (typeof c === 'string' && c.trim() === '') {
            return '#000000';
          }
          let color = c;
          if (/^#[0-9A-F]{6}$/i.test(color)) {
            return color;
          }
          color = c.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) ||
                  c.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
          function hex(x) {
            return (`0${(parseInt(x, 10)).toString(16)}`).slice(-2);
          }
          return `#${hex(color[1])}${hex(color[2])}${hex(color[3])}`;
        },
        CustomZoomControl(controlDiv, map, baseColor) {
          // grab the zoom elements from the DOM and insert them in the map
          if ($zoomInBtn !== undefined && $zoomOutBtn !== undefined) {
            $zoomInBtn.style.backgroundColor = baseColor;
            $zoomOutBtn.style.backgroundColor = baseColor;
            const controlUIzoomIn = $zoomInBtn;
            const controlUIzoomOut = $zoomOutBtn;
            controlDiv.appendChild(controlUIzoomIn);
            controlDiv.appendChild(controlUIzoomOut);
            controlDiv.classList.add('drzMap-zoomContainer');

            // Setup the click event listeners and zoom in or out according
            // to the clicked element
            google.maps.event.addDomListener(controlUIzoomIn, 'click', () => {
              map.setZoom(map.getZoom() + 1);
            });
            google.maps.event.addDomListener(controlUIzoomOut, 'click', () => {
              map.setZoom(map.getZoom() - 1);
            });
          }
        },
        getImgPin(img) {
          let pin = img;
          if (window.__editor && !img.match(/^http/gi)) {
            pin = `${window.assetPrefix}${img}`;
          }
          return pin;
        },
        renderMap(opts) {
          let $opts = opts;
          const defaults = {
            baseColor: $addressSection.css('background-color'),
            markers: [],
          };

          // configure custom options
          if (typeof $opts !== typeof undefined && $opts !== false) {
            if (typeof $opts === 'string') {
              $opts = JSON.parse($opts);
            }
            $opts = $.extend(true, {}, defaults, $opts);
          } else {
            $opts = defaults;
          }

          if ($opts.useBg) {
            $opts.baseColor = actions.getHex($addressSection.css('background-color'));
          }

          // style/look settings
          const saturationValue = -20;
          const brightnessValue = 5;
          const baseColor = actions.getHex($opts.baseColor);

          const styles = [
            {
              // set saturation for the labels on the map
              elementType: 'labels',
              stylers: [
                { saturation: saturationValue },
              ],
            },
            {
              // point of interest - don't show these lables on the map
              featureType: 'poi',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' },
              ],
            },
            {
              // don't show highways lables on the map
              featureType: 'road.highway',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' },
              ],
            },
            {
              // don't show local road lables on the map
              featureType: 'road.local',
              elementType: 'labels.icon',
              stylers: [
                { visibility: 'off' },
              ],
            },
            {
              // don't show arterial road lables on the map
              featureType: 'road.arterial',
              elementType: 'labels.icon',
              stylers: [
                { visibility: 'off' },
              ],
            },
            {
              // don't show road lables on the map
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [
                { visibility: 'off' },
              ],
            },
            // style different elements on the map
            {
              featureType: 'transit',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'poi.government',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'poi.sports_complex',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'poi.attraction',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'poi.business',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'transit',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'transit.station',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'landscape',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'road',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.fill',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [
                { hue: baseColor },
                { visibility: 'on' },
                { lightness: brightnessValue },
                { saturation: saturationValue },
              ],
            },
          ];
          const markers = [];
          // set google map options
          const mapOptions = {
            zoom: 15,
            panControl: false,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            gestureHandling: 'cooperative',
            styles,
          };
          if ($opts.markers.length === 1) {
            mapOptions.center = new google.maps.LatLng(
              $opts.markers[0].lat, $opts.markers[0].lng);
          }

          const map = new google.maps.Map($googleContainer, mapOptions);
          // prep for auto centering
          const bounds = new google.maps.LatLngBounds();
          // build markers
          for (let i = 0; i < $opts.markers.length; i++) {
            const m = $opts.markers[i];
            const body = m.body ? `<p class="drzMap-markerBody">${m.body}</p>` : '';
            const toolTip =
            `<div class="drzMap-markerTip">
              <span class="drzMap-markerTitle">${m.title || ''}</span>
              <span class="drzMap-markerAddr">${m.address || ''}</span>
              ${body}
              </div>`;
            const infowindow = new google.maps.InfoWindow({
              content: toolTip,
              maxWidth: 250,
            });
            const position = new google.maps.LatLng(m.lat, m.lng);
            const markerUrl = (isIE11) ?
              'https://s3-us-west-1.amazonaws.com/drz-assets/mock-images/icons/maps-default-pin.png' : actions.getImgPin(m.markerImg);
            bounds.extend(position);
            const marker = new google.maps.Marker({
              position,
              map,
              visible: true,
              icon: markerUrl,
            });
            marker.addListener('click', () => {
              infowindow.open(map, marker);
            });
            markers.push(marker);
          }
          // auto center and zoom if multiple markers
          if (markers.length > 1 || markers.length === 0) {
            map.fitBounds(bounds); // auto zoom
            map.panToBounds(bounds); // auto center
          }
          // after map loads, then append zoom controls
          google.maps.event.addListenerOnce(map, 'idle', () => {
            // we need a small buffer to initiate the controls as firing this
            // too fast will result in controls sometimes not showing up
            clearTimeout(actions.controlTime);
            actions.controlTime = setTimeout(() => {
              // init custom zoom controls
              const zoomControlDiv = document.createElement('div');
              actions.CustomZoomControl(zoomControlDiv, map, $opts.baseColor);
              // insert the zoom div on the top left of the map
              map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);
            }, 350);
          });
        },
        controlTime: null,
      };


      // if map exists on page, init it
      let reDraw;
      if ($mapNode.length) {
        const $opts = $this.attr('data-google-map');
        let resizeTimer;
        let start = true;
        let startBg;
        reDraw = () => {
          if (start && JSON.parse($opts).useBg) {
            start = false;
            startBg = $addressSection.css('background-color');
          }
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            // only redraw map if new color is present
            if (startBg !== $addressSection.css('background-color')) {
              actions.renderMap($opts);
            }
            start = true;
          }, 250);
        };
        $win.resize(reDraw);
        // initialize map on page load
        actions.renderMap($opts);
      }
      // destroy listeners
      $.fn.drzMap.destroy = () => {
        $win.off('resize', reDraw);
      };
    });
    return this;
  };
})(jQuery);
