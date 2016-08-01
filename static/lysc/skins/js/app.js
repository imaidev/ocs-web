/**
 * Created by Administrator on 2016/2/18.
 */
    /*        $(window).on("scroll",function(){
     var animations,
     name,
     winHeight=$(window).height(),
     scrollTop=$(window).scrollTop();

     animations=animateBlock.animations;

     for(name in animations){
     animations[name](winHeight,scrollTop);
     }
     });

     var animateBlock = {
     isVisiable: function(el,wh,st){
     console.log(el.offset().top,wh+st-300);
     return el.offset().top<wh+st-300;
     },
     animations: {
     intro1: function(wh,st){
     var $el=$("#intro1");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro1-cloud1").delay(333).animate({opacity:1},555);
     $el.find(".intro1-cloud2").delay(999).animate({opacity:1},555);
     $el.find(".intro1-cloud3").delay(666).animate({opacity:1},666);
     $el.find(".intro1-cloud4").delay(555).animate({opacity:1},444);
     delete animateBlock.animations.intro1;
     }
     },
     intro2: function(wh,st){
     var $el=$("#intro2");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro2-computer").delay(333).animate({opacity:1},888);
     $el.find(".intro2-filter").delay(555).animate({"top":330,opacity:1},666);
     delete animateBlock.animations.intro2;
     }
     },
     intro3_1: function(wh,st){
     var $el=$("#intro3-1");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro3_pop").delay(555).animate({"top":38,opacity:1},555);
     delete animateBlock.animations.intro3_1;
     }
     }
     ,
     intro3_2: function(wh,st){
     var $el=$("#intro3-2");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro3_item_1").delay(333).animate({opacity:1},444);
     $el.find(".intro3_item_2").delay(444).animate({opacity:1},444);
     $el.find(".intro3_item_3").delay(555).animate({opacity:1},444);
     $el.find(".intro3_item_4").delay(666).animate({opacity:1},444);
     $el.find(".intro3_item_5").delay(777).animate({opacity:1},444);
     $el.find(".intro3_item_6").delay(888).animate({opacity:1},444);
     $el.find(".intro3_item_7").delay(999).animate({opacity:1},444);
     delete animateBlock.animations.intro3_2;
     }
     },
     intro3_3: function(wh,st){
     var $el=$("#intro3-3");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro3_li2").delay(555).animate({"top":154},666);
     $el.find(".intro3_li3").delay(555).animate({"top":308},666);
     delete animateBlock.animations.intro3_3;
     }
     },
     intro4_1: function(wh,st){
     var $el=$("#intro4-1");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro4_banner1").delay(333).animate({"top":0,opacity:1},666);
     delete animateBlock.animations.intro4_1;
     }
     },
     intro4_2: function(wh,st){
     var $el=$("#intro4-2");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro4_banner2").delay(333).animate({"top":0,opacity:1},666);
     delete animateBlock.animations.intro4_2;
     }
     },
     intro5: function(wh,st){
     var $el=$("#intro5");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro5_banner_hand_l").delay(444).animate({"top":10,"left":18},444);
     $el.find(".intro5_banner_hand_r").delay(444).animate({"top":65,"left":355},444);
     delete animateBlock.animations.intro5;
     }
     },
     intro6: function(wh,st){
     var $el=$("#intro6");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro6_banner1").delay(200).animate({"top":160,opacity:1},666);
     $el.find(".intro6_banner2").delay(444).animate({"top":160,opacity:1},666);
     $el.find(".intro6_banner3").delay(666).animate({"top":160,opacity:1},666);
     delete animateBlock.animations.intro6;
     }
     },
     intro7: function(wh,st){
     var $el=$("#intro7");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro7_cart").delay(333).animate({"left":-10,opacity:1},666);
     $el.find(".intro7_text").delay(999).animate({opacity:1},333);
     delete animateBlock.animations.intro7;
     }
     }
     ,
     intro8: function(wh,st){
     var $el=$("#intro8");
     if(animateBlock.isVisiable($el,wh,st)){
     $el.find(".intro8_light_l").delay(333).animate({"left":0,opacity:1},555);
     $el.find(".intro8_light_r").delay(333).animate({"left":106,opacity:1},555);
     delete animateBlock.animations.intro8;
     }
     }
     }
     }

     if($(window).height()>500){
     $(window).trigger("scroll");
     }*/
$(function(){
    var isIE = navigator.appName=="Microsoft Internet Explorer";
    $('#fullpage').fullpage({
        anchors: ['page1','page2','page3','page4','page5','page6','page7','page8','page9','page10','page11'],
        'css3': true,
        menu: '#menu',
        sectionsColor: ['#2EB9B6', '#FFFFFF', '#FDF6E1', '#AFE3EE', '#F3F3F3', '#AFE3EE', '#F9F3DC','#C2E5FF','#E9E9E9','#FFF','#F8F8F8'],
        afterLoad: function(anchorLink, index){
            if(index==1){
                $(".intro1-earth div").each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).delay($arr[2]).animate({left: $arr[0],},400);
                });
            }else if(index==2){
                $(".intro2-computer").animate({opacity:1},400);
                $(".intro2-filter").delay(400).animate({opacity:1,top: 325},400);
            }
            else if(index==3){
                $(".intro3_pop").animate({opacity:1,top: -10},400)
            }
            else if(index==4){
                $(".intro4_item").removeClass("intro4_item_s");
            }
            else if(index==5){
                $(".intro5_li_wrap .intro5_li").each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).delay(100).animate({top: $arr[1]+'px'},300);
                    $(this).delay(200).animate({top: $arr[2]+'px'},300);
                })
            }
            else if(index==6){
                $(".intro6_other").each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).delay($arr[0]).animate({opacity: 1},400);
                });
            }
            else if(index==7){
                $(".intro7_icon").each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).delay($arr[0]).animate({opacity:1},300);
                })
            }
            else if(index==8){
                $(".intro8_hand").each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).delay($arr[2]-100).animate({left: $arr[0]+'px',opacity:1}, 300);
                })
            }
            else if(index==9){
                $(".intro9_banner").each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).delay($arr[2]).animate({top: $arr[0]+'px',opacity:1}, 300);
                })
            }
            else if(index==10){
                $(".intro10_cart").animate({left: 0,opacity:1}, 300);
                $(".intro10_text").delay(300).animate({opacity:1}, 300);
            }
            else if(index==11){
                $(".intro11_icon1").removeClass("intro11_icon1_s");
                $(".intro11_icon2").removeClass("intro11_icon2_s");
                $(".intro11_icon3").removeClass("intro11_icon3_s");
                $(".intro11_icon4").removeClass("intro11_icon4_s");
                $(".intro11_icon5").removeClass("intro11_icon5_s");
                $(".intro11_icon6").removeClass("intro11_icon6_s");
            }
        },
        onLeave: function(index){
            if(index==1){
                $(".intro1-earth div").stop(true).each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).animate({left:$arr[1]+'px'},300);
                });
            }
            else if(index==2){
                $(".intro2-computer").stop(true).animate({opacity:0}, 300);
                $(".intro2-filter").stop(true).animate({top:355, opacity: 0}, 200);
            }
            else if(index==3){
                $(".intro3_pop").stop(true).animate({ opacity: 0,top: 30},200);
            }
            else if(index==4){
                if(isIE){return;}
                $(".intro4_item").addClass("intro4_item_s");
            }
            else if(index==5){
                $(".intro5_li_wrap .intro5_li").stop(true).each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).animate({top: $arr[0]+'px'},300);
                })
            }
            else if(index==6){
                $(".intro6_other").stop(true).each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).delay($arr[0]).animate({opacity: 0},300);
                });
            }
            else if(index==7){
                $(".intro7_icon").each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).delay($arr[0]).animate({opacity:0},200);
                })
            }
            else if(index==8){
                $(".intro8_hand").stop(true).each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).delay($arr[2]).animate({left: $arr[1]+'px',opacity:0}, 300);
                })
            }
            else if(index==9){
                $(".intro9_banner").stop(true).each(function(){
                    var $rel = $(this).attr('rel');
                    var $arr = $rel.split(',');
                    $(this).animate({top: $arr[1],opacity:0}, 300);
                })
            }
            else if(index==10){
                $(".intro10_cart").animate({left: -145,opacity:0}, 300);
                $(".intro10_text").animate({opacity:0}, 300);
            }
            else if(index==11){
                $(".intro11_icon1").addClass("intro11_icon1_s");
                $(".intro11_icon2").addClass("intro11_icon2_s");
                $(".intro11_icon3").addClass("intro11_icon3_s");
                $(".intro11_icon4").addClass("intro11_icon4_s");
                $(".intro11_icon5").addClass("intro11_icon5_s");
                $(".intro11_icon6").addClass("intro11_icon6_s");
            }
        },
        afterRender: function(){
            //page1
            $(".intro1-earth div").each(function(){
                var $rel = $(this).attr('rel');
                var $arr = $rel.split(',');
                $(this).css({left: $arr[1]+'px'});
            });
            //page2
            $(".intro2-computer").css({opacity:0});
            $(".intro2-filter").css({top:355, opacity: 0});
            //page3
            $(".intro3_pop").css({ opacity: 0,top: 30});
            //page4
            if(!isIE){
                $(".intro4_item").addClass("intro4_item_s");
            }
            //page5
            $(".intro5_li_wrap .intro5_li").each(function(){
                var $rel = $(this).attr('rel');
                var $arr = $rel.split(',');
                $(this).css({top: $arr[0]+'px'});
            })
            //page6
            $(".intro6_other").each(function(){
                $(this).css({opacity: 0});
            });
            //page7
            $(".intro7_icon").each(function(){
                $(this).css({opacity:0});
            })
            //page8
            $(".intro8_hand").each(function(){
                var $rel = $(this).attr('rel');
                var $arr = $rel.split(',');
                $(this).css({left: $arr[1]+'px',opacity:0});
            })
            //page9
            $(".intro9_banner").each(function(){
                var $rel = $(this).attr('rel');
                var $arr = $rel.split(',');
                $(this).css({top: $arr[1]+'px',opacity:0});
            })
            //page10
            $(".intro10_cart").css({left: -145,opacity:0});
            $(".intro10_text").css({opacity:0});
            //page11
            $(".intro11_icon1").addClass("intro11_icon1_s");
            $(".intro11_icon2").addClass("intro11_icon2_s");
            $(".intro11_icon3").addClass("intro11_icon3_s");
            $(".intro11_icon4").addClass("intro11_icon4_s");
            $(".intro11_icon5").addClass("intro11_icon5_s");
            $(".intro11_icon6").addClass("intro11_icon6_s");
        }
    })
});