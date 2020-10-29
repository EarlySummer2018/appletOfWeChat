import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },

  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options
    this.getGoodsInfo(goods_id)
  },

  // 获取商品详情数据
  getGoodsInfo(goods_id) {
    request({url:"/goods/detail", data:{goods_id}})
    .then(result => {
      // console.log(result);
      this.GoodsInfo = result.data.message
      this.setData({
        goodsObj:{
          goods_name:result.data.message.goods_name,
          goods_price:result.data.message.goods_price,
          goods_introduce:result.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
          pics:result.data.message.pics
        }
      })
    })
  },

  // 点击轮播图放大预览
  handlePrevewImage(e) {

    // 写构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 接收传递过来的图片 url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  }
})