sap.ui.define(['pslint/appid/controller/BaseController'], function(BaseController) {
  'use strict';

  return BaseController.extend('pslint.appid.controller.App', {
    onInit: function() {
      var oViewModel = new sap.ui.model.json.JSONModel({
        busy: false,
        delay: 0,
      });
      this.setModel(oViewModel, 'appModel');
    },
  });
});