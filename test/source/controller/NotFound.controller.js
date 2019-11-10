sap.ui.define(['pslint/appid/controller/BaseController'], function(BaseController) {
  'use strict';

  return BaseController.extend('pslint.appid.controller.NotFound', {
    /**
     * Navigates to the masterPR when the link is pressed
     * @public
     */
    onLinkPressed: function() {
      this.getRouter().navTo('StartPage');
    },
  });
});
