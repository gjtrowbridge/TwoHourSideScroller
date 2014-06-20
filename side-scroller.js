$(document).ready(function() {
  var moveGuy = function($el, units) {
    var newPos = $el.position().left + units;
    newPos = Math.max(0, Math.min(newPos, $(window).width() - 100));
    $el.css({
      left: newPos + 'px'
    });
  };

  window.checkCollision = function($el1, $el2) {
    if (Math.abs($el1.position().left - $el2.position().left) <= 100) {
      handleCollision($el2.attr('class'), $el2);
    }
  };
  var handleCollision = function(className, $el) {
    if (className === 'van') {
      if (status === 'taxi') {
        //does nothing
      } else if (status === 'cop') {
        console.log('killed a van!');
        $el.remove();
      } else {
        endGame();
      }
    } else if (className === 'cop') {
      status = 'cop';
      statusCounter = 300;
    } else if (className === 'taxi') {
      status = 'taxi'
      statusCounter = 500;
    }
  };

  var addThing = function(className, location) {
    location = location || Math.floor(Math.random()*1200);
    things.push($('<p>', {class:className}));
    things[things.length-1].css({
      left: location + 'px'
    }).appendTo($body);
  };

  var vanArrives = function() {
    vanInterval -= 10;
    addThing('van',1000);
    setTimeout(vanArrives, vanInterval);
  };

  var endGame = function() {
    $('h1').css({'color':'red'}).first().html('YOU DIED!');
    $('h1').last().html('YOU SHOULD HAVE GOTTEN OUT OF THERE!');
    $body.css({'background-color':'black'});
    $('h2').css({color: 'white'});
    clearInterval(intId);
  }

  window['$body'] = $('body');
  window['$human'] = $('<p>',{class:'human'}).appendTo($body);
  window['status'] = '';
  window['statusCounter'] = 0;
  window['vanInterval'] = 3000;
  window.things = [];
  window.directions = [];

  addThing('cop');
  addThing('taxi');
  vanArrives();

  $(document).keydown(function(e) {
    if (e.keyCode === 37) {
      moveGuy($human, -4);
    } else if (e.keyCode === 39) {
      moveGuy($human, 4);
    }
  });

  window.intId = setInterval(function() {
    for (var i=0; i<things.length; i++) {
      checkCollision($human, things[i]);
    }
    if (statusCounter === 0) {
      status = 'none';
    } else {
      statusCounter--;
      $('h3.pu span').html(statusCounter);
    }
    $('h3.status span').html(status)
    $('h2 span').html(parseFloat($('h2 span').html()) + 1);
  },10);
  window.switchId = setInterval(function() {
    for (var i=0; i<things.length; i++) {
      if (Math.random() < 0.5) {
        directions[i] = -1;
      } else {
        directions[i] = 1;
      }
    }
  },1000);
  window.moveId = setInterval(function() {
    for (var i=0; i<directions.length; i++) {
      moveGuy(things[i], directions[i]);
    }
  }, 10);
})

