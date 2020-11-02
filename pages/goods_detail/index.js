import {request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect: false
  },

  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    let option = currentPage.options;
    const {goods_id} = option;
    this.getGoodsInfo(goods_id)
  },

  // 获取商品详情数据
  getGoodsInfo(goods_id) {
    request({url:"/goods/detail", data:{goods_id}})
    .then(result => {
      // console.log(result);
      this.GoodsInfo = result.data.message;
      // console.log(this.GoodsInfo);
       // 获取缓存中的都商品收藏数组
      let collect = wx.getStorageSync("collect")||[];
      let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)
      this.setData({
        goodsObj:{
          goods_name:result.data.message.goods_name,
          goods_price:result.data.message.goods_price,
          goods_introduce:result.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
          pics:result.data.message.pics
        },
        isCollect
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
  },

  // 点击加入购物车
  handleCartAdd() {
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    // console.log(this.GoodsInfo);
    // 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    }else {
      cart[index].num++
    }
    wx.setStorageSync("cart", cart);
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        mask: true
      })
  },

  // 点击收藏
  handleCollect() {
    // 获取缓存中的都商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    let isCollect = this.data.isCollect;
    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏',
        icon: 'none',
        mask: true
      })
    }else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '添加收藏',
        icon: 'none',
        mask: true
      })
    }

    // 最后把数组存到数组中
    wx.setStorageSync("collect", collect);
    
    // 修改data中的数据
    this.setData({
      isCollect
    })
  }
})