var aUsers = localStorage.sUsers ? JSON.parse(localStorage.sUsers) : [];
$("#btnSignup").click(function() {
    signup();
    $("#txtFirstName").val("");
    $("#txtLastName").val("");
    $("#txtEmail").val("");
    $("#txtPassword").val("");
    $("#txtRepeatPassword").val("");
});
$("#btnLoginModal").click(function() {
    login();
});
$("btnLogin").click(function() {});
$("#btnLogout").click(function() {
    $("#wdwSimulation").hide();
    $(".navbar").hide();
    $("#txtLegend").hide();
    $("#charts").hide();
    $("#mapmap").hide();
    $("#frontpage").show();
    $(".vegas-background").show();
    $("div.person").remove();
    $("div.building").remove();
});

function login() {
    var sLoginEmail = $("#txtLoginEmail").val();
    var sLoginPass = $("#txtLoginPassword").val();
    sUsers = localStorage.sUsers;
    aUsers = JSON.parse(sUsers);
    //console.log(aUsers[0]);
    //console.log(aUsers);
    var bLogin = false;
    for (var i = 0; i < aUsers.length; i++) {
        if (aUsers[i].sEmail == sLoginEmail && aUsers[i].sPassword == sLoginPass) {
            bLogin = true;
            $("#exampleModal").fadeOut("slow", function() {});
            $("#frontpage").hide();
            $(".vegas-background").hide();
            $("#mapmap").show();
            $("#wdwSimulation").show();
            $(".navbar").show();
            $("#txtLegend").show();
            $("#charts").show();
            break;
        }
    }
    if (bLogin == true) {
        console.log("Logged in.");
    } else {
        $("#wrongLogin").show();
        $("#wrongLogin").html("Wrong password or e-mail address.");
        console.log("Error");
        $("#exampleModal").effect("shake");
    }
}

function signup() {
    var sFirstName = $("#txtFirstName").val();
    var sEmail = $("#txtEmail").val();
    var sLastName = $("#txtLastName").val();
    var sPassword = $("#txtPassword").val();
    var sRepeatPassword = $("#txtRepeatPassword").val();
    // Validate the email. This is a regular expression, you don't need to know it. It just works
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // make sure that the email is a valid email
    // Create a JSON object depicting the user
    var jUser = {};
    jUser.sFirstName = sFirstName;
    jUser.sLastName = sLastName;
    jUser.sEmail = sEmail;
    jUser.sPassword = sPassword;
    // Add the created user to the array
    aUsers.push(jUser);
    // Convert the object array into a string
    sUsers = JSON.stringify(aUsers);
    // Save the string is users into the localstorage
    localStorage.sUsers = sUsers;
};

function getRandomNumber(minNumber, maxNumber) {
    randomNumber = Math.round(Math.random() * maxNumber) + minNumber;
    //console.log(randomNumber);
    return randomNumber;
};

function getDistanceBetweenElements(elementOne, elementTwo) {
    var positionElementOneX = $(elementOne).offset().top + ($(elementOne).width() / 2);
    var positionElementOneY = $(elementOne).offset().left + ($(elementOne).height() / 2);
    var positionElementTwoX = $(elementTwo).offset().top + ($(elementTwo).width() / 2);
    var positionElementTwoY = $(elementTwo).offset().left + ($(elementTwo).height() / 2);
    var distanceX = Math.abs(positionElementOneX - positionElementTwoX);
    var distanceY = Math.abs(positionElementOneY - positionElementTwoY);
    var finalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    return finalDistance;
};

function checkContamination() {
    iSickPeopleCounter = $(".sick").length;
    $(".healthy").each(function() {
        // Only check if the selected element is sick
        var elementOne = $(this);
        $(".sick").each(function() {
            var elementTwo = $(this);
            //console.log(elementTwo);
            // Check if the distance between those 2 elements is less than 50px. If so, make them sick
            var finalDistance = getDistanceBetweenElements(elementOne, elementTwo);
            if (finalDistance < 20 && elementOne.hasClass("healthy")) {
                //console.log("CONTAMINATED");
                iSickPeopleCounter++;
                $(elementOne).removeClass("healthy").addClass("sick");
            }
        });
    });
};
setInterval("checkContamination()", 1000);
setInterval("checkBunkerInteraction()", 500);
setInterval("checkDoctorInteraction()", 1000);
setInterval("checkClinicInteraction()", 1000);
setInterval("checkAirplaneInteraction()", 1000);

function movePerson(oElement) {
    if (oElement.attr("data-move") === "false") {
        return;
    }
    $(oElement).stop(true);
    // Animate the element to a new destination
    var actualXPosition = $(oElement).offset().top;
    var actualYPosition = $(oElement).offset().left;
    var newXPosition = getRandomNumber(155, 750);
    var newYPosition = getRandomNumber(100, 1550);
    // Calculate speed at which the element should move
    var distanceX = Math.abs(actualXPosition - newXPosition);
    var distanceY = Math.abs(actualYPosition - newYPosition);
    var finalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    var normalSpeed = 100;
    var movingSpeed = finalDistance * normalSpeed;
    $(oElement).animate({
        top: newXPosition,
        left: newYPosition
    }, movingSpeed, function() {
        movePerson(oElement);
    });
};
$("#btnStart").click(function() {
    createPeople();
});
$("#btnSave").click(function() {
    saveWorld();
    localStorage.setItem('sPeople', JSON.stringify(aPeople));
    localStorage.setItem('sBuildings', JSON.stringify(aBuildings));
    console.log(aPeople.length);
    aPeople = [];
});
$("#btnLoad").click(function() {
    $("div.person").remove();
    $("div.building").remove();
    loadWorld();
});
$("#btnHelp").click(function() {});

function loadWorld() {
    if (localStorage.sPeople && localStorage.sBuildings == undefined) {
        return false;
    } else {
        sPeople = localStorage.sPeople;
        //sBuildings = localStorage.sBuildings;
        aPeople = JSON.parse(sPeople);
        //sBuildings = JSON.parse(sBuildings);
        for (i = 0; i < aPeople.length; i++) {
            sId = aPeople[i].id;
            sClass = aPeople[i].class;
            sPositionTop = aPeople[i].top;
            sPositionLeft = aPeople[i].left;
            sTheDivPerson = '<div id=' + sId + ' class="' + sClass + '" style="position: absolute; left:' + sPositionLeft + '; top:' + sPositionTop + '"></div>';
            $('body').append(sTheDivPerson);
            //var oElement = $("#person" + sId);
            var oElement = $('#' + sId);
            movePerson(oElement);
        }
        for (i = 0; i < aBuildings.length; i++) {
            sBid = aBuildings[i].id;
            sCid = aBuildings[i].id;
            sPid = aBuildings[i].id;
            sBpositionTop = aBuildings[i].top;
            sBpositionLeft = aBuildings[i].left;
            sCpositionTop = aBuildings[i].top;
            sCpositionLeft = aBuildings[i].left;
            sPpositionTop = aBuildings[i].top;
            sPposotionLeft = aBuildings[i].left;
            $("body").append('<div id=' + sBid + ' class="building bunker" style="position:absolute; height:100px; width:100px; top:' + sBpositionTop + 'px; left:' + sBpositionLeft + 'px; z-index: -1; background-image:url(images/basecamp.png)"></div>');
            $("body").append('<div id=' + sCid + ' class="building clinic" style="position:absolute; height:100px; width:100px; top:' + sCpositionTop + 'px; left:' + sCpositionLeft + 'px; z-index: -1; background-image:url(images/clinic.png)"></div>');
            $("body").append('<div id=' + sPid + ' class="building plane" style="position:absolute; height:70px; width:150px; top:' + sPpositionTop + 'px; left:' + sPposotionLeft + 'px; z-index: -1; background-image:url(images/heli.png)">0</div>');
        }
    }
}
aPeople = [];
aBuildings = [];

function saveWorld() {
    savePeople();
    saveBuildings();
}

function savePeople() {
    $(".sick").each(function() {
        var person = $(this);
        aPeople.push({
            "id": person.attr('id'),
            "class": person.attr('class'),
            "top": person.css('top'),
            "left": person.css('left')
        });
    });
    $(".healthy").each(function() {
        var person = $(this);
        aPeople.push({
            "id": person.attr('id'),
            "class": person.attr('class'),
            "top": person.css('top'),
            "left": person.css('left')
        });
    });
    $(".doctor").each(function() {
        var person = $(this);
        aPeople.push({
            "id": person.attr('id'),
            "class": person.attr('class'),
            "top": person.css('top'),
            "left": person.css('left')
        });
    });
}

function saveBuildings() {
    $(".bunker").each(function() {
        var bunker = $(this);
        aBuildings.push({
            "id": bunker.attr('id'),
            "class": bunker.attr('class'),
            "top": bunker.css('top'),
            "left": bunker.css('left')
        });
    });
    $(".clinic").each(function() {
        var clinic = $(this);
        aBuildings.push({
            "id": clinic.attr('id'),
            "class": clinic.attr('class'),
            "top": clinic.css('top'),
            "left": clinic.css('left')
        });
    });
    $(".plane").each(function() {
        var plane = $(this);
        aBuildings.push({
            "id": plane.attr('id'),
            "class": plane.attr('class'),
            "top": plane.css('top'),
            "left": plane.css('left')
        });
    });
}

function createPeople() {
    for (var i = 0; i < 100; i++) {
        var topPosition = getRandomNumber(155, 750);
        var leftPosition = getRandomNumber(100, 1550);
        // Create random sick people or else healthy people
        var randomNumber = getRandomNumber(0, 100);
        if (randomNumber < 10) {
            $("body").append('<div id="person' + i + '" class="person sick" style="position:absolute; top:' + topPosition + 'px; left:' + leftPosition + 'px" data-state="sick"></div>');
        } else {
            $("body").append('<div id="person' + i + '" class="person healthy" style="position:absolute; top:' + topPosition + 'px; left:' + leftPosition + 'px" data-state="healthy"></div>');
        }
        var oElement = $("#person" + i);
        movePerson(oElement);
    }
};
$("#btnCreateBase").click(function() {
    createBase();
});

function createBase() {
    var baseCount = $("[id^='bunker']").length + 1;
    var topPosition = getRandomNumber(155, 750);
    var leftPosition = getRandomNumber(100, 1550);
    $("body").append('<div id="bunker' + baseCount + '" class="building bunker" style="position:absolute; height:100px; width:100px; top:' + topPosition + 'px; left:' + leftPosition + 'px; z-index: -1; background-image:url(images/basecamp.png)"></div>');
    $(".bunker").draggable();
}
$("#btnCreateClinic").click(function() {
    createClinic();
});

function createClinic() {
    var clinicCount = $("[id^='clinic']").length + 1;
    var topPosition = getRandomNumber(155, 750);
    var leftPosition = getRandomNumber(100, 1550);
    var randomNumber = getRandomNumber(0, 100);
    if (randomNumber < 100) {
        $("body").append('<div id="clinic' + clinicCount + '" class="building clinic" style="position:absolute; height:100px; width:100px; top:' + topPosition + 'px; left:' + leftPosition + 'px; z-index: -1; background-image:url(images/clinic.png)"></div>');
        $(".clinic").draggable();
    }
}
$("#btnCreateDoctor").click(function() {
    createDoctor();
});

function createDoctor() {
    var doctorCount = $("[id^='doctor']").length + 1;
    var topPosition = getRandomNumber(155, 750);
    var leftPosition = getRandomNumber(100, 1550);
    $("body").append('<div id="doctor' + doctorCount + '" class="person doctor" style="position:absolute; top:' + topPosition + 'px; left:' + leftPosition + 'px" data-state="immune"></div>');
    var oElement = $("#doctor" + doctorCount);
    movePerson(oElement);
}
$("#btnCreatePlane").click(function() {
    createPlane();
});

function createPlane() {
    var planeCount = $("[id^='plane']").length + 1;
    var topPosition = getRandomNumber(155, 750);
    var leftPosition = getRandomNumber(100, 1550);
    $("body").append('<div id="plane' + planeCount + '" class="building plane" style="position:absolute; height:70px; width:150px; top:' + topPosition + 'px; left:' + leftPosition + 'px; z-index: -1; background-image:url(images/heli.png)">0</div>');
    $(".plane").draggable();
}

function checkBunkerInteraction() {
    iDeadPeopleCounter = $(".dead").length;
    $(".sick").each(function() {
        var sickPerson = $(this);
        $(".bunker").each(function() {
            var bunker = $(this);
            var distance = getDistanceBetweenElements(sickPerson, bunker);
            if (distance < 100) {
                $(sickPerson).stop();
                $(sickPerson).attr("data-move", "false");
                $(sickPerson).css("background-color", "black");
                $(sickPerson).removeClass("sick").addClass("dead");
                iDeadPeopleCounter++;
            }
        });
    });
}

function checkDoctorInteraction() {
    $(".sick").each(function() {
        var sickPerson = $(this);
        $(".doctor").each(function() {
            var doctorPerson = $(this);
            var distance = getDistanceBetweenElements(sickPerson, doctorPerson);
            if (distance < 100) {
                $(sickPerson).css("background-color", "#0cff00");
                $(sickPerson).removeClass("sick");
                $(sickPerson).addClass("healthy");
            }
        });
    });
}

function checkClinicInteraction() {
    $(".sick").each(function() {
        var sickPerson = $(this);
        $(".clinic").each(function() {
            var clinic = $(this);
            var distance = getDistanceBetweenElements(sickPerson, clinic);
            if (distance < 50) {
                $(sickPerson).css("background-color", "blue");
                $(sickPerson).removeClass("sick");
                $(sickPerson).addClass("immune");
            }
        });
    });
}
var airPlaneCnt = 0;

function checkAirplaneInteraction() {
    $(".healthy").each(function() {
        var healthyPerson = $(this);
        $(".plane").each(function() {
            var plane = $(this);
            var distance = getDistanceBetweenElements(healthyPerson, plane);
            if (distance < 100 && !$(healthyPerson).hasClass("inPlane")) {
                airPlaneCnt += 1;
                $(".plane").html(airPlaneCnt);
                $(healthyPerson).addClass("inPlane");
                $(healthyPerson).stop();
                $(healthyPerson).attr("data-move", "false");
                $(".plane").append($(healthyPerson));
                $(healthyPerson).removeAttr("style");
            }
        });
    });
    if (airPlaneCnt >= 20) {
        $(".plane").animate({
            left: 3000
        }, 5000);
        airPlaneCnt = 0;
    }
}
$(document).ready(function() {
    $("#commentForm").validate({
        rules: {
            firstName: {
                required: true,
                maxlength: 12
            },
            lastName: {
                required: true,
                maxlength: 12
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5,
                maxlength: 12,
            },
            repeat_password: {
                required: true,
                minlength: 5,
                maxlength: 12,
                equalTo: "#txtPassword"
            },
            ignore: "",
            onkeyup: true,
            onblur: true
        },
        messages: {
            firstName: {
                required: "Please enter your first name",
            },
            lastName: {
                required: "Please enter your last name",
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters",
                maxlength: "Your password must not exceed 12 characters"
            },
            repeat_password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters",
                maxlength: "Your password must not exceed 12 characters",
                equalTo: "Passwords do not match!"
            },
            email: "Please enter a valid e-mail address"
        }
    });
});