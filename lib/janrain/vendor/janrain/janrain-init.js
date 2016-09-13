/*
Initializations and settings for the Capture Widget.

For more information about these settings, see the following documents:

    http://developers.janrain.com/documentation/widgets/social-sign-in-widget/social-sign-in-widget-api/settings/
    http://developers.janrain.com/documentation/widgets/user-registration-widget/capture-widget-api/settings/
*/

(function() {
    // Check for settings. If there are none, create them
    if (typeof window.janrain !== 'object') window.janrain = {};
    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
    if (typeof window.janrain.settings.capture !== 'object') window.janrain.settings.capture = {};

    // Load Engage and Capture. 'login' is Engage, 'capture' is Capture.
    // Changing these values without guidance can result in unexpected behavior.
    janrain.settings.packages = ['login', 'capture'];



    /*--- Application Settings -----------------------------------------------*\

        When transitioning from a development to production, these are the
        settings that need to be changed. Others may also need to be changed if
        you have purchased optional products and features, such as Federate.
        Those settings are located below.

        janrain.settings.appUrl:
            The URL of your Engage application.
            Example: https://your-company.rpxnow.com

        janrain.settings.capture.captureServer:
            The URL of your Capture application.
            Example: https://your-company.janraincapture.com

        janrain.settings.capture.appId:
            The the application ID of your Capture application.

        janrain.settings.capture.clientId:
            The client ID of the Capture application.

        Example Dev Configuration:
            janrain.settings.appUrl                = 'https://your-company-dev.rpxnow.com';
            janrain.settings.capture.captureServer = 'https://your-company-dev.janraincapture.com';
            janrain.settings.capture.appId         = <DEV CAPTURE APP ID>;
            janrain.settings.capture.clientId      = <DEV CAPTURE CLIENT ID>;
            var httpLoadUrl                        = "http://widgets-cdn.rpxnow.com/load/your-company-dev";
            var httpsLoadUrl                       = "https://rpxnow.com/load/your-company-dev";

        Example Prod Configuration:
            janrain.settings.appUrl                = 'https://login.yourcompany.com';
            janrain.settings.capture.captureServer = 'https://your-company.janraincapture.com';
            janrain.settings.capture.appId         = <PROD CAPTURE APP ID>;
            janrain.settings.capture.clientId      = <PROD CAPTURE CLIENT ID>;
            var httpLoadUrl                        = "http://rwidgets-cdn.pxnow.com/load/login.yourcompany.com";
            var httpsLoadUrl                       = "https://rpxnow.com/load/login.yourcompany.com";
    \*------------------------------------------------------------------------*/


    janrain.settings.appUrl                = 'https://american-institute-of-architects-dev.rpxnow.com';
    janrain.settings.capture.captureServer = 'https://american-institute-of-architects-dev.us-dev.janraincapture.com';
    janrain.settings.capture.appId         = '6u2cx5favu7vq3tgc892r67rey';
    janrain.settings.capture.clientId      = 'jhxbmd679pv6j3hatb3yz7xdpgtauced';

    // These are the URLs for your Engage app's load.js file, which is necessary
    // to load the Capture Widget.
    var httpLoadUrl  = "http://d29usylhdk1xyu.cloudfront.net/load/american-institute-of-architects-dev";
    var httpsLoadUrl = "https://d29usylhdk1xyu.cloudfront.net/load/american-institute-of-architects-dev";


    // --- Engage Widget Settings ----------------------------------------------
    janrain.settings.language = 'en';
    janrain.settings.tokenUrl = window.location.href;
    janrain.settings.tokenAction = 'event';
    janrain.settings.borderColor = '#ffffff';
    janrain.settings.fontFamily = 'Helvetica, Lucida Grande, Verdana, sans-serif';
    janrain.settings.width = 300;
    janrain.settings.actionText = ' ';

    // --- Capture Widget Settings ---------------------------------------------
    janrain.settings.capture.redirectUri = document.location.protocol + '//vcap.me/social-login/token';
    janrain.settings.capture.flowName = 'standard';
    janrain.settings.capture.flowVersion = 'HEAD';
    janrain.settings.capture.registerFlow = 'socialRegistration';
    janrain.settings.capture.setProfileCookie = true;
    janrain.settings.capture.keepProfileCookieAfterLogout = false;
    janrain.settings.capture.modalCloseHtml = ' ';
    janrain.settings.capture.noModalBorderInlineCss = true;
    janrain.settings.capture.responseType = 'code'; //us
    janrain.settings.capture.returnExperienceUserData = ['uuid','displayName','email', 'nfIndividualKey'];
    // janrain.settings.capture.stylesheets = ['/sites/all/modules/janrain/janrain.css'];
    // janrain.settings.capture.mobileStylesheets = ['/sites/all/modules/janrain/janrain-mobile.css'];
    janrain.settings.providers = [];


    // --- Mobile WebView ------------------------------------------------------
    //*PLEX*/ janrain.settings.capture.redirectFlow = true;
    //*PLEX*/ janrain.settings.popup = false;
    //*PLEX*/ janrain.settings.tokenAction = 'url';
    //janrain.settings.capture.registerFlow = 'socialMobileRegistration'



    // --- Federate ------------------------------------------------------------
    janrain.settings.capture.federate = true;
    janrain.settings.capture.federateServer = 'https://american-institute-of-architects-dev.us.janrainsso.com';
    janrain.settings.capture.federateXdReceiver = 'http://aia.dev.cardstack.com/federateXdReceiver.html';
    janrain.settings.capture.federateLogoutUri = 'http://aia.dev.cardstack.com/blank.html';
    janrain.settings.capture.federateLogoutCallback = function() {};



    // --- Backplane -----------------------------------------------------------
    //*PLEX*/ janrain.settings.capture.backplane = true;
    //*PLEX*/ janrain.settings.capture.backplaneBusName = '';
    //*PLEX*/ janrain.settings.capture.backplaneVersion = 1.2;
    //janrain.settings.capture.backplaneBlock = 20;


    // --- BEGIN WIDGET INJECTION CODE -----------------------------------------
    /********* WARNING: *******************************************************\
    |      DO NOT EDIT THIS SECTION                                            |
    | This code injects the Capture Widget. Modifying this code can cause the  |
    | Widget to load incorrectly or not at all.                                |
    \**************************************************************************/

    function isReady() {
        janrain.ready = true;
    }
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", isReady, false);
    } else {
        window.attachEvent('onload', isReady);
    }

    var injector = document.createElement('script');
    injector.type = 'text/javascript';
    injector.id = 'janrainAuthWidget';
    if (document.location.protocol === 'https:') {
        injector.src = httpsLoadUrl;
    } else {
        injector.src = httpLoadUrl;
    }
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(injector, firstScript);

    // --- END WIDGET INJECTION CODE -------------------------------------------

})();



// This function is called by the Capture Widget when it has completred loading
// itself and all other dependencies. This function is required, and must call
// janrain.capture.ui.start() for the Widget to initialize correctly.
function janrainCaptureWidgetOnLoad() {
    var implFuncs = janrainExampleImplementationFunctions(); // Located below.

    /*==== CUSTOM ONLOAD CODE START ==========================================*\
    ||  Any javascript that needs to be run before screens are rendered but   ||
    ||  after the Widget is loaded should go between this comment and "CUSTOM ||
    ||  ONLOAD CODE END" below.                                               ||
    \*                                                                        */

    /*--
        SCREEN TO RENDER:
        This setting defines which screen to render. We've set it to the result
        of implFuncs.getParameterByName() so that if you pass in a parameter
        in your URL called 'screenToRender' and provide a valid screen name,
        that screen will be shown when the Widget loads.
                                                                            --*/
    // janrain.settings.capture.screenToRender = implFuncs.getParameterByName('screenToRender');

    /*--
        EVENT HANDLING:

        Event Documentation:
        http://developers.janrain.com/reference/javascript-api/registration-js-api/events/
    --*/
    janrain.events.onCaptureScreenShow.addHandler(implFuncs.enhanceReturnExperience);
    janrain.events.onCaptureSaveSuccess.addHandler(implFuncs.hideResendLink);

    /*--
        NAVIGATION EVENTS:
        These event handlers are used for navigating the example implementation
        that exists on our servers for testing/demo/sample purposes. It is not
        required for your implementation, but can be modified to suit your
        needs. These event handlers are provided as an example.
                                                                            --*/
    janrain.events.onCaptureLoginSuccess.addHandler(implFuncs.setNavigationForLoggedInUser);
    janrain.events.onCaptureSessionFound.addHandler(implFuncs.setNavigationForLoggedInUser);
    janrain.events.onCaptureRegistrationSuccess.addHandler(implFuncs.setNavigationForLoggedInUser);
    // janrain.events.onCaptureSessionEnded.addHandler(implFuncs.setNavigationForLoggedOutUser);
    janrain.events.onCaptureLoginFailed.addHandler(implFuncs.handleDeactivatedAccountLogin);
    janrain.events.onCaptureAccountDeactivateSuccess.addHandler(implFuncs.handleAccountDeactivation);

    /*--
        SHOW EVENTS:
        This function will log Janrain events in your browser's console. You must                                                 |          Uncomment this line to show events in your browser's console. You must
        include janrain-utils.js to run this function. Comment this line to hide                                                  |          include janrain-utils.js to run this function.
        event logging.
                                                                            --*/
    janrainUtilityFunctions().showEvents();


    /*                                                                        *\
    || *** CUSTOM ONLOAD CODE END ***                                         ||
    \*========================================================================*/

    // This should be the last line in janrainCaptureWidgetOnLoad()
    janrain.capture.ui.start();
}


// Reference implementation navigation.
function janrainExampleImplementationFunctions() {
    function setNavigationForLoggedInUser(result) {
        janrain.capture.ui.modal.close();
        // document.getElementById("captureSignInLink").style.display  = 'none';
        // document.getElementById("captureSignOutLink").style.display = '';
        // document.getElementById("captureProfileLink").style.display = '';
    }
    function setNavigationForLoggedOutUser(result) {
        document.getElementById("captureSignInLink").style.display  = '';
        document.getElementById("captureSignOutLink").style.display = 'none';
        document.getElementById("captureProfileLink").style.display = 'none';
        document.getElementById("editProfile").style.display = 'none';
    }
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    function enhanceReturnExperience(result) {
        if (result.screen == "returnTraditional") {
            var span = document.getElementById('traditionalWelcomeName');
            var name = janrain.capture.ui.getReturnExperienceData("displayName");
            if (span && name) {
                span.innerHTML = "Welcome back, " + name + "!";
            }
        }
    }
    function hideResendLink(result) {
        // Hide the 'Resend confirmation email' link if it's been clicked
        // from the edit profile page. Link will reappear if the user
        // refreshes their profile page.
        if(result.controlName == "resendVerificationEmail" &&
           result.screen == "editProfile") {
            document.getElementById("capture_editProfile_resendLink").style.display = 'none';
        }
    }
    function handleDeactivatedAccountLogin(result) {
        if (result.statusMessage == "accountDeactivated") {
            janrain.capture.ui.renderScreen('accountDeactivated');
        }
    }
    function handleAccountDeactivation(result) {
        if(result.status == "success") {
            document.getElementById("editProfile").style.display = 'none';
            janrain.capture.ui.modal.close();
            janrain.capture.ui.endCaptureSession();
            janrain.capture.ui.renderScreen('accountDeactivated');
        }
    }
    function handleAccountReactivationSuccess(result) {
        if(result.status == "success") {
            janrain.capture.ui.renderScreen('reactivateAccountSuccess');
        }
    }
    function handleAccountReactivationFailed(result) {
        if(result.status == "error") {
            janrain.capture.ui.renderScreen('reactivateAccount');
        }
    }
    function passwordValidation(name, value) {
        return /{{ CUSTOM_PASSWORD_REGEX }}/.test(value);
    }
    function showFlowVersion(elementId, result) {
        var elem = document.getElementById(elementId);
        elem.innerText = "Flow version: " + result.version;
    }
    return {
        setNavigationForLoggedInUser: setNavigationForLoggedInUser,
        setNavigationForLoggedOutUser: setNavigationForLoggedOutUser,
        getParameterByName: getParameterByName,
        enhanceReturnExperience: enhanceReturnExperience,
        hideResendLink: hideResendLink,
        handleDeactivatedAccountLogin: handleDeactivatedAccountLogin,
        handleAccountDeactivation: handleAccountDeactivation,
        handleAccountReactivationSuccess: handleAccountReactivationSuccess,
        handleAccountReactivationFailed: handleAccountReactivationFailed,
        showFlowVersion: showFlowVersion,
        passwordValidation: passwordValidation
    };
}
