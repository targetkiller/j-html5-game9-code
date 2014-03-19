/*
* @author:谭照强
* @project:SnailBait Game
* @content:动画转换器，基于stopwatch.js的扩展
*/

/*
* －－－参数表－－－
* para:duration:持续时间，默认1000
* para:transducer:变换器
*/
AnimationTimer = function (duration, transducer)  {
   this.transducer = transducer;

   if (duration !== undefined) this.duration = duration;
   else                        this.duration = 1000;

   this.stopwatch = new Stopwatch();
};

// 扩展stopwatch.js的方法，加入两个新方法
AnimationTimer.prototype = {
              stop: function () { this.stopwatch.stop();                },
             start: function () { this.stopwatch.start();               },
             reset: function () { this.stopwatch.reset();               },
             pause: function () { this.stopwatch.pause();               },
           unpause: function () { this.stopwatch.unpause();             },
          isPaused: function () { return this.stopwatch.isPaused();     },
         isRunning: function () { return this.stopwatch.running;        },
getRealElapsedTime: function () {return this.stopwatch.getElapsedTime();},

  // 检测当前用时是否超过持续时间
   isExpired: function () {
      return this.stopwatch.getElapsedTime() > this.duration;
   },
  // 重写getElapsedTime方法，加入了百分比完成度percentComplete，获取变换后的时间
  // 公式：变换后时间＝原时间＊（变换后百分比／原百分比）
   getElapsedTime: function () {
      var elapsedTime = this.stopwatch.getElapsedTime(),
          percentComplete = elapsedTime / this.duration;

      if (percentComplete >= 1) {
         percentComplete = 1.0;
      }

      if (this.transducer !== undefined && percentComplete > 0) {
         elapsedTime =  elapsedTime *
                        (this.transducer(percentComplete) / percentComplete);
      }

      return elapsedTime;
   },

};

// 先快后慢变换
AnimationTimer.makeEaseOutTransducer = function (strength) {
   return function (percentComplete) {
      strength = strength ? strength : 1.0;

      return 1 - Math.pow(1 - percentComplete, strength*2);
   };
};

// 先慢后快变换
AnimationTimer.makeEaseInTransducer = function (strength) {
   strength = strength ? strength : 1.0;

   return function (percentComplete) {
      return Math.pow(percentComplete, strength*2);
   };
};

// 慢－快－慢变换
AnimationTimer.makeEaseInOutTransducer = function () {
   return function (percentComplete) {
      return percentComplete - Math.sin(percentComplete*2*Math.PI) / (2*Math.PI);
   };
};

// 弹性变换
AnimationTimer.makeElasticTransducer = function (passes) {
   passes = passes || 3;

   return function (percentComplete) {
       return ((1-Math.cos(percentComplete * Math.PI * passes)) *
               (1 - percentComplete)) + percentComplete;
   };
};

// 弹性变换再封装
AnimationTimer.makeBounceTransducer = function (bounces) {
   var fn = AnimationTimer.makeElasticTransducer(bounces);

   bounces = bounces || 2;

   return function (percentComplete) {
      percentComplete = fn(percentComplete);
      return percentComplete <= 1 ? percentComplete : 2-percentComplete;
   }; 
};

// 普通线性变换
AnimationTimer.makeLinearTransducer = function () {
   return function (percentComplete) {
      return percentComplete;
   };
};
