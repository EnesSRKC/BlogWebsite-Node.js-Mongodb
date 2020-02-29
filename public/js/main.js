$(window).scroll(function() {
    if ($(document).scrollTop() > 50) {
        $('#mainNav').addClass('shrink');
    }
    else {
        $('#mainNav').removeClass('shrink');
    }
});

$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
  items: 1,
  loop: true,
  autoplay:true,
  smartSpeed: 300
  });
});