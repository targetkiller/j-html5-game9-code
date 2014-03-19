/*
* @author:谭照强
* @project:SnailBait Game
* @content:通用精灵动作－脉动性行为（如闪烁）
* @other:跟bounce.js相类似
*/

/*
* －－－周期性行为的构造函数－－－
* para:time:持续时间，默认1000
* para:opacityThreshold:透明度
* 透明度由光变暗，再由暗变光
*/


PulseBehavior = function (time, opacityThreshold) {
   this.time = time || 1000;
   // 变亮调用慢－快计时转换器
   this.brightTimer = new AnimationTimer(this.time,
                                         AnimationTimer.makeEaseInTransducer(1));
   // 变暗调用快－慢计时转换器
   this.dimTimer = new AnimationTimer(this.time, 
                                         AnimationTimer.makeEaseOutTransducer(1));
   this.opacityThreshold = opacityThreshold;
},

PulseBehavior.prototype = { 
   // 停止脉动
   pause: function() {
      if (!this.dimTimer.isPaused()) {
         this.dimTimer.pause();
      }

      if (!this.brightTimer.isPaused()) {
         this.brightTimer.pause();
      }

      this.paused = true;
   },
   // 接触停止
   unpause: function() {
      if (this.dimTimer.isPaused()) {
         this.dimTimer.unpause();
      }

      if (this.brightTimer.isPaused()) {
         this.brightTimer.unpause();
      }

      this.paused = false;
   },
   // 开始变暗
   startDimming: function (sprite) {
      this.dimTimer.start();
   },
   // 变暗进行时
   dim: function (sprite) {
      elapsedTime = this.dimTimer.getElapsedTime();  
      sprite.opacity = 1 - ((1 - this.opacityThreshold) *
                            (parseFloat(elapsedTime) / this.time));
   },
   // 结束变暗
   finishDimming: function (sprite) {
      var self = this;
      this.dimTimer.stop();
      setTimeout( function (e) {
         self.brightTimer.start();
      }, 100);
   },
   // 变亮
   brighten: function (sprite) {
      elapsedTime = this.brightTimer.getElapsedTime();  
      sprite.opacity += (1 - this.opacityThreshold) *
                         parseFloat(elapsedTime) / this.time;
   },
   // 结束变亮
   finishBrightening: function (sprite) {
      var self = this;
      this.brightTimer.stop();
      setTimeout( function (e) {
         self.dimTimer.start();
      }, 100);
   },
   
   isBrightening: function () {
      return this.brightTimer.isRunning();
   },
      
   isDimming: function () {
      return this.dimTimer.isRunning();
   },

   execute: function(sprite, time, fps) {
      var elapsedTime;
      // 没有变亮变暗过程，开始变暗
      if (!this.isDimming() && !this.isBrightening()) {
         this.startDimming(sprite);
         return;
      }

      // 正在变暗，若变暗时间没过，则继续变暗dim()，否则完成变暗
      if(this.isDimming()) {
         if(!this.dimTimer.isExpired()) {
            this.dim(sprite);
         }
         else {
            this.finishDimming(sprite);
         }
      }
      // 正在变亮，若变亮时间没过，则继续变亮brighten()，否则完成变亮
      else if(this.isBrightening()) {
         if(!this.brightTimer.isExpired()) {
            this.brighten(sprite);
         }
         else {
            this.finishBrightening(sprite);
         }
      }
   }
};
