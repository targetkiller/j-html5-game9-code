/*
* @author:谭照强
* @project:SnailBait Game
* @content:时间秒表
*/

Stopwatch = function ()  {
   this.startTime = 0;
   this.running = false;
   this.elapsed = undefined;//用掉的时间

   this.paused = false;
   this.startPause = 0;//暂停计时
   this.totalPausedTime = 0;//暂停用掉的时间
};

Stopwatch.prototype = {
// 开始秒表
   start: function () {
      this.startTime = +new Date();
      this.running = true;
      this.totalPausedTime = 0;
      this.startPause = 0;
   },
// 停止秒表
   stop: function () {
      if (this.paused) {
         this.unpause();
      }
      
      this.elapsed = (+new Date()) - this.startTime -
                                     this.totalPausedTime;
      this.running = false;
   },
// 暂停秒表，开始暂停计时
   pause: function () {
      if (this.paused) {
         return;
      }

      this.startPause = +new Date(); 
      this.paused = true;
   },
// 解除暂停，算出全部暂停时间
   unpause: function () {
      if (!this.paused) {
         return;
      }

      this.totalPausedTime += (+new Date()) - this.startPause;
      this.startPause = 0;
      this.paused = false;
   },
// 获取当前用掉的时间
   getElapsedTime: function () {
      if (this.running) {
         return (+new Date()) - this.startTime - this.totalPausedTime;
      }
      else {
        return this.elapsed;
      }
   },
// 是否暂停
   isPaused: function () {
      return this.paused;
   },
// 获取是否运行中
   isRunning: function() {
      return this.running;
   },
// 重置秒表
   reset: function() {
     this.elapsed = 0;
     this.startTime = +new Date();
     this.running = false;
     this.totalPausedTime = 0;
     this.startPause = 0;
   }
};
