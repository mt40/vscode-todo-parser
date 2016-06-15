//export var java = '//\\s*{0}(.*)';
export var java = '(/\\*[\\*\\s\\r\\n]*{0}([^\\*]|[\\r\\n]|(\\*+([^\\*/]|[\\r\\n])))*(?:\\*+/)|//\\s*{0}(.*))';
export var plaintext = java;
export var c = java;
export var cpp = java;
export var csharp = java;
export var python = '#\\s*{0}(.*)';
export var coffeescript = python;
export var ada = '--\\s*{0}(.*)';
export var haskell = ada;
export var ruby = python;
export var go = java;
export var fsharp = '(\\(\\*[\\*\\s\\r\\n]*{0}([^\\*]|[\\r\\n]|(\\*+([^\\*\\)]|[\\r\\n])))*(?:\\*+\\))|//\\s*{0}(.*))';
export var r = python;
export var perl = python;
export var lua = ada;
export var markdown = java;

export var supportLanguages = [
  'java', 
  'txt',
  'c', 
  'cpp', 'h', 'hpp', 
  'cs', 
  'py', 
  'coffee', 
  'ada', 'adb',
  'hs', 'lhs',  
  'rb', 
  'go', 
  'fs', 'fsx', 
  'r', 
  'pl', 'PL', 
  'lua',
  'md', 'MD', 'markdown'
];