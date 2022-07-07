"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

var _conf = _interopRequireDefault(require("../../conf"));

var _tools = require("../../tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'VxeList',
  props: {
    data: Array,
    height: [Number, String],
    maxHeight: [Number, String],
    loading: Boolean,
    autoResize: Boolean,
    syncResize: [Boolean, String, Number],
    scrollY: Object
  },
  data: function data() {
    return {
      scrollYLoad: false,
      bodyHeight: 0,
      topSpaceHeight: 0,
      items: []
    };
  },
  computed: {
    sYOpts: function sYOpts() {
      return Object.assign({}, _conf.default.list.scrollY, this.scrollY);
    },
    styles: function styles() {
      var height = this.height,
          maxHeight = this.maxHeight;
      var style = {};

      if (height) {
        style.height = isNaN(height) ? height : "".concat(height, "px");
      } else if (maxHeight) {
        style.height = 'auto';
        style.maxHeight = isNaN(maxHeight) ? maxHeight : "".concat(maxHeight, "px");
      }

      return style;
    }
  },
  watch: {
    data: function data(value) {
      this.loadData(value);
    },
    syncResize: function syncResize(value) {
      var _this = this;

      if (value) {
        this.recalculate();
        this.$nextTick(function () {
          return setTimeout(function () {
            return _this.recalculate();
          });
        });
      }
    }
  },
  created: function created() {
    Object.assign(this, {
      fullData: [],
      lastScrollLeft: 0,
      lastScrollTop: 0,
      scrollYStore: {
        startIndex: 0,
        visibleIndex: 0,
        renderSize: 0
      }
    });
    this.loadData(this.data);

    _tools.GlobalEvent.on(this, 'resize', this.handleGlobalResizeEvent);
  },
  mounted: function mounted() {
    var _this2 = this;

    if (this.autoResize) {
      var resizeObserver = new _tools.ResizeEvent(function () {
        return _this2.recalculate();
      });
      resizeObserver.observe(this.$el);
      this.$resize = resizeObserver;
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.$resize) {
      this.$resize.disconnect();
    }
  },
  destroyed: function destroyed() {
    _tools.GlobalEvent.off(this, 'resize');
  },
  render: function render(h) {
    var $scopedSlots = this.$scopedSlots,
        styles = this.styles,
        bodyHeight = this.bodyHeight,
        topSpaceHeight = this.topSpaceHeight,
        items = this.items,
        loading = this.loading;
    return [h('div', {
      class: ['vxe-list', {
        'is--loading': loading
      }]
    }, [h('div', {
      ref: 'virtualWrapper',
      class: 'vxe-list--virtual-wrapper',
      style: styles,
      on: {
        scroll: this.scrollEvent
      }
    }, [h('div', {
      ref: 'ySpace',
      class: 'vxe-list--y-space',
      style: {
        height: bodyHeight ? "".concat(bodyHeight, "px") : ''
      }
    }), h('div', {
      ref: 'body',
      class: 'vxe-list--body',
      style: {
        marginTop: topSpaceHeight ? "".concat(topSpaceHeight, "px") : ''
      }
    }, $scopedSlots.default ? $scopedSlots.default.call(this, {
      items: items,
      $list: this
    }, h) : [])]), h('div', {
      class: ['vxe-list--loading vxe-loading', {
        'is--visible': loading
      }]
    }, [h('div', {
      class: 'vxe-loading--spinner'
    })])])];
  },
  methods: {
    getParentElem: function getParentElem() {
      return this.$el.parentNode;
    },

    /**
     * 加载数据
     * @param {Array} datas 数据
     */
    loadData: function loadData(datas) {
      var _this3 = this;

      var sYOpts = this.sYOpts,
          scrollYStore = this.scrollYStore;
      var fullData = datas || [];
      scrollYStore.startIndex = 0;
      scrollYStore.visibleIndex = 0;
      this.fullData = fullData;
      this.scrollYLoad = sYOpts.gt > -1 && fullData.length > sYOpts.gt;
      this.handleData();
      return this.computeScrollLoad().then(function () {
        _this3.refreshScroll();
      });
    },

    /**
     * 重新加载数据
     * @param {Array} datas 数据
     */
    reloadData: function reloadData(datas) {
      this.clearScroll();
      return this.loadData(datas);
    },
    handleData: function handleData() {
      var fullData = this.fullData,
          scrollYLoad = this.scrollYLoad,
          scrollYStore = this.scrollYStore;
      this.items = scrollYLoad ? fullData.slice(scrollYStore.startIndex, Math.max(scrollYStore.startIndex + scrollYStore.renderSize, 1)) : fullData.slice(0);
      return this.$nextTick();
    },

    /**
     * 重新计算列表
     */
    recalculate: function recalculate() {
      var $el = this.$el;

      if ($el.clientWidth && $el.clientHeight) {
        return this.computeScrollLoad();
      }

      return Promise.resolve();
    },

    /**
     * 清除滚动条
     */
    clearScroll: function clearScroll() {
      var scrollBodyElem = this.$refs.virtualWrapper;

      if (scrollBodyElem) {
        scrollBodyElem.scrollTop = 0;
      }
    },

    /**
     * 刷新滚动条
     */
    refreshScroll: function refreshScroll() {
      var _this4 = this;

      var lastScrollLeft = this.lastScrollLeft,
          lastScrollTop = this.lastScrollTop;
      this.clearScroll();
      return this.$nextTick().then(function () {
        if (lastScrollLeft || lastScrollTop) {
          _this4.lastScrollLeft = 0;
          _this4.lastScrollTop = 0;
          return _this4.scrollTo(lastScrollLeft, lastScrollTop);
        }
      });
    },

    /**
     * 如果有滚动条，则滚动到对应的位置
     * @param {Number} scrollLeft 左距离
     * @param {Number} scrollTop 上距离
     */
    scrollTo: function scrollTo(scrollLeft, scrollTop) {
      var _this5 = this;

      var scrollBodyElem = this.$refs.virtualWrapper;

      if (_xeUtils.default.isNumber(scrollLeft)) {
        scrollBodyElem.scrollLeft = scrollLeft;
      }

      if (_xeUtils.default.isNumber(scrollTop)) {
        scrollBodyElem.scrollTop = scrollTop;
      }

      _tools.DomTools.triggerEvent(scrollBodyElem, 'scroll');

      if (this.scrollYLoad) {
        return new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(_this5.$nextTick());
          }, 50);
        });
      }

      return this.$nextTick();
    },
    computeScrollLoad: function computeScrollLoad() {
      var _this6 = this;

      return this.$nextTick().then(function () {
        var $refs = _this6.$refs,
            sYOpts = _this6.sYOpts,
            scrollYLoad = _this6.scrollYLoad,
            scrollYStore = _this6.scrollYStore;

        if (scrollYLoad) {
          var rHeight = 48;

          if (sYOpts.rHeight) {
            rHeight = sYOpts.rHeight;
          } else {
            var firstItemElem;

            if (sYOpts.sItem) {
              firstItemElem = $refs.body.querySelector(sYOpts.sItem);
            }

            if (!firstItemElem) {
              firstItemElem = $refs.body.children[0];
            }

            if (firstItemElem) {
              rHeight = firstItemElem.offsetHeight;
            }
          }

          var visibleYSize = _xeUtils.default.toNumber(sYOpts.vSize || Math.ceil($refs.virtualWrapper.clientHeight / rHeight));

          scrollYStore.visibleSize = visibleYSize;
          scrollYStore.rowHeight = rHeight;

          if (!sYOpts.oSize) {
            scrollYStore.offsetSize = visibleYSize;
          }

          if (!sYOpts.rSize) {
            scrollYStore.renderSize = Math.max(6, visibleYSize + 2);
          }

          _this6.updateYData();
        } else {
          _this6.updateYSpace();
        }
      });
    },
    scrollEvent: function scrollEvent(evnt) {
      var scrollBodyElem = evnt.target;
      var scrollTop = scrollBodyElem.scrollTop;
      var scrollLeft = scrollBodyElem.scrollLeft;
      var isX = scrollLeft !== this.lastScrollLeft;
      var isY = scrollTop !== this.lastScrollTop;
      this.lastScrollTop = scrollTop;
      this.lastScrollLeft = scrollLeft;

      if (this.scrollYLoad) {
        this.loadYData(evnt);
      }

      this.$emit('scroll', {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop,
        isX: isX,
        isY: isY,
        $event: evnt
      });
    },
    loadYData: function loadYData(evnt) {
      var fullData = this.fullData,
          scrollYStore = this.scrollYStore,
          isLoadData = this.isLoadData;
      var startIndex = scrollYStore.startIndex,
          renderSize = scrollYStore.renderSize,
          offsetSize = scrollYStore.offsetSize,
          visibleSize = scrollYStore.visibleSize,
          rowHeight = scrollYStore.rowHeight;
      var scrollBodyElem = evnt.target;
      var scrollTop = scrollBodyElem.scrollTop;
      var toVisibleIndex = Math.ceil(scrollTop / rowHeight);
      var preload = false;

      if (isLoadData || scrollYStore.visibleIndex !== toVisibleIndex) {
        var marginSize = Math.min(Math.floor((renderSize - visibleSize) / 2), visibleSize);

        if (scrollYStore.visibleIndex > toVisibleIndex) {
          preload = toVisibleIndex - offsetSize <= startIndex;

          if (preload) {
            scrollYStore.startIndex = Math.max(0, toVisibleIndex - Math.max(marginSize, renderSize - visibleSize));
          }
        } else {
          preload = toVisibleIndex + visibleSize + offsetSize >= startIndex + renderSize;

          if (preload) {
            scrollYStore.startIndex = Math.max(0, Math.min(fullData.length - renderSize, toVisibleIndex - marginSize));
          }
        }

        if (preload) {
          this.updateYData();
        }

        scrollYStore.visibleIndex = toVisibleIndex;
        this.isLoadData = false;
      }
    },
    updateYData: function updateYData() {
      this.handleData();
      this.updateYSpace();
    },
    updateYSpace: function updateYSpace() {
      var scrollYStore = this.scrollYStore,
          scrollYLoad = this.scrollYLoad,
          fullData = this.fullData;
      this.bodyHeight = scrollYLoad ? fullData.length * scrollYStore.rowHeight : 0;
      this.topSpaceHeight = scrollYLoad ? Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0) : 0;
    },
    handleGlobalResizeEvent: function handleGlobalResizeEvent() {
      this.recalculate();
    }
  }
};
exports.default = _default;