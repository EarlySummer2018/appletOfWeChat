import {request} from "../../request/index.js"
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    catesList: [],
    floorList: []
  },
  //页面开始加载就会触发
  onLoad: function(options){
    // let {swiperList} = this.data;
    // console.log(swiperList);
    // swiperList.forEach(v => {
    //  v.navigator_url.replace(/main/, 'index');
    // });
    // console.log(swiperArr);
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  // 获取轮播图数据
  getSwiperList() {
    request({url:"/home/swiperdata"})
    .then(result => {
      let swiperList = result.data.message;
      swiperList.forEach(ele => {
        let url = ele.navigator_url.replace(/main/, 'index');
        ele.navigator_url = url
      });
      this.setData({
        swiperList
      })
    })
  },

  // 获取分类导航数据
  getCateList() {
    request({url:"/home/catitems"})
    .then(result => {
      this.setData({
        catesList:result.data.message
      })
    })
  },

  // 获取楼层数据
  getFloorList() {
    request({url:"/home/floordata"})
    .then(result => {
      let floorList = result.data.message;
      floorList.forEach(v=> {
        v.product_list.forEach(a=> {
          let url = a.navigator_url.replace(/\?/, '/index?');
          a.navigator_url = url;
        })
      })
      console.log(floorList);
      this.setData({
        floorList
      })
    })
  },
 
});