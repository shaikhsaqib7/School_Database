 var jpdbIml = "/api/iml";
                var jpdbBaseUrl = "http://api.login2explore.com:5577";
                var jpdbIrl = "/api/irl";
                var connToken = "90932318|-31949271179263031|90954091";
                var dbName = "SCHOOL-DB";
                var relName = "STUDENT-Table";

                $("#Roll_No").focus();

                function getRollAsJsonObj() {
                    var rollno = $("#Roll_No").val();
                    var jsonStr = {
                        Roll_No: rollno
                    };
                    return JSON.stringify(jsonStr);
                }

                function saveRecno2LS(jsonObj) {
                    var lvData = JSON.parse(jsonObj.data);
                    localStorage = setItem("recno", lvData.rec_no);
                }

                function fillData(jsonObj) {
                    saveRecno2LS(jsonObj);
                    var record = JSON.parse(jsonObj.data).record;
                    $("#Roll_No").val(record.Roll_No);
                    $("#Full_Name").val(record.Full_Name);
                    $("#Class").val(record.Class);
                    $("#Birth_Date").val(record.Birth_Date);
                    $("#Address").val(record.Address);
                    $("#Enrollment_Date").val(record.Enrollment_Date);
                }




                function validateAndGetFormData() {
                    var rollno, fname, cls, birthdate, enrollmentdate, address;
                    rollno = $("#Roll_No").val();
                    fname = $("#Full_Name").val();
                    cls = $("#Class").val();
                    birthdate = $("#Birth_Date").val();
                    address = $("#Address").val();
                    enrollmentdate = $("#Enrollment_Date").val();
                    if (rollno === "") {
                        alert("Roll Number is Required Value");
                        $("#Roll_No").focus();
                        return "";
                    }
                    if (fname === "") {
                        alert("Full Name is Required Value");
                        $("#Full_Name").focus();
                        return "";
                    }
                    if (cls === "") {
                        alert("Class is Required Value");
                        $("#Class").focus();
                        return "";
                    }
                    if (birthdate === "") {
                        alert("Birth Date is Required Value");
                        $("#Birth_Date").focus();
                        return "";
                    }
                    if (address === "") {
                        alert("Address is Required Value");
                        $("#Address").focus();
                        return "";
                    }
                    if (enrollmentdate === "") {
                        alert("Enrollment Date is Required Value");
                        $("#Enrollment_Date").focus();
                        return "";
                    }

                    var jsonStrObj = {
                        rollno: rollno,
                        fname: fname,
                        class: cls,
                        birthdate: birthdate,
                        address: address,
                        enrollmentdate: enrollmentdate
                    };
                    return JSON.stringify(jsonStrObj);
                }

                function createPUTRequest(connToken, jsonStrObj, dbName, relName) {
                    var putRequest = "{\n" + "\"token\" : \""
                            + connToken
                            + "\","
                            + "\"dbName\":\""
                            + dbName
                            + "\",\n" + "\"cmd\":\"PUT\",\n"
                            + "\"rel\":\""
                            + relName + "\","
                            + "\"jsonStr\":\n"
                            + jsonStrObj
                            + "\n"
                            + "}";
                    return putRequest;
                }

                function submit_Form() {
                    var jsonStrObj = validateAndGetFormData();
                    if (jsonStrObj === "") {
                        return "";
                        alert("Student added to Database");
                    }
                    var putReqStr = createPUTRequest(connToken,
                            jsonStrObj, dbName, relName);
                    alert(putReqStr);
                    jQuery.ajaxSetup({async: false});
                    var resJsonObj = executeCommandAtGivenBaseUrl(putReqStr,
                            jpdbBaseUrl, jpdbIml);
                    alert(JSON.stringify(resJsonObj));
                    jQuery.ajaxSetup({async: true});
                    resetForm();
                    $("#Roll_No").focus();
                }


                function executeCommandAtGivenBaseUrl(reqString, jpdbBaseUrl, apiEndPointUrl) {
                    var url = jpdbBaseUrl + apiEndPointUrl;
                    var jsonObj;
                    $.post(url, reqString, function (result) {
                        jsonObj = JSON.parse(result);
                    }).fail(function (result) {
                        var dataJsonObj = result.responseText;
                        jsonObj = JSON.parse(dataJsonObj);
                    });
                    return jsonObj;
                }
                function resetForm(get) {
                    $("#Roll_No").value = ("");
                    $("#Full_Name").value("");
                    $("#Class").value("");
                    $("#Birth_Date").value("");
                    $("#Address").value("");
                    $("#Enrollment_Date").value("");
                    $("#Roll_No").prop("disabled", false);
                    $("#Submit").prop("disabled", true);
                    $("#Change").prop("disabled", true);
                    $("#Roll_No").focus();
                }

                function change() {
                    $("#Change").prop('disabled', true);
                    jsonChg = validateAndGetFormData();
                    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, dbName, relName, localStorage.getItem("recno"));
                    jQuery.ajaxSetup({async: false});
                    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIml);
                    jQuery.ajaxSetup({async: true});
                    console.log(resJsonObj);
                    resetForm();
                    $("#Roll_No").focus();
                }
                function getRoll() {
                    var RollJsonObj = getRollAsJsonObj();
                    var getRequest = createGet_By_KeyRequest(connToken, dbName, relName, RollJsonObj);
                    jQuery.ajaxSetup({async: false});
                    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIrl);
                    jQuery.ajaxSetup({async: true});
                    if (resJsonObj.status === 400) {
                        $("#Submit").prop("disabled", false);
                        $("#Reset").prop("disabled", false);
                        $("#Full_Name").focus();
                    } else if (resJsonObj.status === 200) {
                        $("#Roll_No").prop("disabled", true);
                        fillData(resJsonObj);
                        $("#Change").prop("disabled", false);
                        $("#Reset").prop("disabled", false);
                        $("#Full_Name").focus();
                    }
                    console.log(resJsonObj);
                    resetForm();
                    $("#Roll_No").focus();
                }

                function createUPDATERecordRequest(token, jsonObj, dbName, relName, recNo)
                {
                    var req = "{\n"
                            + "\"token\" : \""
                            + connToken
                            + "\","
                            + "\"dbName\": \""
                            + dbName
                            + "\",\n" + "\"cmd\" : \"UPDATE\",\n"
                            + "\"rel\" : \""
                            + relName
                            + "\",\n"
                            + "\"jsonStr\":{ \""
                            + recNo
                            + "\":\n"
                            + jsonObj
                            + "\n"
                            + "}}";
                    return req;
                }


                function createGET_BY_KEYRequest(connToken, dbName, relName, jsonObjStr, createTime, updateTime) {
                    if (createTime !== undefined) {
                        if (createTime !== true) {
                            createTime = false;
                        }
                    } else {
                        createTime = false;
                    }
                    if (updateTime !== undefined) {
                        if (updateTime !== true) {
                            updateTime = false;
                        }
                    } else {
                        updateTime = false;
                    }
                    var value1 = "{\n"
                            + "\"token\" : \""
                            + connToken
                            + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
                            + "\"dbName\": \""
                            + dbName
                            + "\",\n"
                            + "\"rel\" : \""
                            + relName
                            + "\",\n"
                            + "\"jsonStr\":\n"
                            + jsonObjStr
                            + "\,"
                            + "\"createTime\":"
                            + createTime
                            + "\,"
                            + "\"updateTime\":"
                            + updateTime
                            + "\n"
                            + "}";
                    return value1;
                }