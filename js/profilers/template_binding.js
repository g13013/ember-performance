/**
  Renders a list of items, then changes them all.
**/
Perf.TemplateBindingProfiler = Perf.Profiler.extend({
  testCount: 40,
  name: 'Template Bindings',
  lastAge: 1,

  setup: function(){
    var people = [];

    for (var i=0; i<500; i++) {
      people.push(Em.Object.create({name: "Person " + i, age: this.nextAge()}));
    }

    var templateBindingsView = this.renderToScratch('templateBindings', {people: people});

    this.set('people', people);
    this.set('templateBindingsView', templateBindingsView);
  },

  test: function() {
    var profiler = this;
    return new Ember.RSVP.Promise(function(resolve) {
      var people               = profiler.get('people');
      var result               = profiler.get('result');
      var templateBindingsView = profiler.get('templateBindingsView');

      for (var i=0; i<people.length; i++) {
        people[i].set('age', profiler.nextAge());
      }

      // micro-task queue
      window.Promise.resolve().then(function(){
        result.stop();

        setTimeout(function() {
          // clean up stuff
          resolve();
        }, 0);
      });

    });
  },

  teardown: function(){
    this.get('templateBindingsView').destroy();
  },

  nextAge: function() {
    this.incrementProperty('lastAge');
    if (this.get('lastAge') > 99) { this.set('lastAge', 1); }

    return this.get('lastAge');
  }

});