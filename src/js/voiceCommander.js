'use strict';

var commands = {
  hello: function() { window.alert('Hello world!'); },
  'best command': function() { window.alert('Muffin Commandos'); }
};

if (annyang) {
  annyang.addCommands(commands);
  annyang.start();
}
