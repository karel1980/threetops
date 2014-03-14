(function($) {
    var Threes = function(width,height) {
      this.matrix = this.createMatrix(width, height)

      var values = [3,5,8];
      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          if (Math.random() > 0.8) {
            this.set(x,y,values[Math.floor(Math.random() * values.length)])
            //this.set(x,y,undefined)
          } else {
            this.set(x,y,undefined)
          }
        }
      }

      // for testing
      //this.set(0,0,3)
      //this.set(0,1,5)
    } 

    Threes.prototype.up = function() {
      // for each column
      this.applyOps(this.getOps("v",0,1))
    }

    Threes.prototype.down = function() {
      // for each column
      this.applyOps(this.getOps("v",4-1,-1))
    }

    Threes.prototype.left = function() {
      // for each column
      this.applyOps(this.getOps("h",0,1))
    }

    Threes.prototype.right = function() {
      // for each column
      this.applyOps(this.getOps("h",4-1,-1))
    }

    Threes.prototype.applyOps = function(ops) {
      var newMat = this.createMatrix(4,4)
      for (var i in ops) {
        var op = ops[i]
        newMat[op[1]][op[0]] = op[2].result
        this.matrix = newMat
      }

    }

    Threes.prototype.printMatrix = function(mat) {
      for (var y = 0; y < 4; y++) {
        console.log([mat[y][0] || ".", mat[y][1] || '.', mat[y][2] || '.', mat[y][3] || '.'].join(" "))
      }
    }

    Threes.prototype.createMatrix = function(width, height) {
      var mat = []
      for (var y = 0; y < height; y++) {
        var row = []
        mat.push(row)
        for (var x = 0; x < width; x++) {
          row.push(undefined)
        }
      }

      return mat;
    }

    Threes.prototype.set = function(x,y,value) {
      this.matrix[y][x] = value;
    }

    Threes.prototype.getOps = function(hv, first, d) {
      var ops = []
      var freed = []

      if (hv == "v") {
        for (var x = 0; x < 4; x++) {
          var blocked = true;
          for (var iy = 0; iy < 4; iy++) {
            var y = first + iy*d
            var op = this.getOp(x,y,x,y+d,ops,blocked);
            blocked = op[2].blocked
            if (iy + 1 == 4 && op[2].result == undefined) {
              freed.push(op)
            }
          }
        }
      } else {
        for (var y = 0; y < 4; y++) {
          var blocked = true;
          for (var ix = 0; ix < 4; ix++) {
            var x = first + ix*d
            var op = this.getOp(x,y,x+d,y,ops,blocked);
            blocked = op[2].blocked
            if (ix + 1 == 4 && op[2].result === undefined) {
              freed.push(op)
            }
          }
        }
      }

      values = [3,5,8] // TODO: sometimes you can get 16/32/64. Under what conditions? Do all values have an equal chance of being chosen?

      // inject a value into a random value on a square that became blank
      freed[Math.floor(Math.random() * freed.length)][2].result = values[Math.floor(Math.random() * values.length)]

      return ops
    }

    Threes.prototype.getOp = function(x1,y1,x2,y2,ops,blocked) {
        var nextVal = (x2 >= 0 && x2 < 4 && y2 >= 0 && y2 < 4) ? this.cell(x2,y2) : undefined;
        var t = this.calculateNext(blocked, this.cell(x1,y1), nextVal)
        var op = [x1,y1,t]
        ops.push(op)
        return op
    }

    Threes.prototype.cell = function(x,y) {
      return this.matrix[y][x]
    }

    Threes.prototype.calculateNext = function(isblocked, currentVal, nextVal) {
      t = {
        result: nextVal,
        blocked: false
      }

      if (!isblocked || currentVal === undefined) {
        // non-blocked and blank tiles just take on the value of the next one
        return t
      } else {
        if ((currentVal>=8 && nextVal>=8 && currentVal == nextVal) || (currentVal + nextVal == 8)) {
          // compatible tiles
          t.result = currentVal + nextVal
        } else {
          // incompatible tiles -> don't change and block the next one
          t.result = currentVal
          t.blocked = true
        }
      }
      return t;
    }

  function updateui() {
    //threes.printMatrix(threes.matrix)
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        var v = threes.cell(x,y)
        var bg = v == 3 ? '#f33' : v == 5 ? '#33f' : '#fff'
        $("#tile"+x+"x"+y)
            .text(threes.cell(x,y) || "")
            .css({background: bg})
      }
    }
  }

  var threes = new Threes(4,4)

  $(function() {

    $("#up").click(function() {
      threes.up()
      updateui()
    })
    $("#down").click(function() {
      threes.down()
      updateui()
    });
    $("#left").click(function() {
      threes.left()
      updateui()
    });
    $("#right").click(function() {
      threes.right()
      updateui()
    });
    $(document).keydown(function(ev) {
      switch(ev.keyCode) {
        case 38:
          threes.up()
          updateui()
          break
        case 40:
          threes.down()
          updateui()
          break
        case 37:
          threes.left()
          updateui()
          break
        case 39:
          threes.right()
          updateui()
          break
        default:
          break
      }
    })
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        $("#tile"+x+"x"+y)
          .css({position:'absolute', top: 40*(y+1), left: 40*(x+1), border: '1px solid gray', width:30, height:30})
          //.text("#tile"+x+"x"+y)
      }
    } 
    updateui()
  });
})(jQuery);
