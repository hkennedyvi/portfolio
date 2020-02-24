$(document).ready(function () {
    $("#my-spinner").fadeOut(2000, () => {
        $(".card").fadeIn();
    });
});