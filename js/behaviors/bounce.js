/*
* @author:谭照强
* @project:SnailBait Game
* @content:通用精灵动作－精灵跳动行为（上升快到慢，下降慢到快）
* @other:跟pulse.js相类似
*/

/*
* －－－精灵跳动行为的构造函数－－－
* para:riseTime:上升时间，默认1000
* para:fallTime:下降时间，默认1000
* para:distance:距离，默认100
*/

BounceBehavior = function (riseTime, fallTime, distance) {
   this.riseTime = riseTime || 1000;
   this.fallTime = fallTime || 1000;
   this.distance = distance || 100;

   // 上升，开启计时转换器，使用快－慢转换器
   this.riseTimer = new AnimationTimer(this.riseTime,
                                       AnimationTimer.makeEaseOutTransducer(1.2));
   
   // 下降，开启计时转换器，使用慢－快转换器
   this.fallTimer = new AnimationTimer(this.fallTime,
                                       AnimationTimer.makeEaseInTransducer(1.2));
   this.paused = false;
}

BounceBehavior.prototype = {
   // 暂停行为
   pause: function() {
      if (!this.riseTimer.isPaused()) {
         this.riseTimer.pause();
      }

      if (!this.fallTimer.isPaused()) {
         this.fallTimer.pause();
      }

      this.paused = true;
   },
   // 解除暂停
   unpause: function() {
      if (this.riseTimer.isPaused()) {
         this.riseTimer.unpause();
      }

      if (this.fallTimer.isPaused()) {
         this.fallTimer.unpause();
      }

      this.paused = false;
   },
   // 开始上升，初始化baseline，打开计时转换器
   startRising: function (sprite) {
      this.baseline = sprite.top;
      this.bounceStart = sprite.top;

      this.riseTimer.start();
   },
   // 上升操作，根据计时转换器改变精灵的top
   rise: function (sprite) {
      var elapsedTime = this.riseTimer.getElapsedTime();
      sprite.top = this.baseline - parseFloat(
                      (elapsedTime / this.riseTime) * this.distance);
   },
   // 结束上升，关闭上升计时转换器，改变baseline，打开下降计时转换器
   finishRising: function (sprite) {
      this.riseTimer.stop();
      this.baseline = sprite.top;
      this.fallTimer.start();
   },
   // 下降操作，根据即使转换器改变精灵的top
   fall: function (sprite) {
      var elapsedTime = this.fallTimer.getElapsedTime();  
      sprite.top = this.baseline +
      parseFloat((elapsedTime / this.fallTime) * this.distance);
   },
   // 结束下降，关闭下降计时转换器，高度重设置为bounceStart，重新开始上升操作
   finishFalling: function (sprite) {
      this.fallTimer.stop();
      sprite.top = this.bounceStart;
      this.startRising(sprite);
   },
      
   isFalling: function () {
      return this.fallTimer.isRunning();
   },
      
   isRising: function () {
      return this.riseTimer.isRunning();
   },
      
   execute: function(sprite, time, fps) {
      // 暂停中，没有上升，没有下降状态则开始上升
      if (this.paused || !this.isRising() && ! this.isFalling()) {
         this.startRising(sprite);
         return;
      }
      // 上升中，并且上升操作还没结束，执行rise()，否则结束
      if(this.isRising()) {
         if(!this.riseTimer.isExpired()) {
            this.rise(sprite);
         }
         else {
            this.finishRising(sprite);
         }
      }
      // 下降中，并且下降操作还没结束，执行fall()，否则结束
      else if(this.isFalling()) {
         if(!this.fallTimer.isExpired()) {
            this.fall(sprite);
         }
         else {
            this.finishFalling(sprite);
         }
      }
   }
};
