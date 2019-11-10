sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/m/Dialog',
    'sap/m/Button',
    'sap/m/Text',
    'sap/m/Label',
    'sap/m/Input',
    'pslint/appid/model/formatter',
  ],
  function(Controller, MessageToast, Dialog, Button, Text, Label, Input, formatter) {
    'use strict';
        return Controller.extend('pslint.appid.controller.BaseController', {

      formatter: formatter,

      _arguments: null,
      _oi18n: null,
      _oODataModel: null,

      /**
       * Convenience method for accessing the router.
       * @public
       * @returns {sap.ui.core.routing.Router} the router for this component
       */
      getRouter: function() {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      /**
       * Convenience method for getting the view model by name.
       * @public
       * @param {string} [sName] the model name
       * @returns {sap.ui.model.Model} the model instance
       */
      getModel: function(sName) {
        return this.getView().getModel(sName);
      },

      /**
       * Convenience method for setting the view model.
       * @public
       * @param {sap.ui.model.Model} oModel the model instance
       * @param {string} sName the model name
       * @returns {sap.ui.mvc.View} the view instance
       */
      setModel: function(oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },
      /**
       * Getter for the resource bundle.
       * @public
       * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
       */
      getResourceBundle: function() {
        return this.getOwnerComponent()
          .getModel('i18n')
          .getResourceBundle();
      },

      /**
       * Navigate to page
       * @public
       * @param {string} target: page name
       * @param {Object} settings
       * @param {Boolean} replace history or not (default: true)
       * @returns null
       */
      goToPage: function(pageName, oParams, bReplace) {
        if (typeof bReplace === 'undefined') {
          bReplace = true;
        }
        this.oRouter.navTo(pageName, oParams, bReplace);
      },

      /** Show message toast with predefined parameters
       * @public
       * @param {string} sText
       * @param {Object} oParams optional
       * @returns null
       */
      showMessage: function(sText, oParams) {
        oParams = oParams || {
          duration: 2000,
          closeOnBrowserNavigation: false,
          animationDuration: 500,
        };
        MessageToast.show(sText, oParams);
      },
      /*
       * Global busy indicator
       */
      hideBusyIndicator: function() {
        sap.ui.core.BusyIndicator.hide();
      },

      showBusyIndicator: function(iDelay) {
        sap.ui.core.BusyIndicator.show(iDelay);
      },
    });
  }
);
