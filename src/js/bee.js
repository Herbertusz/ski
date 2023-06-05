/**
 * Segédfüggvények és változók
 */
var Util = {

  // billentyűkódok
  keyCode : {
    BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, CONTROL: 17, DELETE: 46, DOWN: 40,
    END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT: 45, LEFT: 37,
    NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108,
    NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33,
    PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38
  },

  timer : {      // timeout-azonosítók
    acc : null,      // mozgatás
    rot : null,      // forgatás
    flap : null      // képcserélgetés
  },

  /**
   * Timeout létrehozása
   * @param context <object> a lefuttatandó függvény this változója
   * @param func <function> lefuttatandó függvény
   * @param delay <int> várakozási idő (ms)
   * @param params <array> függvénynek átadandó paraméterek
   * @return <int> timeout-id
   */
  timeout : function(context, func, delay, params){
    return window.setTimeout(function(){func.apply(context, params);}, delay);
  },

  /**
   * A haystack tömb tartalmazza-e a needle elemet
   * @param needle <mixed> elem
   * @param haystack <array> tömb
   * @return <bool>
   */
  inArray : function(needle, haystack){
    if (Array.prototype.indexOf){
      return (haystack.indexOf(needle) > -1) ? true : false;
    }
    for (var i = 0, length = haystack.length; i < length; i++){
      if (haystack[i] === needle){
        return true;
      }
    }
    return false;
  },

  /**
   * Két objektum egyszintű összefésülése
   * @param obj1 <object>
   * @param obj2 <object>
   */
  mergeObj : function(obj1, obj2){
    for (var prop in obj2){
      obj1[prop] = obj2[prop];
    }
  },

  /**
   * Derékszögű vektorok összege (négyzetösszegek gyöke)
   * @param a <float|object> ha object, akkor az x és y tagváltozók lesznek összeadva
   * @param b <float>
   * @return <float>
   */
  addition : function(a, b){
    if (typeof(a) == 'object'){
      return Math.sqrt(a.x * a.x + a.y * a.y);
    }
    else{
      return Math.sqrt(a * a + b * b);
    }
  }

};

/**
 * Geometriai műveleteket végző objektum
 */
var Geometry = {

  /**
   * Két egyenes metszete (vízszintes vagy függőleges)
   * c1 az egyik végpont c2 a másik koordinátája (x vagy y)
   * @param line1 <object> (c1,c2)
   * @param line2 <object> (c1,c2)
   * @return <object> (c1,c2)
   */
  getLineIntersection : function(line1, line2){
    var intersect = {c1 : null, c2 : null};
    if (line1.c1 < line2.c1){
      if (line1.c2 > line2.c1){
        if (line1.c2 > line2.c2){
          // 1c1---2c1===2c2---1c2
          intersect.c1 = line2.c1;
          intersect.c2 = line2.c2;
        }
        else{
          // 1c1---2c1===1c2---2c2
          intersect.c1 = line2.c1;
          intersect.c2 = line1.c2;
        }
      }
      else{
        // 1c1---1c2  2c1---2c2
        return null;
      }
    }
    else{
      if (line1.c1 < line2.c2){
        if (line1.c2 < line2.c2){
          // 2c1---1c1===1c2---2c2
          intersect.c1 = line1.c1;
          intersect.c2 = line1.c2;
        }
        else{
          // 2c1---1c1===2c2---1c2
          intersect.c1 = line1.c1;
          intersect.c2 = line2.c2;
        }
      }
      else{
        // 2c1---2c2  1c1---1c2
        return null;
      }
    }
    return intersect;
  },

  /**
   * Két téglalap érintkezési vonala
   * @param rect1 <object> (x1,y1,x2,y2)
   * @param rect2 <object> (x1,y1,x2,y2)
   * @param pixel <int> élek megengedett távolsága
   * @return <object|null> (c1,c2,dir)
   */
  getRectTouching : function(rect1, rect2, pixel){
    if (typeof(pixel) == 'undefined') pixel = 0;
    var touching = null;
    if (Math.abs(rect1.x1 - rect2.x2) <= pixel){
      // rect1 bal oldala (külső)
      touching = this.getLineIntersection({c1 : rect1.y1, c2 : rect1.y2}, {c1 : rect2.y1, c2 : rect2.y2});
      if (touching) touching.dir = 'left';
    }
    else if (Math.abs(rect1.x2 - rect2.x1) <= pixel){
      // rect1 jobb oldala (külső)
      touching = this.getLineIntersection({c1 : rect1.y1, c2 : rect1.y2}, {c1 : rect2.y1, c2 : rect2.y2});
      if (touching) touching.dir = 'right';
    }
    else if (Math.abs(rect1.y1 - rect2.y2) <= pixel){
      // rect1 felső oldala (külső)
      touching = this.getLineIntersection({c1 : rect1.x1, c2 : rect1.x2}, {c1 : rect2.x1, c2 : rect2.x2});
      if (touching) touching.dir = 'top';
    }
    else if (Math.abs(rect1.y2 - rect2.y1) <= pixel){
      // rect1 felső oldala (külső)
      touching = this.getLineIntersection({c1 : rect1.x1, c2 : rect1.x2}, {c1 : rect2.x1, c2 : rect2.x2});
      if (touching) touching.dir = 'bottom';
    }
    return touching;
  },

  /**
   * Két téglalap metszete üres-e
   * @param rect1 <object> (x1,y1,x2,y2)
   * @param rect2 <object> (x1,y1,x2,y2)
   * @return <bool> true, ha van metszetük
   */
  isRectIntersection : function(rect1, rect2){
    if (rect1.x1 <= rect2.x2 && rect1.x2 >= rect2.x1 && rect1.y1 <= rect2.y2 && rect1.y2 >= rect2.y1){
      return true;
    }
    else{
      return false;
    }
  },

  /**
   * Két téglalap metszete
   * @param rect1 <object> (x1,y1,x2,y2)
   * @param rect2 <object> (x1,y1,x2,y2)
   * @return <object|null> (x1,y1,x2,y2)
   */
  getRectIntersection : function(rect1, rect2){
    var intersect = {x1 : null, y1 : null, x2 : null, y2 : null};
    var lineint;
    if ((lineint = this.getLineIntersection({c1 : rect1.x1, c2 : rect1.x2}, {c1 : rect2.x1, c2 : rect2.x2}))){
      intersect.x1 = lineint.c1;
      intersect.x2 = lineint.c2;
    }
    else{
      return null;
    }
    if ((lineint = this.getLineIntersection({c1 : rect1.y1, c2 : rect1.y2}, {c1 : rect2.y1, c2 : rect2.y2}))){
      intersect.y1 = lineint.c1;
      intersect.y2 = lineint.c2;
    }
    else{
      return null;
    }
    return intersect;
  }

};

/**
 * Objektumok összekapcsolása
 * mediator (illesztő) minta
 */
var Mediator = {

  objects : {},

  components : {
    moveImage : function(pos, angle){
      return this.GraphicalEngine.moveImage.call(this.GraphicalEngine, pos, angle);
    },
    isOutsideOf : function(wall, pos, pixel){
      return this.Interaction.isOutsideOf.call(this.Interaction, wall, pos, pixel);
    },
    isTouchedOf : function(wall, pos, pixel){
      return this.Interaction.isTouchedOf.call(this.Interaction, wall, pos, pixel);
    },
    getTrackObjects : function(){
      return this.Track.objects[Current.track];
    }
  },

  /**
   * objects feltöltése
   * @param objects <object> összekapcsolandó objektumok
   */
  init : function(objects){
    this.objects = objects;
  },

  /**
   * Tagfüggvény futtatása
   * @param event <string> hivatkozás a tagfüggvényre (components-beli elem)
   * @param args <array> a függvénynek átadandó paraméterek
   * @return <mixed> a függvény visszatérési értéke
   */
  run : function(event, args){
    if (typeof(this.components[event]) != 'undefined'){
      return this.components[event].apply(this.objects, args);
    }
    else{
      return undefined;
    }
  }

};

/**
 * Pillanatnyi értékeket tároló objektum
 */
var Current = {

  pos : {x : 0, y : 0},      // aktuális pozíció
  angle : 0,            // aktuális szögelfordulás
  speed : {x : 0, y : 0},      // aktuális sebesség
  track : 1            // aktuális pálya

};

/**
 * Grafikai műveletek kezelése
 * @param canvas <DOM object> elülső canvas
 * @param canvasbg <DOM object> háttér
 * @param imagepaths <array> mozgó objektum képei
 * @param imagesize <object> képek méretei
 * @param startpos <object> kezdőpozíció
 */
var GraphicalEngine = function(canvas, canvasbg, imagepaths, imagesize, startpos){
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.canvasbg = canvasbg;
  this.ctxbg = canvasbg.getContext('2d');

  for (var i = 0; i < imagepaths.length; i++){
    this.images[i] = new Image();
    this.images[i].src = imagepaths[i];
  }
  this.currentimage = this.images[0];
  this.imagesize = imagesize;
  this.startpos = startpos;
};

GraphicalEngine.prototype = {

  constructor : GraphicalEngine,

  angularVelocity : 1 / 120,    // forgatás szögsebessége
  flapping : 70,          // szárnycsapkodás periódusideje

  canvas : null,          // canvas elem
  canvasbg : null,        // háttércanvas elem
  ctx : null,            // rajzoló kontextus
  ctxbg : null,          // háttér rajzoló kontextusa
  currentimage : null,      // aktuális kép (this.images egyik eleme)
  images : [],          // lehetséges képek
  imagesize : {w : 0, h : 0},    // képek maximális mérete (törléshez)

  /**
   * Kép kirajzolása (első alkalommal)
   */
  createImage : function(){
    this.ctx.translate(this.startpos.x, this.startpos.y);
    this.ctx.save();
    this.ctx.drawImage(this.currentimage, -Math.round(this.imagesize.w / 2), -Math.round(this.imagesize.h / 2));
    this.ctx.restore();
  },

  /**
   * Méh törlése
   * @param pos <object> pozíció
   */
  deleteImage : function(pos){
    var w = Math.round(Math.SQRT2 * this.imagesize.w);
    var h = Math.round(Math.SQRT2 * this.imagesize.h);
    this.ctx.clearRect(pos.x - Math.round(w / 2), pos.y - Math.round(h / 2), w, h);
  },

  /**
   * Képcserélgetés (szárnycsapkodás)
   * @param period <int> következő képkocka
   */
  swapImage : function(period){
    this.currentimage = this.images[period];
    Util.timer.flap = Util.timeout(this, this.swapImage, this.flapping, [(period + 1) % this.images.length]);
  },

  /**
   * Képcserélgetés leállítása
   */
  unswapImage : function(){
    this.currentimage = this.images[0];
    window.clearTimeout(Util.timer.flap);
  },

  /**
   * Kép transzformálása (eltolás + elforgatás)
   * @param pos <object> új pozíció
   * @param angle <float> új szögelfordulás
   */
  moveImage : function(pos, angle){
    if (pos == Current.pos && angle == Current.angle){
      return false;
    }
    else{
      this.deleteImage({x : Current.pos.x, y : Current.pos.y});
      this.ctx.save();
      this.ctx.translate(Math.round(pos.x), Math.round(pos.y));
      this.ctx.rotate(angle);
      this.ctx.drawImage(this.currentimage, -Math.round(this.imagesize.w / 2), -Math.round(this.imagesize.h / 2));
      this.ctx.restore();
      Current.pos = pos;
      Current.angle = angle;
      return true;
    }
  },

  /**
   * Méh forgatása
   * @param angle <float> új szögelfordulás
   */
  smoothRotateImage : function(angle){
    var step = this.angularVelocity * Math.PI;
    var nextangle = Current.angle;
    if (Current.angle < angle){
      nextangle += step;
    }
    else{
      nextangle -= step;
    }
    this.moveImage(Current.pos, nextangle);
    Util.timer.rot = Util.timeout(this, this.smoothRotateImage, 10, [angle]);
    if (Math.abs(Current.angle - angle) < step * 1.5){
      this.moveImage(Current.pos, angle);
      window.clearTimeout(Util.timer.rot);
    }
  },

  /**
   * Objektumok kirajzolása
   */
  drawObjects : function(){
    this.ctxbg.translate(this.startpos.x, this.startpos.y);
    var drawLeafs = function(ctxbg, _leafimage){
      var objects = Mediator.run('getTrackObjects', []);
      for (var i = 0; i < objects.leafs.length; i++){
        var leaf = objects.leafs[i];
        ctxbg.strokeRect(leaf.x1, leaf.y1, leaf.x2 - leaf.x1, leaf.y2 - leaf.y1);
        //ctxbg.drawImage(leafimage, leaf.x1 - 23, leaf.y1 - 20);
      }
    };
    var leafimage = new Image();
    leafimage.src = 'bee/images/leaf.png';
    Util.timeout(this, drawLeafs, 200, [this.ctxbg, leafimage]);
  }

};

/**
 * Felhasználói irányítás (billentyűzet, egér kezelése)
 * @param controls <object> billentyűk adatai
 */
var Controller = function(controls){
  this.controls = controls;
};

Controller.prototype = {

  constructor : Controller,

  keydown : [],          // aktuálisan lenyomott billentyűk
  controls : {},

  /**
   * Ha true, le van nyomva a key kódú billentyű
   * @param key <int> billentyűkód
   * @return <bool>
   */
  inKeyArray : function(key){
    for (var i = 0, length = this.keydown.length; i < length; i++){
      if (key.which == this.keydown[i].which){
        return true;
      }
    }
    return false;
  },

  /**
   * Billentyűhöz tartozó adatok visszaadása
   * @param keyCode <int> billentyűkód
   * @return <object> a this.keydown-ba beszúrandó elem
   */
  getKeyInfo : function(keyCode){
    var key = {
      which : keyCode
    };
    var controls = this.controls;
    for (var button in Util.keyCode){
      if (keyCode == Util.keyCode[button] && controls[button]){
        Util.mergeObj(key, controls[button]);
        return key;
      }
    }
    return null;
  }

};

/**
 * Fizikai modell
 */
var PhysicalModel = function(){
  /* NOOP */
};

PhysicalModel.prototype = {

  constructor : PhysicalModel,

  maxspeed : 6,          // maximális sebesség
  minspeed : 0.09,        // minimális sebesség (ennél kisebb sebesség 0-nak számít)
  upwardThrust : 0.25,      // felfele gyorsulás
  sidewardThrust : 0.2,      // oldalirányú gyorsulás
  friction : 0.1,          // súrlódási tényező
  conservation : 0.5,        // ütközésnél megmaradó energia
  gravity : {            // gravitációs gyorsulás
    acceleration : 0.15,
    direction : Math.PI
  },

  sliding : [],          // csúszás (fal melyik oldalán/oldalain)

  /**
   * Gyorsulás meghatározása a lenyomott billentyűk és kölcsönhatások alapján
   * @param keydown <array> lenyomott billentyűk
   * @return <object> gyorsulás nagysága és iránya
   */
  getAcceleration : function(keydown){
    var gravity = this.gravity;
    var acc = {
      acceleration : gravity.acceleration,
      direction : gravity.direction
    };
    var accX = acc.acceleration * Math.sin(acc.direction);
    var accY = acc.acceleration * Math.cos(acc.direction);

    for (var i = 0, length = keydown.length; i < length; i++){
      accX += keydown[i].acceleration * Math.sin(keydown[i].direction);
      accY += keydown[i].acceleration * Math.cos(keydown[i].direction);
    }
    if (Util.inArray('bottom', this.sliding)){
      if (Math.abs(Current.speed.x) > this.minspeed){
        accX += ((Current.speed.x > 0) ? -this.friction : this.friction);
      }
    }
    if (Util.inArray('top', this.sliding) && accY > 0) accY = 0;
    if (Util.inArray('bottom', this.sliding) && accY < 0) accY = 0;
    if (Util.inArray('left', this.sliding) && accX < 0) accX = 0;
    if (Util.inArray('right', this.sliding) && accX > 0) accX = 0;
    acc.acceleration = Util.addition(accX, accY);
    if (accY == 0){
      if (accX == 0){
        acc.direction = 0;
      }
      else{
        acc.direction = (accX > 0) ? Math.PI / 2 : -Math.PI / 2;
      }
    }
    else if (accX >= 0 && accY >= 0 || accX < 0 && accY >= 0){
      // -90 - 90 fok
      acc.direction = Math.atan(accX / accY);
    }
    else{
      // 90 - 270 fok
      acc.direction = Math.atan(accX / accY) + Math.PI;
    }
    return acc;
  },

  /**
   * Méh következő pozíciójának meghatározása
   * @param acceleration <float> gyorsulás nagysága
   * @param angle <float> gyorsulás iránya (0 -> -y irány)
   * @return <object> következő pozíció
   */
  accelerateImage : function(acceleration, angle){
    Current.speed.x += acceleration * Math.sin(angle);
    Current.speed.y -= acceleration * Math.cos(angle);
    if (Util.addition(Current.speed) > this.maxspeed){
      Current.speed.x = (this.maxspeed * Current.speed.x) / Util.addition(Current.speed);
      Current.speed.y = (this.maxspeed * Current.speed.y) / Util.addition(Current.speed);
    }
    var newPos = {
      x : Current.pos.x + Current.speed.x,
      y : Current.pos.y + Current.speed.y
    };
    return newPos;
  },

  /**
   * Méh mozgatása
   * @param keydown <array> lenyomott billentyűk
   */
  setMovementImage : function(keydown){
    var acc = this.getAcceleration(keydown);
    var acceleration = acc.acceleration;
    var angle = acc.direction;
    if (Math.abs(Current.speed.x) < this.minspeed) Current.speed.x = 0;
    if (Math.abs(Current.speed.y) < this.minspeed) Current.speed.y = 0;
    var newPos = this.accelerateImage(acceleration, angle);
    var collision = this.getCollision(newPos);
    this.sliding = this.getSliding(newPos);
    if (collision.length == 1){
      collision = collision[0];
      if (collision == 'top' || collision == 'bottom'){
        Current.speed.y = -(Current.speed.y * this.conservation);
      }
      else if (collision == 'left' || collision == 'right'){
        Current.speed.x = -(Current.speed.x * this.conservation);
      }
    }
    if (collision.length == 2){
      Current.speed.x = -(Current.speed.x * this.conservation);
      Current.speed.y = -(Current.speed.y * this.conservation);
    }
    if (!Mediator.run('isOutsideOf', ['any', newPos, 1])){
      Mediator.run('moveImage', [newPos, Current.angle]);
    }
    Util.timer.acc = Util.timeout(this, this.setMovementImage, 30, [keydown]);
  },

  /**
   * Méh ütközése fallal
   * @param pos <object> pozíció
   * @return <array> melyik fallal ütközik
   */
  getCollision : function(pos){
    var coll = [];
    if (Mediator.run('isOutsideOf', ['top', pos]) && Current.speed.y < 0){
      coll.push('top');
    }
    if (Mediator.run('isOutsideOf', ['bottom', pos]) && Current.speed.y >= 0){
      coll.push('bottom');
    }
    if (Mediator.run('isOutsideOf', ['left', pos]) && Current.speed.x < 0){
      coll.push('left');
    }
    if (Mediator.run('isOutsideOf', ['right', pos]) && Current.speed.x >= 0){
      coll.push('right');
    }
    return coll;
  },

  /**
   * Méh csúszása
   * @return <array> melyik falakon csúszik
   */
  getSliding : function(pos){
    var diff = 1;
    var sliding = [];
    if (Mediator.run('isTouchedOf', ['top', pos, diff]) && Math.abs(Current.speed.y) < this.minspeed){
      sliding.push('top');
    }
    if (Mediator.run('isTouchedOf', ['bottom', pos, diff]) && Math.abs(Current.speed.y) < this.minspeed){
      sliding.push('bottom');
    }
    if (Mediator.run('isTouchedOf', ['left', pos, diff]) && Math.abs(Current.speed.x) < this.minspeed){
      sliding.push('left');
    }
    if (Mediator.run('isTouchedOf', ['right', pos, diff]) && Math.abs(Current.speed.x) < this.minspeed){
      sliding.push('right');
    }
    return sliding;
  }

};

/**
 * Objektumok kölcsönhatását vizsgáló objektum
 * @param beecollision <object> mozgatható objektum ütközési határai
 */
var Interaction = function(beecollision){
  this.beecollision = beecollision;
};

Interaction.prototype = {

  constructor : Interaction,

  objects : {},

  /**
   * objects feltöltése
   */
  init : function(){
    this.objects = Mediator.run('getTrackObjects', []);
  },

  /**
   * Kívül van-e a falon/objektumokon az adott pozíció legalább a megadott pixellel
   * @param wall <string> fal
   * @param pos <object> pozíció
   * @param pixel <int> megengedett túllépés
   * @return <bool> ha true, túllépte a falat
   */
  isOutsideOf : function(wall, pos, pixel){
    if (typeof(pixel) == 'undefined') pixel = 0;
    if (pos.y - this.beecollision.top < this.objects.border.top - pixel && (wall == 'top' || wall == 'any')){
      return true;
    }
    if (pos.y + this.beecollision.bottom >= this.objects.border.bottom + pixel && (wall == 'bottom' || wall == 'any')){
      return true;
    }
    if (pos.x - this.beecollision.left < this.objects.border.left - pixel && (wall == 'left' || wall == 'any')){
      return true;
    }
    if (pos.x + this.beecollision.right >= this.objects.border.right + pixel && (wall == 'right' || wall == 'any')){
      return true;
    }
    // levelek
    var bee = {
      x1 : pos.x - this.beecollision.left,
      y1 : pos.y - this.beecollision.top,
      x2 : pos.x + this.beecollision.right,
      y2 : pos.y + this.beecollision.bottom
    };
    for (var i = 0; i < this.objects.leafs.length; i++){
      var leaf = this.objects.leafs[i];
      if (Geometry.isRectIntersection(bee, leaf)){
        var is = Geometry.getRectIntersection(bee, leaf);
        if (Math.abs(is.x2 - is.x1) > pixel || Math.abs(is.y2 - is.y1) > pixel){
          if (Math.abs(is.x2 - is.x1) > Math.abs(is.y2 - is.y1)){
            // top || bottom
            if (Math.abs(is.y1 - pos.y) > Math.abs(is.y2 - pos.y) && (wall == 'top' || wall == 'any')){
              return true;
            }
            if (Math.abs(is.y1 - pos.y) < Math.abs(is.y2 - pos.y) && (wall == 'bottom' || wall == 'any')){
              return true;
            }
          }
          else{
            // left || right
            if (Math.abs(is.x1 - pos.x) > Math.abs(is.x2 - pos.x) && (wall == 'left' || wall == 'any')){
              return true;
            }
            if (Math.abs(is.x1 - pos.x) < Math.abs(is.x2 - pos.x) && (wall == 'right' || wall == 'any')){
              return true;
            }
          }
        }
      }
    }
    return false;
  },

  /**
   * Érintkezik-e a fallal/objektummal az adott pozíció
   * @param wall <string> fal
   * @param pos <object> pozíció
   * @param pixel <int> megengedett eltérés
   * @return <bool> ha true, érintkezik a fallal
   */
  isTouchedOf : function(wall, pos, pixel){
    if (typeof(pixel) == 'undefined') pixel = 0;
    if (Math.abs(pos.y - this.beecollision.top - this.objects.border.top) <= pixel && (wall == 'top' || wall == 'any')){
      return true;
    }
    if (Math.abs(pos.y + this.beecollision.bottom - this.objects.border.bottom) <= pixel && (wall == 'bottom' || wall == 'any')){
      return true;
    }
    if (Math.abs(pos.x - this.beecollision.left - this.objects.border.left) <= pixel && (wall == 'left' || wall == 'any')){
      return true;
    }
    if (Math.abs(pos.x + this.beecollision.right - this.objects.border.right) <= pixel && (wall == 'right' || wall == 'any')){
      return true;
    }
    // levelek
    var bee = {
      x1 : pos.x - this.beecollision.left,
      y1 : pos.y - this.beecollision.top,
      x2 : pos.x + this.beecollision.right,
      y2 : pos.y + this.beecollision.bottom
    };
    for (var i = 0; i < this.objects.leafs.length; i++){
      var leaf = this.objects.leafs[i];
      var touch = Geometry.getRectTouching(bee, leaf, pixel);
      if (touch && (wall == 'any' || wall == touch.dir)){
        return true;
      }
    }
    return false;
  }

};

/**
 * Pályák adatait tároló objektum
 */
var Track = {

  objects : {
    1 : {
      border : {
        top : -330,
        bottom : 70,
        left : -370,
        right : 430
      },
      leafs : [
        {x1 : -100, y1 : -100, x2 : 0, y2 : -90},
        {x1 : 200, y1 : -150, x2 : 300, y2 : -140},
        {x1 : 0, y1 : -130, x2 : 100, y2 : -120},
        {x1 : -300, y1 : -200, x2 : -200, y2 : -190},
        {x1 : -180, y1 : -200, x2 : -80, y2 : -190}
      ]
    }
  }

};

/**
 * A játékot vezérlő objektum
 * @param canvas <DOM object> canvas elem
 * @param canvasbg <DOM object> háttércanvas elem
 */
var BeeGame = function(canvas, canvasbg){
  var imagepaths = ['assets/images/bee.png', 'assets/images/bee_flying.png'];
  this.track = Track;
  this.interaction = new Interaction(this.beecollision);
  var graphics = this.graphics = new GraphicalEngine(canvas, canvasbg, imagepaths, this.beesize, this.startpos);
  var physics = this.physics = new PhysicalModel();
  var controlkeys = {
    RIGHT : {
      acceleration : physics.sidewardThrust,
      direction : Math.PI / 2,
      angle : Math.PI / 6,
      keydown : null,
      keyup : null
    },
    LEFT : {
      acceleration : physics.sidewardThrust,
      direction : -(Math.PI / 2),
      angle : -(Math.PI / 6),
      keydown : null,
      keyup : null
    },
    UP : {
      acceleration : physics.upwardThrust,
      direction : 0,
      angle : 0,
      keydown : {context : graphics, func : graphics.swapImage, params : [1]},
      keyup : {context : graphics, func : graphics.unswapImage, params : []}
    }
  };
  this.control = new Controller(controlkeys);
  Mediator.init({
    Track : this.track,
    Interaction : this.interaction,
    GraphicalEngine : this.graphics,
    PhysicalModel : this.physics,
    Controller : this.control
  });
};

BeeGame.prototype = {

  constructor : BeeGame,

  beesize : {w : 64, h : 64},    // méh mérete
  beecollision : {        // méh ütközési mérete (középponttól mekkora távolságra van az ütközési vonal)
    top : 17, bottom : 31, left: 15, right: 15
  },
  startpos : {x : 370, y : 330},  // kezdő pozíció (transzformálás előtt)
  startspeed : {x : 0, y : 0},  // kezdősebesség

  /**
   * Alapadatok beállítása, eseménykezelők létrehozása, kép kirajzolása a kiindulási helyre
   */
  init : function(){
    this.interaction.init();
    this.initializeEventHandlers();
    var drawBee = function(){
      this.graphics.createImage(this.startpos);
      Current.speed = this.startspeed;
      this.physics.setMovementImage([]);
    };
    Util.timeout(this, drawBee, 100);  // Chrome, IE9 (onload nem jó)
    this.graphics.drawObjects();
  },

  /**
   * Eseménykezelők létrehozása
   */
  initializeEventHandlers : function(){
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var game = this;
    this.graphics.canvas.setAttribute('tabindex', '0');
    this.graphics.canvas.style.outline = 'none';

    this.graphics.canvas.addEventListener('keydown', function(event){
      event.preventDefault();
      if (event.keyCode == Util.keyCode.ESCAPE){
        window.clearTimeout(Util.timer.acc);
        window.clearTimeout(Util.timer.rot);
        window.clearTimeout(Util.timer.flap);
        return;
      }
      var key = game.control.getKeyInfo(event.keyCode);
      if (key && !game.control.inKeyArray(key)){
        game.control.keydown.push(key);
        window.clearTimeout(Util.timer.acc);
        game.graphics.smoothRotateImage(game.getAngleByKeys());
        game.physics.setMovementImage(game.control.keydown);
        if (key && key.keydown){
          key.keydown.func.apply(key.keydown.context, key.keydown.params);
        }
      }
    }, false);

    this.graphics.canvas.addEventListener('keyup', function(event){
      event.preventDefault();
      window.clearTimeout(Util.timer.acc);
      window.clearTimeout(Util.timer.rot);
      for (var i = 0; i < game.control.keydown.length; i++){
        if (event.keyCode == game.control.keydown[i].which){
          game.control.keydown.splice(i, 1);
          break;
        }
      }
      var key = game.control.getKeyInfo(event.keyCode);
      game.graphics.smoothRotateImage(game.getAngleByKeys());
      game.physics.setMovementImage(game.control.keydown);
      if (key && key.keyup){
        key.keyup.func.apply(key.keyup.context, key.keyup.params);
      }
    }, false);

    this.graphics.canvas.addEventListener('blur', function(_event){
      window.setTimeout(function(){game.graphics.canvas.focus();}, 1);
    }, false);

    this.graphics.canvas.focus();
  },

  /**
   * Szögelfordulás meghatározása a lenyomott billentyűk alapján
   * @return <float> szögelfordulás
   */
  getAngleByKeys : function(){
    var angle = 0;
    for (var i = 0; i < this.control.keydown.length; i++){
      angle += this.control.keydown[i].angle;
    }
    return angle;
  }

};

window.onload = function(){

  var canvas = document.getElementById('bee');
  var canvasbg = document.getElementById('beebg');
  var game = new BeeGame(canvas, canvasbg);
  game.init();

};
