import util from '../../utils/util'

const app = getApp();

Page({
    data: {
        windowWidth: 0,
        windowHeight: 0,
        contentHeight: 0,
        thinkList: [],
        footer: '',
        offset: 0,
        lineHeight: 30,
        content: '王小波的黄金时代有一片紫色的天空，天上飘着懒洋洋的云，他有好多奢望，想爱，想吃，想和陈清扬敦伟大的友谊。'
    },

    onLoad: function (options) {
        let that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                    offset: (res.windowWidth - 300) / 2
                });
            }
        });
    },

    onShow: function () {
        this.getData()
    },

    getData: function () {
        let that = this;

        let i = 0;
        let lineNum = 1;
        let thinkStr = '';
        let thinkList = [];
        for (let item of that.data.content) {
            if (item === '\n') {
                thinkList.push(thinkStr);
                thinkList.push('a');
                i = 0;
                thinkStr = '';
                lineNum += 1;
            } else if (i === 19) {
                thinkList.push(thinkStr);
                i = 1;
                thinkStr = item;
                lineNum += 1;
            } else {
                thinkStr += item;
                i += 1;
            }
        }
        thinkList.push(thinkStr);
        that.setData({ thinkList: thinkList });
        that.createNewImg(lineNum);
    },

    drawSquare: function (ctx, height) {
        ctx.rect(0, 50, this.data.windowWidth, height);
        ctx.setFillStyle("#f5f6fd");
        ctx.fill()
    },

    drawFont: function (ctx, content, height) {
        ctx.setFontSize(16);
        ctx.setFillStyle("#484a3d");
        ctx.fillText(content, this.data.offset, height);
    },

    drawLine: function (ctx, height) {
        ctx.beginPath();
        ctx.moveTo(this.data.offset, height);
        ctx.lineTo(this.data.windowWidth - this.data.offset, height);
        ctx.stroke('#eee');
        ctx.closePath();
    },

    createNewImg: function (lineNum) {
        let that = this;
        let ctx = wx.createCanvasContext('myCanvas');
        let contentHeight = lineNum * that.data.lineHeight + 180;
        that.drawSquare(ctx, contentHeight);
        that.setData({ contentHeight: contentHeight });
        let height = 100;
        for (let item of that.data.thinkList) {
            if (item !== 'a') {
                that.drawFont(ctx, item, height);
                height += that.data.lineHeight;
            }
        }
        that.drawLine(ctx, lineNum * that.data.lineHeight + 120);
        that.drawFont(ctx, that.data.footer, lineNum * that.data.lineHeight + 156);
        ctx.drawImage('../../static/images/think.png', that.data.windowWidth - that.data.offset - 50, lineNum * that.data.lineHeight + 125, 50, 50);
        ctx.draw();
    },

    savePic: function () {
        let that = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 50,
            width: that.data.windowWidth,
            height: that.data.contentHeight,
            canvasId: 'myCanvas',
            success: function (res) {
                util.savePicToAlbum(res.tempFilePath)
            }
        })
    }
});