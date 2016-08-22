import Ember from 'ember';

export default Ember.Component.extend({
    /* tagName: "" */
    actions :{
    showArchipacDis: function () {
      console.log("clicked disclaimer");
      "use strict";
      $('#archipac_disclaiminfo').dialog('open');
      return false;
    }
  } 
  
  
  
});

        
        