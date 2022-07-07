"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

var _tools = require("../../tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var browse = _tools.DomTools.browse;

function getTargetOffset(targer, container) {
  var offsetTop = 0;
  var offsetLeft = 0;

  var triggerCheckboxLabel = !browse.firefox && _tools.DomTools.hasClass(targer, 'vxe-checkbox--label');

  if (triggerCheckboxLabel) {
    var checkboxLabelStyle = getComputedStyle(targer);
    offsetTop -= _xeUtils.default.toNumber(checkboxLabelStyle.paddingTop);
    offsetLeft -= _xeUtils.default.toNumber(checkboxLabelStyle.paddingLeft);
  }

  while (targer && targer !== container) {
    offsetTop += targer.offsetTop;
    offsetLeft += targer.offsetLeft;
    targer = targer.offsetParent;

    if (triggerCheckboxLabel) {
      var checkboxStyle = getComputedStyle(targer);
      offsetTop -= _xeUtils.default.toNumber(checkboxStyle.paddingTop);
      offsetLeft -= _xeUtils.default.toNumber(checkboxStyle.paddingLeft);
    }
  }

  return {
    offsetTop: offsetTop,
    offsetLeft: offsetLeft
  };
}

function getCheckboxRangeResult(_vm, params, targetTrElem, moveRange) {
  var countHeight = 0;
  var rangeRows = [];
  var isDown = moveRange > 0;
  var moveSize = moveRange > 0 ? moveRange : Math.abs(moveRange) + targetTrElem.offsetHeight;
  var afterFullData = _vm.afterFullData,
      scrollYStore = _vm.scrollYStore,
      scrollYLoad = _vm.scrollYLoad;

  if (scrollYLoad) {
    var _rowIndex = _vm._getRowIndex(params.row);

    if (isDown) {
      rangeRows = afterFullData.slice(_rowIndex, _rowIndex + Math.ceil(moveSize / scrollYStore.rowHeight));
    } else {
      rangeRows = afterFullData.slice(_rowIndex - Math.floor(moveSize / scrollYStore.rowHeight) + 1, _rowIndex + 1);
    }
  } else {
    var siblingProp = isDown ? 'next' : 'previous';

    while (targetTrElem && countHeight < moveSize) {
      rangeRows.push(_vm.getRowNode(targetTrElem).item);
      countHeight += targetTrElem.offsetHeight;
      targetTrElem = targetTrElem["".concat(siblingProp, "ElementSibling")];
    }
  }

  return rangeRows;
}

var _default = {
  methods: {
    // 处理 Tab 键移动
    moveTabSelected: function moveTabSelected(args, isLeft, evnt) {
      var _this = this;

      var afterFullData = this.afterFullData,
          visibleColumn = this.visibleColumn,
          editConfig = this.editConfig,
          editOpts = this.editOpts,
          isSeqColumn = this.isSeqColumn;
      var targetRow;
      var targetRowIndex;
      var targetColumn;
      var targetColumnIndex;
      var params = Object.assign({}, args);
      var rowIndex = afterFullData.indexOf(params.row);
      var columnIndex = visibleColumn.indexOf(params.column);
      evnt.preventDefault();

      if (isLeft) {
        // 向左
        for (var len = columnIndex - 1; len >= 0; len--) {
          if (!isSeqColumn(visibleColumn[len])) {
            targetColumnIndex = len;
            targetColumn = visibleColumn[len];
            break;
          }
        }

        if (!targetColumn && rowIndex > 0) {
          // 如果找不到从上一行开始找，如果一行都找不到就不需要继续找了，可能不存在可编辑的列
          targetRowIndex = rowIndex - 1;
          targetRow = afterFullData[targetRowIndex];

          for (var _len = visibleColumn.length - 1; _len >= 0; _len--) {
            if (!isSeqColumn(visibleColumn[_len])) {
              targetColumnIndex = _len;
              targetColumn = visibleColumn[_len];
              break;
            }
          }
        }
      } else {
        // 向右
        for (var index = columnIndex + 1; index < visibleColumn.length; index++) {
          if (!isSeqColumn(visibleColumn[index])) {
            targetColumnIndex = index;
            targetColumn = visibleColumn[index];
            break;
          }
        }

        if (!targetColumn && rowIndex < afterFullData.length - 1) {
          // 如果找不到从下一行开始找，如果一行都找不到就不需要继续找了，可能不存在可编辑的列
          targetRowIndex = rowIndex + 1;
          targetRow = afterFullData[targetRowIndex];

          for (var _index = 0; _index < visibleColumn.length; _index++) {
            if (!isSeqColumn(visibleColumn[_index])) {
              targetColumnIndex = _index;
              targetColumn = visibleColumn[_index];
              break;
            }
          }
        }
      }

      if (targetColumn) {
        if (targetRow) {
          params.rowIndex = targetRowIndex;
          params.row = targetRow;
        } else {
          params.rowIndex = rowIndex;
        }

        params.columnIndex = targetColumnIndex;
        params.column = targetColumn;
        params.cell = _tools.DomTools.getCell(this, params);

        if (editConfig) {
          if (editOpts.trigger === 'click' || editOpts.trigger === 'dblclick') {
            if (editOpts.mode === 'row') {
              this.handleActived(params, evnt);
            } else {
              this.scrollToRow(params.row, params.column).then(function () {
                return _this.handleSelected(params, evnt);
              });
            }
          }
        }
      }
    },
    // 处理当前行方向键移动
    moveCurrentRow: function moveCurrentRow(isUpArrow, isDwArrow, evnt) {
      var _this2 = this;

      var currentRow = this.currentRow,
          treeConfig = this.treeConfig,
          treeOpts = this.treeOpts,
          afterFullData = this.afterFullData;
      var targetRow;
      evnt.preventDefault();

      if (treeConfig) {
        var _XEUtils$findTree = _xeUtils.default.findTree(afterFullData, function (item) {
          return item === currentRow;
        }, treeOpts),
            index = _XEUtils$findTree.index,
            items = _XEUtils$findTree.items;

        if (isUpArrow && index > 0) {
          targetRow = items[index - 1];
        } else if (isDwArrow && index < items.length - 1) {
          targetRow = items[index + 1];
        }
      } else {
        var _rowIndex = this._getRowIndex(currentRow);

        if (isUpArrow && _rowIndex > 0) {
          targetRow = afterFullData[_rowIndex - 1];
        } else if (isDwArrow && _rowIndex < afterFullData.length - 1) {
          targetRow = afterFullData[_rowIndex + 1];
        }
      }

      if (targetRow) {
        var params = {
          $table: this,
          row: targetRow
        };
        this.scrollToRow(targetRow).then(function () {
          return _this2.triggerCurrentRowEvent(evnt, params);
        });
      }
    },
    // 处理可编辑方向键移动
    moveSelected: function moveSelected(args, isLeftArrow, isUpArrow, isRightArrow, isDwArrow, evnt) {
      var _this3 = this;

      var afterFullData = this.afterFullData,
          visibleColumn = this.visibleColumn,
          isSeqColumn = this.isSeqColumn;
      var params = Object.assign({}, args);

      var _rowIndex = this._getRowIndex(params.row);

      var _columnIndex = this._getColumnIndex(params.column);

      evnt.preventDefault();

      if (isUpArrow && _rowIndex > 0) {
        // 移动到上一行
        params.rowIndex = _rowIndex - 1;
        params.row = afterFullData[params.rowIndex];
      } else if (isDwArrow && _rowIndex < afterFullData.length - 1) {
        // 移动到下一行
        params.rowIndex = _rowIndex + 1;
        params.row = afterFullData[params.rowIndex];
      } else if (isLeftArrow && _columnIndex) {
        for (var len = _columnIndex - 1; len >= 0; len--) {
          if (!isSeqColumn(visibleColumn[len])) {
            params.columnIndex = len;
            params.column = visibleColumn[len];
            break;
          }
        }
      } else if (isRightArrow) {
        for (var index = _columnIndex + 1; index < visibleColumn.length; index++) {
          if (!isSeqColumn(visibleColumn[index])) {
            params.columnIndex = index;
            params.column = visibleColumn[index];
            break;
          }
        }
      }

      this.scrollToRow(params.row, params.column).then(function () {
        params.cell = _tools.DomTools.getCell(_this3, params);

        _this3.handleSelected(params, evnt);
      });
    },

    /**
     * 表头按下事件
     */
    triggerHeaderCellMousedownEvent: function triggerHeaderCellMousedownEvent(evnt, params) {
      var $el = this.$el,
          tableData = this.tableData,
          mouseConfig = this.mouseConfig,
          mouseOpts = this.mouseOpts,
          elemStore = this.elemStore,
          handleChecked = this.handleChecked,
          handleHeaderChecked = this.handleHeaderChecked;
      var button = evnt.button;
      var column = params.column;
      var cell = evnt.currentTarget;
      var isLeftBtn = button === 0; // v3.0 废弃 type=index

      var isIndex = column.type === 'seq' || column.type === 'index'; // 在 v3.0 中废弃 mouse-config.checked

      var isMouseChecked = mouseConfig && (mouseOpts.range || mouseOpts.checked);
      params.cell = cell;

      if (mouseConfig) {
        if (isMouseChecked) {
          var headerList = elemStore['main-header-list'].children;
          var bodyList = elemStore['main-body-list'].children;

          if (isIndex) {
            this.handleAllChecked(evnt);
          } else {
            this.clearSelected(evnt);
            this.clearHeaderChecked();
            this.clearIndexChecked();
            var startCell = bodyList[0].querySelector(".".concat(column.id));

            if (isLeftBtn) {
              var domMousemove = document.onmousemove;
              var domMouseup = document.onmouseup;

              var updateEvent = _xeUtils.default.throttle(function (evnt) {
                var _DomTools$getEventTar = _tools.DomTools.getEventTargetNode(evnt, $el, 'vxe-header--column'),
                    flag = _DomTools$getEventTar.flag,
                    targetElem = _DomTools$getEventTar.targetElem;

                if (!flag) {
                  var nodeRest = _tools.DomTools.getEventTargetNode(evnt, $el, 'vxe-body--column');

                  flag = nodeRest.flag;
                  targetElem = nodeRest.targetElem;
                }

                if (flag && !_tools.DomTools.hasClass(targetElem, 'col--seq')) {
                  var colIndex = [].indexOf.call(targetElem.parentNode.children, targetElem);
                  var endCell = bodyList[bodyList.length - 1].children[colIndex];
                  var head = headerList[0].children[colIndex];
                  handleHeaderChecked(_tools.DomTools.getRowNodes(headerList, _tools.DomTools.getCellNodeIndex(head), _tools.DomTools.getCellNodeIndex(cell)));
                  handleChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(startCell), _tools.DomTools.getCellNodeIndex(endCell)));
                }
              }, 80, {
                leading: true,
                trailing: true
              });

              _tools.DomTools.addClass($el, 'c--checked');

              document.onmousemove = function (evnt) {
                evnt.preventDefault();
                evnt.stopPropagation();
                updateEvent(evnt);
              };

              document.onmouseup = function () {
                _tools.DomTools.removeClass($el, 'c--checked');

                document.onmousemove = domMousemove;
                document.onmouseup = domMouseup;
              };
            }

            handleHeaderChecked([[cell]]);

            if (bodyList.length) {
              var endCell = bodyList[bodyList.length - 1].querySelector(".".concat(column.id));
              var firstTrElem = bodyList[0];
              var lastTrElem = bodyList[bodyList.length - 1];
              var firstCell = firstTrElem.querySelector('.col--seq');
              params.rowIndex = 0;
              params.row = tableData[0];
              params.cell = _tools.DomTools.getCell(this, params);
              this.handleSelected(params, evnt);
              this.handleIndexChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(firstCell), _tools.DomTools.getCellNodeIndex(lastTrElem.querySelector('.col--seq'))));
              this.handleChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(startCell), _tools.DomTools.getCellNodeIndex(endCell)));
            }
          }
        }
      }

      this.focus();
      this.closeMenu();
    },

    /**
     * 单元格按下事件
     */
    triggerCellMousedownEvent: function triggerCellMousedownEvent(evnt, params) {
      var $el = this.$el,
          visibleColumn = this.visibleColumn,
          editStore = this.editStore,
          editConfig = this.editConfig,
          editOpts = this.editOpts,
          handleSelected = this.handleSelected,
          checkboxOpts = this.checkboxOpts,
          mouseConfig = this.mouseConfig,
          mouseOpts = this.mouseOpts,
          handleChecked = this.handleChecked,
          handleIndexChecked = this.handleIndexChecked,
          handleHeaderChecked = this.handleHeaderChecked,
          elemStore = this.elemStore;
      var checked = editStore.checked;
      var column = params.column;
      var button = evnt.button;
      var cell = evnt.currentTarget;
      var isLeftBtn = button === 0; // v3.0 废弃 type=index

      var isIndex = column.type === 'seq' || column.type === 'index'; // 在 v3.0 中废弃 mouse-config.checked

      var isMouseChecked = mouseConfig && (mouseOpts.range || mouseOpts.checked);
      params.cell = cell;

      if (isMouseChecked) {
        this.clearHeaderChecked();
        this.clearIndexChecked();
        var bodyList = elemStore['main-body-list'].children;
        var headerList = elemStore['main-header-list'].children;
        var cellLastElementChild = cell.parentNode.lastElementChild;
        var cellFirstElementChild = cell.parentNode.firstElementChild;

        if (isLeftBtn) {
          var domMousemove = document.onmousemove;
          var domMouseup = document.onmouseup;

          var startCellNode = _tools.DomTools.getCellNodeIndex(cell);

          var colIndex = [].indexOf.call(cell.parentNode.children, cell);
          var headStart = headerList[0].children[colIndex];

          var updateEvent = _xeUtils.default.throttle(function (evnt) {
            var _DomTools$getEventTar2 = _tools.DomTools.getEventTargetNode(evnt, $el, 'vxe-body--column'),
                flag = _DomTools$getEventTar2.flag,
                targetElem = _DomTools$getEventTar2.targetElem;

            if (flag) {
              if (isIndex) {
                var firstCell = targetElem.parentNode.firstElementChild;
                handleChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(firstCell.nextElementSibling), _tools.DomTools.getCellNodeIndex(cellLastElementChild)));
                handleIndexChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(firstCell), _tools.DomTools.getCellNodeIndex(cell)));
              } else if (!_tools.DomTools.hasClass(targetElem, 'col--seq')) {
                var _firstCell = targetElem.parentNode.firstElementChild;

                var _colIndex = [].indexOf.call(targetElem.parentNode.children, targetElem);

                var head = headerList[0].children[_colIndex];
                handleHeaderChecked(_tools.DomTools.getRowNodes(headerList, _tools.DomTools.getCellNodeIndex(head), _tools.DomTools.getCellNodeIndex(headStart)));
                handleIndexChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(_firstCell), _tools.DomTools.getCellNodeIndex(cellFirstElementChild)));
                handleChecked(_tools.DomTools.getRowNodes(bodyList, startCellNode, _tools.DomTools.getCellNodeIndex(targetElem)));
              }
            }
          }, 80, {
            leading: true,
            trailing: true
          });

          document.onmousemove = function (evnt) {
            evnt.preventDefault();
            evnt.stopPropagation();
            updateEvent(evnt);
          };

          document.onmouseup = function () {
            document.onmousemove = domMousemove;
            document.onmouseup = domMouseup;
          };
        }

        if (isIndex) {
          var firstCell = cell.parentNode.firstElementChild;
          params.columnIndex++;
          params.column = visibleColumn[params.columnIndex];
          params.cell = cell.nextElementSibling;
          handleSelected(params, evnt);
          handleChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(firstCell.nextElementSibling), _tools.DomTools.getCellNodeIndex(cellLastElementChild)));
          handleHeaderChecked([headerList[0].querySelectorAll('.vxe-header--column:not(.col--seq)')]);
          handleIndexChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(firstCell), _tools.DomTools.getCellNodeIndex(cell)));
        } else {
          if (isLeftBtn) {
            var _firstCell2 = cell.parentNode.firstElementChild;
            handleSelected(params, evnt);
            handleHeaderChecked([[headerList[0].querySelector(".".concat(column.id))]]);
            handleIndexChecked([[_firstCell2]]);
          } else {
            if (mouseOpts.selected) {
              // 如果右键单元格不在所有选中的范围之内则重新选中
              if (!checked.rowNodes || !checked.rowNodes.some(function (list) {
                return list.indexOf(cell) > -1;
              })) {
                handleSelected(params, evnt);
              }
            }
          }
        }
      } else {
        if (checkboxOpts.range) {
          if (isLeftBtn) {
            this.handleCheckboxRangeEvent(evnt, params);
          }
        }

        if (mouseOpts.selected) {
          if (!isIndex && (!editConfig || editOpts.mode === 'cell')) {
            handleSelected(params, evnt);
          }
        }
      }

      this.focus();
      this.closeFilter();
      this.closeMenu();
    },

    /**
     * 边角事件
     */
    // triggerCornerMousedownEvent (params, evnt) {
    //   evnt.preventDefault()
    //   evnt.stopPropagation()
    //   const { $el, tableData, visibleColumn, editStore, editConfig, editOpts, handleTempChecked } = this
    //   const { checked } = editStore
    //   const { button } = evnt
    //   const isLeftBtn = button === 0
    //   const isRightBtn = button === 2
    //   if (isLeftBtn || isRightBtn) {
    //     if (editConfig && checked.rows.length && editOpts.trigger === 'dblclick') {
    //       const domMousemove = document.onmousemove
    //       const domMouseup = document.onmouseup
    //       const start = {
    //         rowIndex: tableData.indexOf(checked.rows[0]),
    //         columnIndex: visibleColumn.indexOf(checked.columns[0])
    //       }
    //       const updateEvent = XEUtils.throttle(function (evnt) {
    //         evnt.preventDefault()
    //         const { flag, targetElem } = DomTools.getEventTargetNode(evnt, $el, 'vxe-body--column')
    //         if (flag) {
    //           handleTempChecked(start, DomTools.getCellIndexs(targetElem), evnt)
    //         }
    //       }, browse.msie ? 80 : 40, { leading: true, trailing: true })
    //       document.onmousemove = updateEvent
    //       document.onmouseup = function (evnt) {
    //         document.onmousemove = domMousemove
    //         document.onmouseup = domMouseup
    //         checked.rows = checked.tRows
    //         checked.columns = checked.tColumns
    //       }
    //     }
    //   }
    // },
    getCheckboxRangeResult: function getCheckboxRangeResult(targetTrElem, moveRange) {
      var countHeight = 0;
      var rangeRows = [];
      var siblingProp = moveRange > 0 ? 'next' : 'previous';
      var moveSize = moveRange > 0 ? moveRange : Math.abs(moveRange) + targetTrElem.offsetHeight;

      while (targetTrElem && countHeight < moveSize) {
        rangeRows.push(this.getRowNode(targetTrElem).item);
        countHeight += targetTrElem.offsetHeight;
        targetTrElem = targetTrElem["".concat(siblingProp, "ElementSibling")];
      }

      return rangeRows;
    },
    handleCheckboxRangeEvent: function handleCheckboxRangeEvent(evnt, params) {
      var _this4 = this;

      var column = params.column,
          cell = params.cell; // 在 v3.0 中废弃 type=selection

      if (['checkbox', 'selection'].indexOf(column.type) > -1) {
        var elemStore = this.elemStore;
        var disX = evnt.clientX;
        var disY = evnt.clientY;
        var bodyWrapperElem = elemStore["".concat(column.fixed || 'main', "-body-wrapper")] || elemStore['main-body-wrapper'];
        var checkboxRangeElem = elemStore["".concat(column.fixed || 'main', "-body-checkRange")] || elemStore['main-body-checkRange'];
        var domMousemove = document.onmousemove;
        var domMouseup = document.onmouseup;
        var trElem = cell.parentNode;
        var selectRecords = this.getCheckboxRecords();
        var lastRangeRows = [];
        var marginSize = 1;
        var offsetRest = getTargetOffset(evnt.target, bodyWrapperElem);
        var startTop = offsetRest.offsetTop + evnt.offsetY;
        var startLet = offsetRest.offsetLeft + evnt.offsetX;
        var startScrollTop = bodyWrapperElem.scrollTop;
        var rowHeight = trElem.offsetHeight;
        var mouseScrollTimeout = null;
        var isMouseScrollDown = false;
        var mouseScrollSpaceSize = 1; // 处理复选框选中

        var handleChecked = function handleChecked(evnt) {
          var clientX = evnt.clientX,
              clientY = evnt.clientY;
          var offsetLeft = clientX - disX;
          var offsetTop = clientY - disY + (bodyWrapperElem.scrollTop - startScrollTop);
          var rangeHeight = Math.abs(offsetTop);
          var rangeWidth = Math.abs(offsetLeft);
          var rangeTop = startTop;
          var rangeLeft = startLet;

          if (offsetTop < marginSize) {
            // 向上
            rangeTop += offsetTop;

            if (rangeTop < marginSize) {
              rangeTop = marginSize;
              rangeHeight = startTop;
            }
          } else {
            // 向下
            rangeHeight = Math.min(rangeHeight, bodyWrapperElem.scrollHeight - startTop - marginSize);
          }

          if (offsetLeft < marginSize) {
            // 向左
            rangeLeft += offsetLeft;

            if (rangeWidth > startLet) {
              rangeLeft = marginSize;
              rangeWidth = startLet;
            }
          } else {
            // 向右
            rangeWidth = Math.min(rangeWidth, bodyWrapperElem.clientWidth - startLet - marginSize);
          }

          checkboxRangeElem.style.height = "".concat(rangeHeight, "px");
          checkboxRangeElem.style.width = "".concat(rangeWidth, "px");
          checkboxRangeElem.style.left = "".concat(rangeLeft, "px");
          checkboxRangeElem.style.top = "".concat(rangeTop, "px");
          checkboxRangeElem.style.display = 'block';
          var rangeRows = getCheckboxRangeResult(_this4, params, trElem, offsetTop < marginSize ? -rangeHeight : rangeHeight); // 至少滑动 10px 才能有效匹配

          if (rangeHeight > 10 && rangeRows.length !== lastRangeRows.length) {
            lastRangeRows = rangeRows;

            if (evnt.ctrlKey) {
              rangeRows.forEach(function (row) {
                _this4.handleSelectRow({
                  row: row
                }, selectRecords.indexOf(row) === -1);
              });
            } else {
              _this4.setAllCheckboxRow(false);

              _this4.setCheckboxRow(rangeRows, true);
            }
          }
        }; // 停止鼠标滚动


        var stopMouseScroll = function stopMouseScroll() {
          clearTimeout(mouseScrollTimeout);
          mouseScrollTimeout = null;
        }; // 开始鼠标滚动


        var startMouseScroll = function startMouseScroll(evnt) {
          stopMouseScroll();
          mouseScrollTimeout = setTimeout(function () {
            if (mouseScrollTimeout) {
              var scrollLeft = bodyWrapperElem.scrollLeft,
                  scrollTop = bodyWrapperElem.scrollTop,
                  clientHeight = bodyWrapperElem.clientHeight,
                  scrollHeight = bodyWrapperElem.scrollHeight;
              var topSize = Math.ceil(mouseScrollSpaceSize * 50 / rowHeight);

              if (isMouseScrollDown) {
                if (scrollTop + clientHeight < scrollHeight) {
                  _this4.scrollTo(scrollLeft, scrollTop + topSize);

                  startMouseScroll(evnt);
                  handleChecked(evnt);
                } else {
                  stopMouseScroll();
                }
              } else {
                if (scrollTop) {
                  _this4.scrollTo(scrollLeft, scrollTop - topSize);

                  startMouseScroll(evnt);
                  handleChecked(evnt);
                } else {
                  stopMouseScroll();
                }
              }
            }
          }, 50);
        };

        document.onmousemove = function (evnt) {
          evnt.preventDefault();
          evnt.stopPropagation();
          var clientY = evnt.clientY;

          var _DomTools$getAbsolute = _tools.DomTools.getAbsolutePos(bodyWrapperElem),
              boundingTop = _DomTools$getAbsolute.boundingTop; // 如果超过可视区，触发滚动


          if (clientY < boundingTop) {
            isMouseScrollDown = false;
            mouseScrollSpaceSize = boundingTop - clientY;

            if (!mouseScrollTimeout) {
              startMouseScroll(evnt);
            }
          } else if (clientY > boundingTop + bodyWrapperElem.clientHeight) {
            isMouseScrollDown = true;
            mouseScrollSpaceSize = clientY - boundingTop - bodyWrapperElem.clientHeight;

            if (!mouseScrollTimeout) {
              startMouseScroll(evnt);
            }
          } else if (mouseScrollTimeout) {
            stopMouseScroll();
          }

          handleChecked(evnt);
        };

        document.onmouseup = function () {
          stopMouseScroll();
          checkboxRangeElem.removeAttribute('style');
          document.onmousemove = domMousemove;
          document.onmouseup = domMouseup;
        };
      }
    },

    /**
     * 清除所有选中状态
     */
    _clearChecked: function _clearChecked() {
      var $refs = this.$refs,
          editStore = this.editStore,
          mouseConfig = this.mouseConfig,
          mouseOpts = this.mouseOpts;
      var checked = editStore.checked; // 在 v3.0 中废弃 mouse-config.checked

      var isMouseChecked = mouseConfig && (mouseOpts.range || mouseOpts.checked);

      if (isMouseChecked) {
        var tableBody = $refs.tableBody;
        checked.rows = [];
        checked.columns = [];
        checked.tRows = [];
        checked.tColumns = [];
        var checkBorders = tableBody.$refs.checkBorders;
        checkBorders.style.display = 'none';

        _xeUtils.default.arrayEach(tableBody.$el.querySelectorAll('.col--checked'), function (elem) {
          return _tools.DomTools.removeClass(elem, 'col--checked');
        });
      }

      return this.$nextTick();
    },
    _getMouseSelecteds: function _getMouseSelecteds() {
      _tools.UtilTools.warn('vxe.error.delFunc', ['getMouseSelecteds', 'getSelectedCell']);

      return this.getSelectedCell();
    },
    _getMouseCheckeds: function _getMouseCheckeds() {
      // UtilTools.warn('vxe.error.delFunc', ['getMouseCheckeds', 'getSelectedRanges'])
      return this.getSelectedRanges();
    },

    /**
     * 获取选中的单元格
     */
    _getSelectedCell: function _getSelectedCell() {
      var _this$editStore$selec = this.editStore.selected,
          args = _this$editStore$selec.args,
          column = _this$editStore$selec.column;

      if (args && column) {
        return Object.assign({}, args);
      }

      return null;
    },

    /**
     * 获取所有选中的单元格
     */
    _getSelectedRanges: function _getSelectedRanges() {
      var _this5 = this;

      var checked = this.editStore.checked;
      var _checked$rowNodes = checked.rowNodes,
          rowNodes = _checked$rowNodes === void 0 ? [] : _checked$rowNodes;
      var columns = [];
      var rows = [];

      if (rowNodes && rowNodes.length) {
        rows = rowNodes.map(function (list) {
          return _this5.getRowNode(list[0].parentNode).item;
        });
        columns = rowNodes[0].map(function (cell) {
          return _this5.getColumnNode(cell).item;
        });
      }

      return {
        columns: columns,
        rows: rows,
        rowNodes: rowNodes
      };
    },

    /**
     * 处理所有选中
     */
    handleChecked: function handleChecked(rowNodes) {
      var checked = this.editStore.checked;
      this.clearChecked();
      var cWidth = -2;
      var cHeight = -2;
      var offsetTop = 0;
      var offsetLeft = 0;

      _xeUtils.default.arrayEach(rowNodes, function (rows, rowIndex) {
        var isTop = rowIndex === 0;

        _xeUtils.default.arrayEach(rows, function (elem, colIndex) {
          var isLeft = colIndex === 0;

          if (isLeft && isTop) {
            offsetTop = elem.offsetTop;
            offsetLeft = elem.offsetLeft;
          }

          if (isTop) {
            cWidth += elem.offsetWidth;
          }

          if (isLeft) {
            cHeight += elem.offsetHeight;
          }

          _tools.DomTools.addClass(elem, 'col--checked');
        });
      });

      var _this$$refs$tableBody = this.$refs.tableBody.$refs,
          checkBorders = _this$$refs$tableBody.checkBorders,
          checkTop = _this$$refs$tableBody.checkTop,
          checkRight = _this$$refs$tableBody.checkRight,
          checkBottom = _this$$refs$tableBody.checkBottom,
          checkLeft = _this$$refs$tableBody.checkLeft;
      checkBorders.style.display = 'block';
      Object.assign(checkTop.style, {
        top: "".concat(offsetTop, "px"),
        left: "".concat(offsetLeft, "px"),
        width: "".concat(cWidth, "px")
      });
      Object.assign(checkRight.style, {
        top: "".concat(offsetTop, "px"),
        left: "".concat(offsetLeft + cWidth, "px"),
        height: "".concat(cHeight, "px")
      });
      Object.assign(checkBottom.style, {
        top: "".concat(offsetTop + cHeight, "px"),
        left: "".concat(offsetLeft, "px"),
        width: "".concat(cWidth, "px")
      });
      Object.assign(checkLeft.style, {
        top: "".concat(offsetTop, "px"),
        left: "".concat(offsetLeft, "px"),
        height: "".concat(cHeight, "px")
      });
      checked.rowNodes = rowNodes;
    },
    handleAllChecked: function handleAllChecked(evnt) {
      var tableData = this.tableData,
          visibleColumn = this.visibleColumn,
          mouseConfig = this.mouseConfig,
          mouseOpts = this.mouseOpts,
          elemStore = this.elemStore; // 在 v3.0 中废弃 mouse-config.checked

      var isMouseChecked = mouseConfig && (mouseOpts.range || mouseOpts.checked);

      if (isMouseChecked) {
        evnt.preventDefault();
        var headerListElem = elemStore['main-header-list'];
        var headerList = headerListElem.children;
        var bodyList = elemStore['main-body-list'].children; // v3.0 废弃 type=index

        var column = _xeUtils.default.find(visibleColumn, function (column) {
          return column.type === 'seq' || column.type === 'index';
        }) || visibleColumn[0];
        var cell = headerListElem.querySelector(".".concat(column.id));
        var firstTrElem = bodyList[0];
        var lastTrElem = bodyList[bodyList.length - 1];
        var firstCell = firstTrElem.querySelector(".".concat(column.id));
        var params = {
          $table: this,
          rowIndex: 0,
          row: tableData[0],
          column: _xeUtils.default.find(visibleColumn, function (column) {
            return column.property;
          })
        };
        params.columnIndex = this.getColumnIndex(params.column);
        params.cell = _tools.DomTools.getCell(this, params);
        this.handleSelected(params, evnt);
        this.handleHeaderChecked(_tools.DomTools.getRowNodes(headerList, _tools.DomTools.getCellNodeIndex(cell.nextElementSibling), _tools.DomTools.getCellNodeIndex(cell.parentNode.lastElementChild)));
        this.handleIndexChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(firstCell), _tools.DomTools.getCellNodeIndex(lastTrElem.querySelector(".".concat(column.id)))));
        this.handleChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(firstCell.nextElementSibling), _tools.DomTools.getCellNodeIndex(lastTrElem.lastElementChild)));
      }
    },
    handleIndexChecked: function handleIndexChecked(rowNodes) {
      var indexs = this.editStore.indexs;
      this.clearIndexChecked();

      _xeUtils.default.arrayEach(rowNodes, function (rows) {
        _xeUtils.default.arrayEach(rows, function (elem) {
          _tools.DomTools.addClass(elem, 'col--seq-checked');
        });
      });

      indexs.rowNodes = rowNodes;
    },
    _clearIndexChecked: function _clearIndexChecked() {
      var elemStore = this.elemStore;
      var bodyElem = elemStore['main-body-list'];

      _xeUtils.default.arrayEach(bodyElem.querySelectorAll('.col--seq-checked'), function (elem) {
        return _tools.DomTools.removeClass(elem, 'col--seq-checked');
      });

      return this.$nextTick();
    },
    handleHeaderChecked: function handleHeaderChecked(rowNodes) {
      var titles = this.editStore.titles;
      this.clearHeaderChecked();

      _xeUtils.default.arrayEach(rowNodes, function (rows) {
        _xeUtils.default.arrayEach(rows, function (elem) {
          _tools.DomTools.addClass(elem, 'col--title-checked');
        });
      });

      titles.rowNodes = rowNodes;
    },
    _clearHeaderChecked: function _clearHeaderChecked() {
      var elemStore = this.elemStore;
      var headerElem = elemStore['main-header-list'];

      if (headerElem) {
        _xeUtils.default.arrayEach(headerElem.querySelectorAll('.col--title-checked'), function (elem) {
          return _tools.DomTools.removeClass(elem, 'col--title-checked');
        });
      }

      return this.$nextTick();
    },

    /**
     * 处理所有选中的临时选中
     */
    // handleTempChecked (start, end, evnt) {
    //   const { tableData, visibleColumn, editStore } = this
    //   const { checked } = editStore
    //   const { rows, tRows, columns, tColumns } = checked
    //   const { rowIndex: sRowIndex, columnIndex: sColumnIndex } = start
    //   const { rowIndex: eRowIndex, columnIndex: eColumnIndex } = end
    //   if (tRows.length > rows.length) {
    //     eColumnIndex = visibleColumn.indexOf(columns[columns.length - 1])
    //   } else if (tColumns.length > columns.length) {
    //     eRowIndex = tableData.indexOf(rows[rows.length - 1])
    //   }
    //   if (sRowIndex < eRowIndex) {
    //     // 向下
    //     checked.tRows = tableData.slice(sRowIndex, eRowIndex + 1)
    //   } else {
    //     // 向上
    //     sRowIndex += rows.length
    //     checked.tRows = tableData.slice(eRowIndex, sRowIndex)
    //   }
    //   if (sColumnIndex < eColumnIndex) {
    //     // 向右
    //     checked.tColumns = visibleColumn.slice(Math.max(sColumnIndex, 1), eColumnIndex + 1)
    //   } else {
    //     // 向左
    //     sColumnIndex += columns.length
    //     checked.tColumns = visibleColumn.slice(Math.max(eColumnIndex, 1), sColumnIndex)
    //   }
    // },

    /**
     * 清空已复制的内容
     */
    _clearCopyed: function _clearCopyed() {
      var $refs = this.$refs,
          editStore = this.editStore,
          keyboardConfig = this.keyboardConfig;
      var copyed = editStore.copyed;

      if (keyboardConfig && keyboardConfig.isCut) {
        var tableBody = $refs.tableBody;
        var copyBorders = $refs.tableBody.$refs.copyBorders;
        copyed.cut = false;
        copyed.rows = [];
        copyed.columns = [];
        copyBorders.style.display = 'none';

        _xeUtils.default.arrayEach(tableBody.$el.querySelectorAll('.col--copyed'), function (elem) {
          return _tools.DomTools.removeClass(elem, 'col--copyed');
        });
      }

      return this.$nextTick();
    },

    /**
     * 处理复制
     */
    handleCopyed: function handleCopyed(cut) {
      var tableData = this.tableData,
          tableColumn = this.tableColumn,
          editStore = this.editStore;
      var copyed = editStore.copyed,
          checked = editStore.checked;
      var rowNodes = checked.rowNodes;
      this.clearCopyed();
      var cWidth = -3;
      var cHeight = -3;
      var offsetTop = 0;
      var offsetLeft = 0;
      var columns = [];
      var rows = [];

      if (rowNodes.length) {
        var firstRows = rowNodes[0];

        var _DomTools$getCellNode = _tools.DomTools.getCellNodeIndex(firstRows[0]),
            rowIndex = _DomTools$getCellNode.rowIndex,
            columnIndex = _DomTools$getCellNode.columnIndex;

        columns = tableColumn.slice(columnIndex, columnIndex + firstRows.length);
        rows = tableData.slice(rowIndex, rowIndex + rowNodes.length);
      }

      _xeUtils.default.arrayEach(rowNodes, function (rows, rowIndex) {
        var isTop = rowIndex === 0;

        _xeUtils.default.arrayEach(rows, function (elem, colIndex) {
          var isLeft = colIndex === 0;

          if (isLeft && isTop) {
            offsetTop = elem.offsetTop;
            offsetLeft = elem.offsetLeft;
          }

          if (isTop) {
            cWidth += elem.offsetWidth;
          }

          if (isLeft) {
            cHeight += elem.offsetHeight;
          }

          _tools.DomTools.addClass(elem, 'col--copyed');
        });
      });

      var _this$$refs$tableBody2 = this.$refs.tableBody.$refs,
          copyBorders = _this$$refs$tableBody2.copyBorders,
          copyTop = _this$$refs$tableBody2.copyTop,
          copyRight = _this$$refs$tableBody2.copyRight,
          copyBottom = _this$$refs$tableBody2.copyBottom,
          copyLeft = _this$$refs$tableBody2.copyLeft;
      copyBorders.style.display = 'block';
      Object.assign(copyTop.style, {
        top: "".concat(offsetTop, "px"),
        left: "".concat(offsetLeft, "px"),
        width: "".concat(cWidth, "px")
      });
      Object.assign(copyRight.style, {
        top: "".concat(offsetTop, "px"),
        left: "".concat(offsetLeft + cWidth, "px"),
        height: "".concat(cHeight, "px")
      });
      Object.assign(copyBottom.style, {
        top: "".concat(offsetTop + cHeight, "px"),
        left: "".concat(offsetLeft, "px"),
        width: "".concat(cWidth, "px")
      });
      Object.assign(copyLeft.style, {
        top: "".concat(offsetTop, "px"),
        left: "".concat(offsetLeft, "px"),
        height: "".concat(cHeight, "px")
      });
      copyed.cut = cut;
      copyed.rows = rows;
      copyed.columns = columns;
      copyed.rowNodes = rowNodes;
    },

    /**
     * 处理粘贴
     */
    handlePaste: function handlePaste() {
      var tableData = this.tableData,
          visibleColumn = this.visibleColumn,
          editStore = this.editStore,
          elemStore = this.elemStore;
      var copyed = editStore.copyed,
          selected = editStore.selected;
      var cut = copyed.cut,
          rows = copyed.rows,
          columns = copyed.columns;

      if (rows.length && columns.length && selected.row && selected.column) {
        var _selected$args = selected.args,
            rowIndex = _selected$args.rowIndex,
            columnIndex = _selected$args.columnIndex;

        _xeUtils.default.arrayEach(rows, function (row, rIndex) {
          var offsetRow = tableData[rowIndex + rIndex];

          if (offsetRow) {
            _xeUtils.default.arrayEach(columns, function (column, cIndex) {
              var offsetColumn = visibleColumn[columnIndex + cIndex];

              if (offsetColumn) {
                _tools.UtilTools.setCellValue(offsetRow, offsetColumn, _tools.UtilTools.getCellValue(row, column));
              }

              if (cut) {
                _tools.UtilTools.setCellValue(row, column, null);
              }
            });
          }
        });

        if (cut) {
          this.clearCopyed();
        }

        var bodyList = elemStore['main-body-list'].children;
        var cell = selected.args.cell;
        var trElem = cell.parentNode;

        var colIndex = _xeUtils.default.arrayIndexOf(trElem.children, cell);

        var rIndex = _xeUtils.default.arrayIndexOf(bodyList, trElem);

        var targetTrElem = bodyList[rIndex + rows.length - 1];
        var targetCell = targetTrElem.children[colIndex + columns.length - 1];
        this.handleChecked(_tools.DomTools.getRowNodes(bodyList, _tools.DomTools.getCellNodeIndex(cell), _tools.DomTools.getCellNodeIndex(targetCell)));
      }
    }
  }
};
exports.default = _default;