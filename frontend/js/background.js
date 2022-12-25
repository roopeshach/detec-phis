
var results = {};
var legitimatePercents = {};
var isPhish = {};
var data = {};

function fetchLive(callback) {
  $.getJSON("http://127.0.0.1/classifier.json", function(data) {
      chrome.storage.local.set({cache: data, cacheTime: Date.now()}, function() {
        console.log("Classifier updated", data);  
        callback(data);
          
      });
  });
}

function fetchCLF(callback) {
  chrome.storage.local.get(['cache', 'cacheTime'], function(items) {
      if (items.cache && items.cacheTime) {
        // console.log("Classifier cached", items.cache);
          return callback(items.cache);
      }
      fetchLive(callback);
  });
}

let decision_tree = function(root) {
  var predictOne = function(x) {
    var node = root;
    while(node['type'] == 'split') {
      var threshold = node['threshold'].split(' <= ');
      if(x[threshold[0]] <= threshold[1]) { //Left
        node = node['left'];
      } else { //Right
        node = node['right'];
      }
    }
    return node['value'][0];
  }

  var predict = function(X) {
    var pred = [];
    for(let x in X) {
      pred.push(this.predictOne(X[x]));
    }
    return pred;
  }

  return {
    'predict': predict,
    'predictOne': predictOne
  }
}

let random_forest = function(clf) {
  var predict = function(X) {
    var pred = [];
    for(let e in clf['estimators']) {
      let tree = decision_tree(clf['estimators'][e]);
      pred.push(tree.predict(X));
    }
    pred = pred[0].map((col, i) => pred.map(row => row[i]));
    var results = [];
    for(var p in pred) {
      let positive=0, negative=0;
      for(let i in pred[p]) {
        positive += pred[p][i][1];
        negative += pred[p][i][0];
      }
      results.push([positive>=negative, Math.max(positive, negative)]);
    }
    return results;
  }

  return {
    'predict': predict
  }
}


function classify( result) {
  var legitimateCount = 0;
  var suspiciousCount = 0;
  var phishingCount = 0;
  for(var key in result) {
    if(result[key] == "1") phishingCount++;
    else if(result[key] == "0") suspiciousCount++;
    else legitimateCount++;
  }
  var legitimatePercent = legitimateCount / (phishingCount+suspiciousCount+legitimateCount) * 100;
  
  if(result.length != 0) {
    var X = [];
    X[0] = [];
    for(var key in result) {
        X[0].push(parseInt(result[key]));
    }

   fetchCLF(function(clf) {
      var rf = random_forest(clf);
      y = rf.predict(X);
      var isPhish = y[0][0];

      data = {
        "isPhish": isPhish,
        "legitimatePercent": legitimatePercent,
        "phishingCount": phishingCount,
        "suspiciousCount": suspiciousCount,
        "legitimateCount": legitimateCount,
        "result": result,
      }

      console.log(data);
      
      chrome.runtime.sendMessage({action: "classify", data: data},
        function(response) {
          console.log(response);
        }
      );

    });
    
  }

}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action == "get_data") {
    sendResponse({data: data});
  }
  results[sender.tab.id]=request;
  classify(request);
  sendResponse({data: data});
  return true;


});
