/*
* @author:谭照强
* @project:SnailBait Game
* @content:精灵处理
*/

/*
* －－－精灵的构造函数－－－
* para:type:精灵类型
* para:artist:精灵生成方法，各有一个draw()方法表示执行生成
* para:behaviors:精灵行为，各有一个execute()方法表示执行行为
*/
var Sprite = function (type, artist, behaviors) {
   this.type = type || '';
   this.artist = artist || undefined;
   this.behaviors = behaviors || [];

   this.left = 0;
   this.top = 0;
   this.width = 10;
   this.height = 10;
   this.velocityX = 0;//水平速度
   this.velocityY = 0;//垂直速度
   this.opacity = 1.0;
   this.visible = true;

   return this;
};

// 两个方法，draw执行artist的draw(),update执行behaviors的execute()
Sprite.prototype = {
  draw: function (context) {
     context.save();
     context.globalAlpha = this.opacity;
      
     if (this.artist && this.visible) {
        this.artist.draw(this, context);
     }
     context.restore();
  },

   update: function (time, fps, context) {
      for (var i = 0; i < this.behaviors.length; ++i) {
         if (this.behaviors[i] === undefined) { // Modified while looping?
            return;
         }

         this.behaviors[i].execute(this, time, fps, context);
      }
   }
};

/*
* －－－三种方式实现－－－
* 1.ImageArtist:图像实现
* 2.SpriteSheetArist:精灵表实现
* 3.直接描边填充，只对平台条有效，直接在game.js实现
*/

var ImageArtist = function (imageUrl) {
   this.image = new Image;
   this.image.src = imageUrl;
};
// 图像精灵实现
ImageArtist.prototype = {
   image: undefined,

   drawSpriteImage: function (sprite, context) {
      context.drawImage(this.image, sprite.left, sprite.top);
   },
   
   draw: function (sprite, context) {
      this.drawSpriteImage(sprite, context);   
   }
};

// spritesheet:精灵表雪碧图
// cells:雪碧图位置元数据（x,y,w,h)，有动画则是数组
SpriteSheetArtist = function (spritesheet, cells) {
   this.cells = cells;
   this.spritesheet = spritesheet;
   this.cellIndex = 0;
};

SpriteSheetArtist.prototype = {
  // 该精灵的当前动画帧加一
   advance: function () {
      if (this.cellIndex == this.cells.length-1) {
         this.cellIndex = 0;
      }
      else {
         this.cellIndex++;
      }
   },
  // 根据sprite定位画图
   draw: function (sprite, context) {
      var cell = this.cells[this.cellIndex];

      context.drawImage(this.spritesheet, cell.left, cell.top,
                                          cell.width, cell.height,
                                          sprite.left, sprite.top,
                                          cell.width, cell.height);
   }
};

/*
* －－－爆炸动画－－－
* 注：本游戏中用于小人碰撞到物体后爆炸的情况，实现方法是临时把小人精灵用爆炸精灵临时替换，持续时间过后替换回来
* para:cells:爆炸效果的元数据数组
* para:duration:爆炸持续时间，默认是1000
* para:callback:爆炸后动画回调函数
*/

var SpriteAnimator = function (cells, duration, callback) {
   this.cells = cells;
   this.duration = duration || 1000;
   this.callback = callback;
};

// sprite:小人精灵，reappear:为true则表示爆炸后重现
SpriteAnimator.prototype = {
   start: function (sprite, reappear) {
      var originalCells = sprite.artist.cells,
          originalIndex = sprite.artist.cellIndex,
          self = this;

      sprite.artist.cells = this.cells;
      sprite.artist.cellIndex = 0;
      
      setTimeout(function() {
         sprite.artist.cells = originalCells;
         sprite.artist.cellIndex = originalIndex;
         sprite.visible = reappear;

         if (self.callback) {
            self.callback(sprite, self);
         }
      }, self.duration); 
   },
};