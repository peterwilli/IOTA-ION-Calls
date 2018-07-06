<template lang="html">
  <div>
    <nav class="navbar navbar-default bootsnav navbar-fixed white no-background">
      <div class="container">
        <!-- Start Header Navigation -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu">
                           <i class="fa fa-bars"></i>
                       </button>
          <a class="navbar-brand" href="#brand">
                           <img src="@/assets/logo.png" width="50px" class="logo logo-display" alt="">
                           <img src="@/assets/color-logo.png" width="50px" class="logo logo-scrolled" alt="">
                       </a>

        </div>
        <!-- End Header Navigation -->

        <!-- navbar menu -->
        <div class="collapse navbar-collapse" id="navbar-menu">
          <ul class="nav navbar-nav navbar-center">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
          </ul>
        </div>
        <!-- /.navbar-collapse -->
      </div>
    </nav>
    <section id="home" class="home">
      <div class="container">
        <div class="row">
          <div class="main_home">
            <div class="col-md-6">
              <div class="home_text">
                <h1 class="text-white">Resillient, 100% free video calls</h1>
                <p class="text-white">
                  ION Calls leverages IOTA and ION to deliver decentralized video conversations all over the world, with a 100% uptime guarantee.
                </p>
                <p class="text-white">
                  Want to make something else? We have a <a href="https://github.com/peterwilli/iota-ion.lib.js">library for the devs</a> :)
                </p>
              </div>

              <div class="home_btns m-top-40">
                <button class="btn-hover color-5" @click="newCall()">
                  New conversation
                </button>
              </div>
            </div>

            <div class="col-md-6">
              <div class="phone_one phone_attr1 text-center sm-m-top-50">
                <div class="attr_deg">Chat</div>
                <div class="attr_rio">Games</div>
                <div class="attr_sun text-white">Streaming</div>
                <div class="attr_lon text-white">Video</div>
                <img src="images/phone01.png" alt="" />
              </div>
            </div>

          </div>
          <div class="scrooldown">
            <a href="#features"><i class="fa fa-chevron-down"></i></a>
          </div>

        </div>
        <!--End off row-->
      </div>
      <!--End off container -->
    </section>
    <!--Featured Section-->
          <section id="features" class="features">
              <div class="container">
                  <div class="row">
                      <div class="main_features p-top-100">
                          <div class="col-md-8 col-md-offset-2 col-sm-12 col-xs-12">
                              <div class="head_title text-center">
                                  <h2>Features</h2>
                              </div>
                          </div>

                          <div class="col-md-4">
                              <div class="features_item sm-m-top-30">
                                  <div class="f_item_icon">
                                      <i class="icon icon-diamond6"></i>
                                  </div>
                                  <div class="f_item_text">
                                      <h3>Made to last</h3>
                                      <p>ION is a fast data-transfer-protocol built on top of the IOTA Tangle. Any working IOTA node will be able to set up a connection between 2 people (or machines!)</p>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-4">
                              <div class="features_item sm-m-top-30">
                                  <div class="f_item_icon">
                                      <i class="icon icon-cute"></i>
                                  </div>
                                  <div class="f_item_text">
                                      <h3>Privacy Friendly</h3>
                                      <p>ION won't steal your data (it can't! even if it wanted to). All transfer is end-to-end encrypted. ION will remain truly, 100% free, since there's no need to host anything besides a IOTA node and this (static) webpage.</p>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-4">
                              <div class="features_item sm-m-top-30">
                                  <div class="f_item_icon">
                                      <i class="icon icon-human57"></i>
                                  </div>
                                  <div class="f_item_text">
                                      <h3>Unlimited Possibilities</h3>
                                      <p>While the ION homepage allows video calls, ION can do a lot more than that! Imagine video-streaming, multiplayer games, or CCTV surveillance.</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div><!-- End off row -->
              </div><!-- End off container -->
          </section><!-- End off Featured Section-->
          <br />
          <footer id="footer" class="footer bg-black">
              <div class="container">
                  <div class="row">
                      <div class="col-md-12">
                          <div class="main_footer text-center p-top-40 p-bottom-30">
                              <p class="wow fadeInRight" data-wow-duration="1s">
                                  Made with
                                  <i class="fa fa-heart"></i>
                                  in the Netherlands by Peter Willemsen
                              </p>
                              Theme by <a target="_blank" href="http://bootstrapthemes.co">Bootstrap Themes</a>
                          </div>
                      </div>
                  </div>
              </div>
          </footer>
          <!-- scroll up-->
          <div class="scrollup">
            <a href="#"><i class="fa fa-chevron-up"></i></a>
          </div>
          <!-- End off scroll up -->
  </div>
</template>

<script>
import tryteGen from '@/utils/tryteGen.js'
const nanoid = require('nanoid')

export default {
  name: 'home',
  methods: {
    mounted() {
      $('#navbar-menu').find('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: (target.offset().top - 80)
            }, 1000);
            if ($('.navbar-toggle').css('display') != 'none') {
              $(this).parents('.container').find(".navbar-toggle").trigger("click");
            }
            return false;
          }
        }
      });
    },
    newCall() {
      var seed = nanoid(16)
      this.$router.push({
        name: 'call',
        params: {
          seed
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
