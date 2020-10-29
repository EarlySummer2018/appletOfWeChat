import {request} from '../../request/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 左侧的菜单数据
    leftMenuList: [],

    // 右侧的商品数据
    rightContent: [],

    // 被选中后的样式
    currentIndex: 0,

    scrollTop:0
  },
  // 接口的放回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const Cates = wx.getStorageSync("cates");
    if(!Cates) {
      this.getCates();
    }else {
      if (Date.now()-Cates.time>10000) {
        this.getCates();
        
      }else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        // console.log(this.Cates);
        // 构造右侧的内容数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
  },

  // 获取分类数据
  getCates() {
    request({url:"/categories"})
    .then(result => {
        this.Cates = result.data.message;
        wx.setStorageSync("cates", {time:Date.now(), data:this.Cates});
          
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        // console.log(this.Cates);
        // 构造右侧的内容数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
    })
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e);
    const {index}=e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }
})