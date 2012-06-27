// Generated by CoffeeScript 1.3.3

/*
# classCustomMap {{{
*/


(function() {
  var AreaSummary, CustomMap, extractUrlParams,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CustomMap = (function() {

    function CustomMap(id) {
      this.toggleMarkerList = __bind(this.toggleMarkerList, this);

      this.handleExport = __bind(this.handleExport, this);

      this.handleMarkerRemovalTool = __bind(this.handleMarkerRemovalTool, this);

      this.handleDevMod = __bind(this.handleDevMod, this);

      var _this = this;
      this.blankTilePath = 'tiles/00empty.jpg';
      this.iconsPath = 'assets/images/icons/32x32';
      this.maxZoom = 7;
      this.lngContainer = $('#long');
      this.latContainer = $('#lat');
      this.devModInput = $('#dev-mod');
      this.optionsBox = $('#options-box');
      this.addMarkerLink = $('#add-marker');
      this.removeMarkerLink = $('#remove-marker');
      this.markerList = $('#marker-list');
      this.exportBtn = $('#export');
      this.exportWindow = $('#export-windows');
      this.markersOptionsMenu = $('#markers-options');
      this.defaultLat = 25.760319754713887;
      this.defaultLng = -35.6396484375;
      this.defaultCat = "generic";
      this.areaSummaryBoxes = [];
      this.canRemoveMarker = false;
      this.draggableMarker = false;
      this.visibleMarkers = true;
      this.canToggleMarkers = true;
      this.gMapOptions = {
        center: new google.maps.LatLng(this.getStartLat(), this.getStartLng()),
        zoom: 6,
        minZoom: 3,
        maxZoom: this.maxZoom,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: ["custom", google.maps.MapTypeId.ROADMAP]
        },
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER,
          zoomControlStyle: google.maps.ZoomControlStyle.SMALL
        }
      };
      this.customMapType = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
          var normalizedCoord, path;
          normalizedCoord = coord;
          if (normalizedCoord && (normalizedCoord.x < Math.pow(2, zoom)) && (normalizedCoord.x > -1) && (normalizedCoord.y < Math.pow(2, zoom)) && (normalizedCoord.y > -1)) {
            return path = 'tiles/' + zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.jpg';
          } else {
            return _this.blankTilePath;
          }
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: this.maxZoom,
        name: 'GW2 Map'
      });
      this.map = new google.maps.Map($(id)[0], this.gMapOptions);
      this.map.mapTypes.set('custom', this.customMapType);
      this.map.setMapTypeId('custom');
      this.addMenuIcons();
      google.maps.event.addListener(this.map, 'mousemove', function(e) {
        _this.lngContainer.html(e.latLng.lng());
        return _this.latContainer.html(e.latLng.lat());
      });
      google.maps.event.addListener(this.map, 'click', function(e) {
        return console.log('{"lat" : "' + e.latLng.lat() + '", "lng" : "' + e.latLng.lng() + '", "title" : "", "desc" : ""},');
      });
      google.maps.event.addListener(this.map, 'zoom_changed', function(e) {
        var zoomLevel;
        zoomLevel = _this.map.getZoom();
        if (zoomLevel === 4) {
          _this.canToggleMarkers = false;
          _this.hideMarkersOptionsMenu();
          _this.setAllMarkersVisibility(false);
          return _this.setAreasInformationVisibility(true);
        } else if (zoomLevel > 4) {
          _this.canToggleMarkers = true;
          _this.showMarkersOptionsMenu();
          _this.setAllMarkersVisibility(true);
          return _this.setAreasInformationVisibility(false);
        } else if (zoomLevel < 4) {
          _this.canToggleMarkers = false;
          _this.hideMarkersOptionsMenu();
          _this.setAllMarkersVisibility(false);
          return _this.setAreasInformationVisibility(false);
        }
      });
      this.devModInput.bind('click', this.handleDevMod);
      this.gMarker = {};
      this.setAllMarkers();
      this.initializeAreaSummaryBoxes();
      this.markerList.find('span').bind('click', function(e) {
        var coord, img, markerType, markerinfo, this_;
        this_ = $(e.currentTarget);
        markerType = this_.attr('data-type');
        coord = _this.map.getCenter();
        markerinfo = {
          "lng": coord.lng(),
          "lat": coord.lat(),
          "title": "--"
        };
        img = "" + _this.iconsPath + "/" + markerType + ".png";
        return _this.addMarkers(markerinfo, img, markerType);
      });
      this.addMarkerLink.bind('click', this.toggleMarkerList);
      this.removeMarkerLink.bind('click', this.handleMarkerRemovalTool);
      this.exportBtn.bind('click', this.handleExport);
      this.exportWindow.find('.close').click(function() {
        return _this.exportWindow.hide();
      });
    }

    CustomMap.prototype.addMarker = function(markerInfo, markersType, markersCat) {
      var iconmid, iconsize, image, infoWindow, marker, markerThatMatchUrl, markerType, permalink, _i, _len, _ref, _results,
        _this = this;
      iconsize = 32;
      iconmid = iconsize / 2;
      image = new google.maps.MarkerImage(this.getIconURLByType(markersType, markersCat), null, null, new google.maps.Point(iconmid, iconmid), new google.maps.Size(iconsize, iconsize));
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(markerInfo.lat, markerInfo.lng),
        map: this.map,
        icon: image,
        visible: markersCat === this.defaultCat ? true : false,
        draggable: this.draggableMarker,
        cursor: this.draggableMarker ? "move" : "pointer",
        title: "" + markerInfo.title
      });
      permalink = '<p class="marker-permalink"><a href="?lat=' + markerInfo.lat + '&lng=' + markerInfo.lng + '">Permalink</a></p>';
      infoWindow = new google.maps.InfoWindow({
        content: (("" + markerInfo.desc) === "" ? "More info comming soon" : "" + markerInfo.desc) + "<p>" + permalink + "</p>",
        maxWidth: 200
      });
      marker["title"] = "" + markerInfo.title;
      marker["desc"] = "" + markerInfo.desc;
      marker["infoWindow"] = infoWindow;
      markerThatMatchUrl = this.getMarkerByCoordinates(this.getStartLat(), this.getStartLng());
      if (markerThatMatchUrl === markerInfo) {
        marker.infoWindow.open(this.map, marker);
        this.currentOpenedInfoWindow = marker.infoWindow;
      }
      google.maps.event.addListener(marker, 'dragend', function(e) {
        return console.log('{"lat" : "' + e.latLng.lat()(+'", "lng" : "' + e.latLng.lng()(+'", "title" : "", "desc" : ""},')));
      });
      google.maps.event.addListener(marker, 'click', function(e) {
        if (_this.canRemoveMarker && _this.draggableMarker) {
          return _this.removeMarker(marker.__gm_id);
        } else {
          if (_this.currentOpenedInfoWindow) {
            _this.currentOpenedInfoWindow.close();
          }
          marker.infoWindow.open(_this.map, marker);
          return _this.currentOpenedInfoWindow = marker.infoWindow;
        }
      });
      _ref = this.gMarker[markersCat]["markerGroup"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        markerType = _ref[_i];
        if (markerType.slug === markersType) {
          _results.push(markerType["markers"].push(marker));
        }
      }
      return _results;
    };

    CustomMap.prototype.setAllMarkers = function() {
      var key, marker, markerTypeObject, markersCat, markersObjects, newmarkerTypeObject, _results;
      _results = [];
      for (markersCat in Markers) {
        markersObjects = Markers[markersCat];
        if (!(this.gMarker[markersCat] != null)) {
          this.gMarker[markersCat] = {};
          this.gMarker[markersCat]["name"] = markersObjects.name;
          this.gMarker[markersCat]["markerGroup"] = [];
        }
        _results.push((function() {
          var _i, _len, _ref, _results1;
          _ref = markersObjects.markerGroup;
          _results1 = [];
          for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
            markerTypeObject = _ref[key];
            newmarkerTypeObject = {};
            newmarkerTypeObject["name"] = markerTypeObject.name;
            newmarkerTypeObject["slug"] = markerTypeObject.slug;
            newmarkerTypeObject["markers"] = [];
            this.gMarker[markersCat]["markerGroup"].push(newmarkerTypeObject);
            _results1.push((function() {
              var _j, _len1, _ref1, _results2;
              _ref1 = markerTypeObject.markers;
              _results2 = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                marker = _ref1[_j];
                _results2.push(this.addMarker(marker, markerTypeObject.slug, markersCat));
              }
              return _results2;
            }).call(this));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    CustomMap.prototype.getIconURLByType = function(type, markersCat) {
      var icon;
      for (icon in Resources.Icons[markersCat]) {
        if (icon === type) {
          return Resources.Icons[markersCat][icon].url;
        }
      }
    };

    CustomMap.prototype.setAllMarkersVisibility = function(isVisible) {
      var cat, markerTypeObject, markersObjects, _results;
      _results = [];
      for (cat in Markers) {
        markersObjects = Markers[cat];
        _results.push((function() {
          var _i, _len, _ref, _results1;
          _ref = markersObjects.markerGroup;
          _results1 = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            markerTypeObject = _ref[_i];
            if (!$("[data-type='" + markerTypeObject.slug + "']").hasClass('off')) {
              _results1.push(this.setMarkersVisibilityByType(isVisible, markerTypeObject.slug, cat));
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    CustomMap.prototype.setMarkersVisibilityByType = function(isVisible, type, cat) {
      var marker, markerTypeObject, _i, _len, _ref, _results;
      _ref = this.gMarker[cat]["markerGroup"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        markerTypeObject = _ref[_i];
        if (markerTypeObject.slug === type) {
          _results.push((function() {
            var _j, _len1, _ref1, _results1;
            _ref1 = markerTypeObject.markers;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              marker = _ref1[_j];
              _results1.push(marker.setVisible(isVisible));
            }
            return _results1;
          })());
        }
      }
      return _results;
    };

    CustomMap.prototype.setMarkersVisibilityByCat = function(isVisible, cat) {
      var marker, markerTypeObject, _i, _len, _ref, _results;
      _ref = this.gMarker[cat]["markerGroup"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        markerTypeObject = _ref[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = markerTypeObject.markers;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            marker = _ref1[_j];
            _results1.push(marker.setVisible(isVisible));
          }
          return _results1;
        })());
      }
      return _results;
    };

    CustomMap.prototype.handleDevMod = function(e) {
      var this_;
      this_ = $(e.currentTarget);
      if (this_.prop('checked')) {
        this.setDraggableMarker(true);
        return this.optionsBox.addClass('active');
      } else {
        this.setDraggableMarker(false);
        this.optionsBox.removeClass('active');
        this.markerList.removeClass('active');
        return this.addMarkerLink.removeClass('active');
      }
    };

    CustomMap.prototype.handleMarkerRemovalTool = function(e) {
      if (this.removeMarkerLink.hasClass('active')) {
        this.removeMarkerLink.removeClass('active');
        this.optionsBox.removeClass('red');
        return this.canRemoveMarker = false;
      } else {
        this.removeMarkerLink.addClass('active');
        this.optionsBox.addClass('red');
        this.canRemoveMarker = true;
        this.markerList.removeClass('active');
        return this.addMarkerLink.removeClass('active');
      }
    };

    CustomMap.prototype.handleExport = function(e) {
      var jsonString, marker, markerType, markers, markersCat, markersObject, newMarkerObject, nm, _i, _len, _ref;
      newMarkerObject = {};
      _ref = this.gMarker;
      for (markersCat in _ref) {
        markersObject = _ref[markersCat];
        if (!(newMarkerObject[markersCat] != null)) {
          newMarkerObject[markersCat] = {};
        }
        for (markerType in markersObject) {
          markers = markersObject[markerType];
          if (!(newMarkerObject[markersCat][markerType] != null)) {
            newMarkerObject[markersCat][markerType] = [];
          }
          for (_i = 0, _len = markers.length; _i < _len; _i++) {
            marker = markers[_i];
            nm = {
              "lng": marker.getPosition().lng(),
              "lat": marker.getPosition().lat(),
              "title": marker.title,
              "desc": marker.desc
            };
            newMarkerObject[markersCat][markerType].push(nm);
          }
        }
      }
      jsonString = JSON.stringify(newMarkerObject);
      this.exportWindow.find('.content').html(jsonString);
      return this.exportWindow.show();
    };

    CustomMap.prototype.getStartLat = function() {
      var params;
      params = extractUrlParams();
      if (params['lat'] != null) {
        return params['lat'];
      } else {
        return this.defaultLat;
      }
    };

    CustomMap.prototype.getStartLng = function() {
      var params;
      params = extractUrlParams();
      if (params['lng'] != null) {
        return params['lng'];
      } else {
        return this.defaultLng;
      }
    };

    CustomMap.prototype.removeMarker = function(id) {
      var marker, markers, markersId, _ref, _results,
        _this = this;
      _ref = this.gMarker;
      _results = [];
      for (markersId in _ref) {
        markers = _ref[markersId];
        this.gMarker[markersId] = _.reject(markers, function(m) {
          return m.__gm_id === id;
        });
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = markers.length; _i < _len; _i++) {
            marker = markers[_i];
            if (marker.__gm_id === id) {
              _results1.push(marker.setMap(null));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    };

    CustomMap.prototype.setDraggableMarker = function(val) {
      var marker, markers, markersId, _ref, _results;
      this.draggableMarker = val;
      _ref = this.gMarker;
      _results = [];
      for (markersId in _ref) {
        markers = _ref[markersId];
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = markers.length; _i < _len; _i++) {
            marker = markers[_i];
            marker.setDraggable(val);
            if (val) {
              _results1.push(marker.setCursor('move'));
            } else {
              _results1.push(marker.setCursor('pointer'));
            }
          }
          return _results1;
        })());
      }
      return _results;
    };

    CustomMap.prototype.toggleMarkerList = function(e) {
      var this_;
      this_ = $(e.currentTarget);
      this.markerList.toggleClass('active');
      this_.toggleClass('active');
      if (this_.hasClass('active')) {
        this.removeMarkerLink.removeClass('active');
        this.optionsBox.removeClass('red');
        return this.canRemoveMarker = false;
      }
    };

    CustomMap.prototype.getMarkerByCoordinates = function(lat, lng) {
      var key, marker, markerTypeObject, markersObjects, type, _i, _j, _len, _len1, _ref, _ref1;
      for (type in Markers) {
        markersObjects = Markers[type];
        _ref = markersObjects.markerGroup;
        for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
          markerTypeObject = _ref[key];
          _ref1 = markerTypeObject.markers;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            marker = _ref1[_j];
            if (marker.lat === lat && marker.lng === lng) {
              return marker;
            }
          }
        }
      }
      return false;
    };

    CustomMap.prototype.turnOfMenuIconsFromCat = function(markerCat) {
      var menu;
      menu = $(".menu-marker[data-markerCat='" + markerCat + "']");
      menu.find('.group-toggling').addClass('off');
      return menu.find('.trigger').addClass('off');
    };

    CustomMap.prototype.addMenuIcons = function() {
      var markersOptions,
        _this = this;
      return markersOptions = $.get('assets/javascripts/templates/markersOptions._', function(e) {
        var html, markerCat, template, _results;
        template = _.template(e);
        html = $(template(Resources));
        html.find(".trigger").bind('click', function(e) {
          var item, myGroupTrigger;
          item = $(e.currentTarget);
          myGroupTrigger = item.closest(".menu-marker").find('.group-toggling');
          if (_this.canToggleMarkers) {
            if (item.hasClass('off')) {
              _this.setMarkersVisibilityByType(true, item.attr('data-type'), item.attr('data-cat'));
              item.removeClass('off');
              console.log(myGroupTrigger);
              return myGroupTrigger.removeClass('off');
            } else {
              _this.setMarkersVisibilityByType(false, item.attr('data-type'), item.attr('data-cat'));
              return item.addClass('off');
            }
          }
        });
        html.find('.group-toggling').bind('click', function(e) {
          var markerCat, parent, this_;
          this_ = $(e.currentTarget);
          parent = this_.closest('.menu-marker');
          markerCat = parent.attr('data-markerCat');
          if (this_.hasClass('off')) {
            this_.removeClass('off');
            _this.setMarkersVisibilityByCat(true, markerCat);
            return parent.find('.trigger').removeClass('off');
          } else {
            this_.addClass('off');
            _this.setMarkersVisibilityByCat(false, markerCat);
            return parent.find('.trigger').addClass('off');
          }
        });
        _this.markersOptionsMenu.prepend(html);
        _results = [];
        for (markerCat in Markers) {
          if (markerCat !== _this.defaultCat) {
            _results.push(_this.turnOfMenuIconsFromCat(markerCat));
          }
        }
        return _results;
      });
    };

    CustomMap.prototype.initializeAreaSummaryBoxes = function() {
      var area, _results;
      _results = [];
      for (area in Areas) {
        _results.push(this.areaSummaryBoxes[area] = new AreaSummary(this.map, Areas[area]));
      }
      return _results;
    };

    CustomMap.prototype.setAreasInformationVisibility = function(isVisible) {
      var box, _i, _len, _ref, _results;
      _ref = this.areaSummaryBoxes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        box = _ref[_i];
        _results.push(box.setVisible(isVisible));
      }
      return _results;
    };

    CustomMap.prototype.toggleMarkersOptionsMenu = function() {
      return this.markersOptionsMenu.toggleClass('active');
    };

    CustomMap.prototype.hideMarkersOptionsMenu = function() {
      return this.markersOptionsMenu.addClass('off');
    };

    CustomMap.prototype.showMarkersOptionsMenu = function() {
      return this.markersOptionsMenu.removeClass('off');
    };

    return CustomMap;

  })();

  /*
  # }}}
  */


  /*
  # class AreaSummary {{{
  */


  AreaSummary = (function() {

    function AreaSummary(map, area) {
      var neBound, swBound,
        _this = this;
      swBound = new google.maps.LatLng(area.swLat, area.swLng);
      neBound = new google.maps.LatLng(area.neLat, area.neLng);
      this.bounds_ = new google.maps.LatLngBounds(swBound, neBound);
      this.area_ = area;
      this.div_ = null;
      this.height_ = 80;
      this.width_ = 150;
      this.template = "";
      $.get('assets/javascripts/templates/areasSummary._', function(e) {
        _this.template = _.template(e);
        return _this.setMap(map);
      });
    }

    AreaSummary.prototype = new google.maps.OverlayView();

    AreaSummary.prototype.onAdd = function() {
      var content, panes;
      content = this.template(this.area_);
      this.div_ = $(content)[0];
      panes = this.getPanes();
      panes.overlayImage.appendChild(this.div_);
      return this.setVisible(false);
    };

    AreaSummary.prototype.draw = function() {
      var div, ne, overlayProjection, sw;
      overlayProjection = this.getProjection();
      sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
      ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
      div = this.div_;
      div.style.left = sw.x + ((ne.x - sw.x) - this.width_) / 2 + 'px';
      return div.style.top = ne.y + ((sw.y - ne.y) - this.height_) / 2 + 'px';
    };

    AreaSummary.prototype.setVisible = function(isVisible) {
      if (this.div_) {
        if (isVisible === true) {
          return this.div_.style.visibility = "visible";
        } else {
          return this.div_.style.visibility = "hidden";
        }
      }
    };

    return AreaSummary;

  })();

  /*
  # }}}
  */


  extractUrlParams = function() {
    var element, f, parameters, x, _i, _len;
    parameters = location.search.substring(1).split('&');
    f = [];
    for (_i = 0, _len = parameters.length; _i < _len; _i++) {
      element = parameters[_i];
      x = element.split('=');
      f[x[0]] = x[1];
    }
    return f;
  };

  $(function() {
    var markersOptionsMenuToggle, myCustomMap;
    myCustomMap = new CustomMap('#map');
    markersOptionsMenuToggle = $('#options-toggle strong');
    return markersOptionsMenuToggle.click(function() {
      return myCustomMap.toggleMarkersOptionsMenu();
    });
  });

}).call(this);
