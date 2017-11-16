Page({
    bindCanvas: function () {
        wx.navigateTo({ url: '../canvas/canvas' })
    },

    bindTouchMove: function () {
        wx.navigateTo({ url: '../swiper/swiper' })
    }
});