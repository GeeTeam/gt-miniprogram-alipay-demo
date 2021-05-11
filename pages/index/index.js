Page({
    data: {
    },
    onLoad: function() {
    },
    onReady: function(){
    },
    toSlide:function(){
      console.log(111);
        tt.navigateTo({
            url: '/pages/slideDemo/slide',
        })
    },
    toClick: function () {
        tt.navigateTo({
            url: '/pages/clickDemo/click',
        })
    },
    toBind: function () {
        tt.navigateTo({
            url: '/pages/bindDemo/bindDemo',
        })
    }
})
