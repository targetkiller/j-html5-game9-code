/*
* @author:谭照强
* @project:SnailBait Game
* @content:通用精灵动作－周期性行为
*/

/*
* －－－周期性行为的构造函数－－－
* para:interval:间隔时间，默认0
* para:delay:延迟时间，默认0
* 表示经过delay延迟后，开始显示精灵的图像循环，每interval的更新图像
*/

CycleBehavior = function (interval, delay) {
   this.interval = interval || 0;
   this.delay = delay || 0;
   this.lastAdvance = 0;
};

CycleBehavior.prototype = { 
   execute: function(sprite, time, fps) {
      if (this.lastAdvance === 0) {
         this.lastAdvance = time;
      }

      // 若有延迟并且是精灵图像第一帧，则等待delay时间
      if (this.delay && sprite.artist.cellIndex === 0) {
         if (time - this.lastAdvance > this.delay) {
            sprite.artist.advance();
            this.lastAdvance = time;
         }
      }
      // 不时图像第一帧，则隔interval更新图像一次
      else if (time - this.lastAdvance > this.interval) {
         sprite.artist.advance();
         this.lastAdvance = time;
      }
   }
};
