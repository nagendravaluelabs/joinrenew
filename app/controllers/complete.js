/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from "ember";
import rememberScroll from "../mixins/remember-scroll";
export default Ember.Controller.extend(rememberScroll, {
    init: function () {
        "use strict";
    }
});