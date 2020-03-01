function _initWidgetContext (name, callback) {
  var initFunc = function (widget) {
    if (!widget.getContext()) {
      widget.setContext(obj.getSystemContext());
    }
    callback && callback();
  };
  if (callback) {
    window.require.async(name, initFunc);
  }
  else {
    initFunc(obj.require(name));
  }
}

function pan_run () {
  let fileList = require('system-core:context/context.js').instanceForSystem.list.getSelected();
  _initWidgetContext("function-widget-1:download/util/context.js");

  window.require.async("function-widget-1:download/service/dlinkService.js", function (dl) {
    var yunData = window.yunData;
    var data = {
      list: fileList,
      share_uk: yunData.SHARE_UK,
      share_id: yunData.SHARE_ID,
      sign: yunData.SIGN,
      timestamp: yunData.TIMESTAMP,
      type: "nolimit"
    };
    console.log('....', JSON.stringify(data))
    dl.getDlinkShare(data, (response) => {
      console.log('Response: ', response);
    });
  })
}