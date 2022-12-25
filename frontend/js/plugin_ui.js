
//on popup open send message to background.js to get data
chrome.runtime.sendMessage({action: "get_data"}, function(response) {
    console.log(response);
    var data = response.data;
    var result = data.result;
    var isPhish = data.isPhish;
    var legitimatePercent = data.legitimatePercent;
    var phishingCount = data.phishingCount;
    var suspiciousCount = data.suspiciousCount;
    var legitimateCount = data.legitimateCount;

    $("#site_score").text(legitimatePercent.toFixed(2) + "%");
    $("#phishing_count").text(phishingCount);
    $("#suspicious_count").text(suspiciousCount);
    $("#legitimate_count").text(legitimateCount);

    var featuresBody = document.getElementById("features_body");

    //insert tr for each feature in result if result[key] is 0 add td with class yellow as text moderate else if result[key] is 1 add td with class red as text high else add td with class green as text low
    
    for(var key in result){
        var newFeature = document.createElement("tr");
        newFeature.innerHTML = "<td>" + key + "</td>";
        if(result[key] == 0){
            newFeature.innerHTML += "<td class='text-warning'>Moderate</td>";
        } else if(result[key] == 1){
            newFeature.innerHTML += "<td class='text-danger'>High</td>";
        } else {
            newFeature.innerHTML += "<td class='text-success'>Low</td>";
        }
        featuresBody.appendChild(newFeature);
    }

    if (isPhish) {
        $("#site_msg").text("Phishing Site Detected!!");
    }

}
);