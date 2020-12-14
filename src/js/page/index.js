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
    mySwiper.slideToLoop(Math.floor(Math.random() * 3), 0);
    mySwiper.autoplay.start();
    //-----------LoginBtn Click--------------
    $("#login").click(function (e) {
        e.preventDefault();
        mySwiper.autoplay.stop();
        $("#login").fadeOut(500, function () {
            $(".swiper-slide img").css({ "animation": "blur 0.6s 1", "animationFillMode": "forwards" });
            $(".login").fadeIn(600);
        });
    });
    var myVue = new Vue({
        el: ".login",
        data: {
            pageType: 0,
            userName: "",
            password: "",
            password2: "",
            usernameWarning: false
        },
        methods: {
            submit: function () {
                var that = this;
                window.location.href = "main.html";
                return;
                $.ajax({
                    type: "POST",
                    url: this.pageType == 0 ? "/login" : "/register",
                    data: {
                        username: this.userName,
                        password: this.password
                    },
                    success: function (response) {
                        if (that.pageType == 0) {
                            switch (response.result) {
                                case "success":
                                    localStorage.setItem("Token", response.Token);
                                    window.location.href = "main.html"
                                    break;
                                case "username":
                                    alert("用户不存在");
                                    break;
                                case "password":
                                    alert("密码错误");
                                    break;
                                default:
                                    alert(response.result);
                                    break;
                            }
                        } else {
                            switch (response.result) {
                                case "success":
                                    alert("注册成功");
                                    localStorage.setItem("Token", response.Token);
                                    window.location.href = "me.html?from=register&email=" + that.userName;
                                    break;
                                default:
                                    alert(response.result);
                                    break;
                            }
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        alert(textStatus + ":" + jqXHR.statusText + " " + errorThrown);
                    }
                });
            },
            check: function () {
                return;
                if (this.pageType == 0 || this.userName == "") return
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "/register/check",
                    data: {
                        username: that.userName
                    },
                    success: function (response) {
                        switch (response.result) {
                            case "userNotExist":
                                console.log("用户不存在");
                                that.usernameWarning = false
                                break;
                            case "userExisted":
                                console.log("用户已存在");
                                that.usernameWarning = true
                                break;
                            default:
                                console.log(response.result);
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                    }
                });
            }
        }
    });
});