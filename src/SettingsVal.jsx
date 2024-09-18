
export let settingsVal={
    showBackground:!false,
    blur:!false,
    animateBackground:!false,
    showBanners:!false,
    showPreviewImage:!false,
    scrollAnimations:!false
}
if(!settingsVal.showBackground){
    document.getElementById("backgroundImage").style.opacity=0
}