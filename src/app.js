import awsconfig from './aws-exports';
import Amplify, { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';

const ENDPOINT_URL = "https://oojeswkd0c.execute-api.ap-southeast-1.amazonaws.com/dev/v1";

Amplify.configure(awsconfig);
/*
Amplify.configure({
    API: {
        endpoints: [{
            name: "MesAppApis",
            endpoint: "https://oojeswkd0c.execute-api.ap-southeast-1.amazonaws.com/dev/v1"
        }]
    }

function getUsers() {
    try {
        const data = API.get('https://oojeswkd0c.execute-api.ap-southeast-1.amazonaws.com/dev/v1', '/users', {
            'queryStringParameters': {
                "user_type": "A",
                "type": "getUsersByType"
            }
        });
    } catch (error) {
        console.log(error);
    }
}
*/

const loginButton = document.getElementById("login");
const signupLink = document.getElementById("signup");
const result = document.getElementById("SignupResult");
const adminsignout = document.getElementById("signout");
const workersignout = document.getElementById("workersignout");

async function signUp() {

    let param = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        attributes: {
            email: document.getElementById("username").value,
            profile: document.getElementById("type").value,
            name: document.getElementById("username").value,
            address: "address"
        }
    }
    console.log(param);
    try {
        const { user } = await Auth.signUp(param);
        console.log(document.getElementById("username").value + "Signed up successfully");
    } catch (error) {
        alert(error);
        console.log('error signing up:', error);
    }
}


async function confirmSignUp() {
    try {
        await Auth.confirmSignUp(username, code);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
}


async function signIn() {
    try {
        //alert(document.getElementById("username").value)
        const user = await Auth.signIn(document.getElementById("username").value, document.getElementById("password").value);
        localStorage.setItem('key', document.getElementById("username").value);
        localStorage.setItem("type", document.getElementById("type").value)
    } catch (error) {
        alert(error.message);
        console.log('error signing in', JSON.stringify(error));
    }
}


loginButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    signIn().then((evt) => {
        $("#form-signin").hide();
        if (localStorage.getItem("type").toLowerCase() === "admin") {
            $("main").hide();
            $("#menu").show();
            $("#admincontent").show();
            loadWorkerData();
        } else {
            $("main").hide();
            $("#workercontent").show();
        }
        //MutationResult.innerHTML += `<p>${evt.data} - ${evt.data}</p>`;
    });
});

signupLink.addEventListener("click", (evt) => {
    evt.preventDefault();
    //document.getElementById("login").attr("display", "hide");
    //$("#login").hide()
    signUp().then((evt) => {
        SignupResult.innerHTML += `<p>${evt.data}</p>`;
    });
});

async function signOut() {
    try {
        await Auth.signOut({ global: true });
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

adminsignout.addEventListener("click", (evt) => {
    evt.preventDefault();
    signOut().then((evt) => {
        clear();
    });
});

workersignout.addEventListener("click", (evt) => {
    evt.preventDefault();
    signOut().then((evt) => {
        clear();
    });
});

// -------------------------------------------------------------------------------------------------------------

const getData = async(url) => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        //console.log("GetData - " + JSON.stringify(json));
        return json;
    } catch (error) {
        console.log(error)
    }
}

const post = async(url, body) => {
    try {
        console.log("post - " + url + " post data - " + JSON.stringify(body));
        const response = await fetch(url, body);
        const json = await response.json();
        console.log("post response - " + JSON.stringify(json));
        return json;
    } catch (error) {
        console.log("post err - " + error);
    }
}

/*
(async function() {
    const response = await getData(ENDPOINT_URL + "/users?user_type=A&type=getUsersByType");
    console.log("response  ->" + response)
})();
*/

function loadWorkerData() {
    getData(ENDPOINT_URL + "/users?user_type=A&type=getUsersByType").then((res) => {
        if (res) {
            $('#workerdata').bootstrapTable({
                data: res,
                onClickRow: function(row, $element) {
                    attendanceTabload(row);
                    //alert(JSON.stringify($element))
                }
            });
        }
    });
}

function attendanceTabload(row) {
    clearImg();
    getPhoto(row.id + ".jpg");
    loadAttendanceTime(row);
    $('#attendance-tab').tab('show');
    $("#currentId").val(row.id);
}

function loadAttendanceTime(row) {
    $('#attendancedata').bootstrapTable('destroy');
    $("#attendanceUsr").text("Worker Name: " + row.name);
    //alert(" key -> " + row.id);

    getData(ENDPOINT_URL + "/users?type=getAttendances&id=" + row.id).then((res) => {
        if (res) {
            //alert(JSON.stringify(res));
            $('#attendancedata').bootstrapTable({
                data: res,
                onClickRow: function(row, $element) {
                    //getPhoto(row.id + ".jpg");
                    //alert(row.id)
                    //alert(JSON.stringify($element))
                }
            });
        }
    });
}

function LinkFormatter(value, row, index) {
    return "<a href='" + row.url + "'>" + value + "</a>";
}

function getPhoto(key) {
    document.getElementById("image").src = "data:image/png;base64,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";

    getData(ENDPOINT_URL + "/photos?type=getUserImage&image=" + key).then((res) => {
        //alert("getphoto - " + JSON.stringify(res))

        if (res && res.ContentType && res.data) {
            $("#uploadAphoto").hide();
            $("#newphoto").hide();
            document.getElementById("image").src = "data:" + res.ContentType + ";base64," + res.data;
        } else {
            $("#uploadAphoto").show();
            $("#newphoto").show();
        }
        //return res;
    });
}

var photoUpld = document.getElementById('uploadAphoto');
photoUpld.addEventListener('click', function() {
    var file = document.getElementById("newphoto");
    if (file.files && file.files[0]) {

        imageIsLoaded(file.files[0]).then((res) => {
            console.log(res);
            //alert("Uploaded successfully !")
        });

        /*encodeImageFileAsURL(file.files[0])
            .then((res) => {
                console.log(res);
                alert("Uploaded successfully !")
            });*/
        //img.src = URL.createObjectURL(this.files[0]); // set src to blob url
    } else {
        alert("Please select a photo to proceed");
        $("#newphoto").removeAttr('value');
    }
});

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

//const file = event.srcElement.files[0];
//const imageStr = await fileToBase64(file);

function encodeImageFileAsURL(element) {
    var reader = new FileReader();
    reader.onloadend = function() {
        //console.log('RESULT', reader.result);
        var img = document.getElementById('image');
        img.src = reader.result;
        img.onload = imageIsLoaded(reader.result);
        //imageIsLoaded(reader.result);
        //return reader.result;
    }
    reader.readAsDataURL(element);
}


function getBase64Str(content) {

    let imgSrc = "";
    if (content && content.includes("base64,")) {
        imgSrc = content.substring(content.indexOf("base64,") + 7, content.length - 1);
        //console.log(imgSrc);
    }
    return imgSrc;
}

async function imageIsLoaded(file) {
    const imageStr = await toBase64(file);
    console.log("new func - " + imageStr)
    var img = document.getElementById('image');
    img.src = imageStr;

    let imgSrc = getBase64Str(imageStr);
    var body = {
        "photo": imgSrc,
        "user": $("#currentId").val()
    }

    postData(ENDPOINT_URL + "/photos?type=uploadAndIndexImage&collectionId=blue-star-dorm-collection", body).then((res) => {
        //alert(JSON.stringify("upload res - " + res));
        if (res) {
            console.log(JSON.stringify(res));
            clearImg();
        }
    });
}


function clearImg() {
    document.getElementById('newphoto').value = "";
    $("#uploadAphoto").hide();
    $("#newphoto").hide();
}

async function postData(url = '', data = {}) {
    //console.log("post - " + url + " post data - " + JSON.stringify(data));
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: 'follow', // manual, *follow, error
        //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    //console.log(response);
    console.log(JSON.stringify(response));
    return response.json(); // parses JSON response into native JavaScript objects
}
// -------------------------------------------------------------------------------------------------------------

// Audit ----------

$('a[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
    //alert("id" + e.target.id);
    document.getElementById("newphoto").value = "";
    switch (e.target.id) {
        case "audit-tab":
            {
                generateAccordian();
                break;
            }
    }
});

function generateAccordian() {
    getData(ENDPOINT_URL + "/photos?type=getPrefix").then((res) => {
        //alert("getphoto - " + JSON.stringify(res))
        if (res) {
            var accordianContent = "";
            res.forEach(function(data) {
                //console.log(data.Prefix);
                var id = "id_" + data.Prefix.substring(0, data.Prefix.length - 1);
                var dataId = id + "_data";
                accordianContent += '<div class="accordion-item">' +
                    '<h2 class="accordion-header" id="' + id + '">' +
                    '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' + dataId + '" aria-expanded="false" aria-controls="' + dataId + '">' + data.Prefix +
                    '</button></h2><div id="' + dataId + '" class="accordion-collapse collapse" aria-labelledby="' + id + '" data-bs-parent="#auditData"><div class="accordion-body">DATA</div></div></div>'
                $("#auditData").html(accordianContent);
            })
        } else {
            console.log("Err: cant load audit data !!")
        }
    });
}


function loadS3Content(parentId) {
    var id = parentId.replace("id_", "").replace("_data", "") + "/";
    console.log(id);
    getData(ENDPOINT_URL + "/photos?type=getPrefix&pref=" + id).then((res) => {
        if (res) {
            $("#" + parentId + "_table").bootstrapTable({
                data: res,
                onClickRow: function(row, $element) {
                    //console.log(row);
                    //console.log(JSON.stringify($element));
                    getData(ENDPOINT_URL + "/photos?type=getUserImage&bucket=sg-mes-face-match&image=" + row.Key).then((res) => {
                        $(".modal-body img").attr("src", "data:" + res.ContentType + ";base64," + res.data);
                    });
                    var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
                        keyboard: true
                    });
                    myModal.show();
                }
            });
            console.log(JSON.stringify(res));
        } else {
            console.log("Err: cant load audit pref S3 data !!")
        }
    });
}



var myCollapsible = document.getElementById('auditData')
myCollapsible.addEventListener('shown.bs.collapse', function(event) {
    var tableContent = '<div class="table-responsive-lg" style="margin:4%;"><table id="' + event.target.id + "_table" + '" class="table table-hover" style="width:80%;height: 60%;overflow-y: auto;"><thead><tr><th data-field="Key">Name</th><th data-field="LastModified" data-formatter="dateFormat">Time</th><th data-field="Size" data-formatter="numFormat">Size</th></tr></thead></table></div>'
    $("#" + event.target.id).html(tableContent);
    loadS3Content(event.target.id);

});
// Audit End -------


function clear() {
    $("main").hide();
    $("#form-signin").show();
    localStorage.removeItem("key");
    localStorage.removeItem("type");
}