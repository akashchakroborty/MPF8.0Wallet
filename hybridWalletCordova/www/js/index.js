
function wlCommonInit(){

        console.log('---> wlCommonInit called');
        var wlevent = new CustomEvent('MFPinit');
        console.log('---> dispatching MFPinit event');
        document.dispatchEvent(wlevent);

}