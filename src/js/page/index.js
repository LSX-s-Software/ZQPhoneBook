$(document).ready(function () {
    //-----------Initialize Swpier--------------
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        speed: 750,
        autoplay: {
            delay: 9000,
            disableOnInteraction: false
        },
    });
    mySwiper.autoplay.start();
    //-----------LoginBtn Click--------------
    $("#login").click(function (e) { 
        e.preventDefault();
        mySwiper.autoplay.stop();
        $("#login").fadeOut();
        $(".logo").fadeOut(500, function () {
            $(".swiper-slide img").css({"animation": "blur 0.6s 1", "animationFillMode": "forwards"});
            $(".login").fadeIn(600);
        });
    });
    var myVue = new Vue({
        el: ".login",
        data: {
            pageType: 0,
            userName: "",
            password: "",
            password2: ""
        },
        methods: {
            submit: function () { 
                window.location.href = "main.html"
            }
        }
    });
});