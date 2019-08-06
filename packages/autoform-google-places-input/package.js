Package.describe({
  name: 'autoform-google-places-input',
  version: '0.0.5',
  summary: 'Quick geocomplete input field setup with an export to a customizable address SimpleSchema',
  git: 'https://github.com/abdj/autoform-google-places-input',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.use([
    'templating',
    'reactive-var',
    'aldeed:autoform@4.0.0 || 5.0.0', 
    'dburles:google-maps@1.0.8'
  ], 'client');

  api.imply('dburles:google-maps@1.0.8');

  api.addFiles([
    'lib/geocomplete/jquery.geocomplete.js',
    'lib/client/autoform-google-places-input.html',
    'lib/client/autoform-google-places-input.css',
    'lib/client/autoform-google-places-input.js'
    ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('abdj:autoform-google-places-input');
  api.addFiles('abdj:autoform-google-places-input-tests.js');
});
