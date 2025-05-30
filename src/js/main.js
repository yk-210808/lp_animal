(function ($) {
  'use strict';

  // PC/SP判定
  // スクロールイベント
  // リサイズイベント
  // スムーズスクロール

  /* ここから */
  var break_point = 640; //ブレイクポイント
  var mql = window.matchMedia('screen and (max-width: ' + break_point + 'px)'); //、MediaQueryListの生成
  var deviceFlag = mql.matches ? 1 : 0; // 0 : PC ,  1 : SP

  // pagetop
  var timer = null;
  var $pageTop = $('#pagetop');
  $pageTop.hide();

  // スクロールイベント
  $(window).on('scroll touchmove', function () {

    // スクロール中か判定
    if (timer !== false) {
      clearTimeout(timer);
    }

    // 200ms後にフェードイン
    timer = setTimeout(function () {
      if ($(this).scrollTop() > 100) {
        $('#pagetop').fadeIn('normal');
      } else {
        $pageTop.fadeOut();
      }
    }, 200);

    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    var footHeight = parseInt($('#footer').innerHeight());


    if (deviceFlag == 0) { // → PC
      if (scrollHeight - scrollPosition <= footHeight) {
        // 現在の下から位置が、フッターの高さの位置にはいったら
        $pageTop.css({
          'position': 'absolute',
          'bottom': footHeight
        });
      }
    } else { // → SP
      $pageTop.css({
        'position': 'fixed',
        'bottom': '20px'
      });
    }

  });


  // リサイズイベント

  var checkBreakPoint = function (mql) {
    deviceFlag = mql.matches ? 1 : 0; // 0 : PC ,  1 : SP
    // → PC
    if (deviceFlag == 0) {
      headerMenuClose();
    } else {
      // →SP
    }
    deviceFlag = mql.matches;
  }

  // ブレイクポイントの瞬間に発火
  mql.addListener(checkBreakPoint); //MediaQueryListのchangeイベントに登録

  // 初回チェック
  checkBreakPoint(mql);


  // スムーズスクロール
  // #で始まるアンカーをクリックした場合にスムーススクロール
  $('a[href^="#"]').on('click', function (e) {
    var speed = 500;
    // アンカーの値取得
    var href = $(this).attr('href');
    // 移動先を取得
    var target = $(href == '#' || href == '' ? 'html' : href);
    // 移動先を数値で取得
    var position = target.offset().top;

    // スムーススクロール lazyload対策で実際には２回スムーススクロール実行
    $.when(
      $("html, body").animate({
        scrollTop: position
      }, 400, "swing"),
      e.preventDefault(),
    ).done(function () {
      var diff = target.offset().top;
      if (diff === position) {} else {
        $("html, body").animate({
          scrollTop: diff
        }, 10, "swing");
      }
    });

    return false;
  });

  /**
   * Functions
   */
  // scroll control
  var isScrollable = true;
  var winScroll;
  var getScrollPos = function () {
    if (!isScrollable) {
      return;
    }
    winScroll = window.scrollY || window.pageYOffset;
  }
  $(window).on('scroll', function () {
    getScrollPos();
  });
  getScrollPos();

  function scrollOff() {
    $('body').css({
      'cssText': 'position : fixed; top : ' + (-winScroll) + 'px !important; width: 100%;'
    });
    isScrollable = false;
  };

  function scrollOn() {
    $('body').css({
      'position': '',
      'top': ''
    });
    window.scrollTo(0, winScroll);
    isScrollable = true;
  };

  // headerMenu
  function headerMenuOpen() {
    $('.js--headerMenuTrigger').addClass('is_active');
    scrollOff();
  }

  function headerMenuClose() {
    $('.js--headerMenuTrigger').removeClass('is_active');
    scrollOn();
  }

  /**
   * Events
   */
  $(function () {
    /**
     * サムネイルクリックで動画再生
     */
    if ($('.js--videoPlayTrigger')[0]) {
      $('.js--videoPlayTrigger').on('click', function () {
        const $this = $(this);
        const $video = $this.siblings('video');

        if ($video[0].paused) {
          $video[0].play();
        } else {
          $video[0].pause();
        }
      });
    }

    /**
     * ヘッダーメニューのトグル
     */
    if ($('.js--headerMenuTrigger')[0]) {
      $('.js--headerMenuTrigger').on('click', function () {
        const $this = $(this);

        if ($this.hasClass('is_active')) {
          headerMenuClose();
        } else {
          headerMenuOpen();
        }
      });
    }
  });



})(jQuery);