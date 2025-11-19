/*
Author: Carlo Dominguez
1/31/2023
this is for utilities
modals,forms,utilities
*/

const myIp = `https://vantaztic-api-onrender.onrender.com`
//const myIp = "http://192.168.62.221:10000"


const requirements = document.querySelectorAll(".requirements")
const specialChars = "!@#$%^&*()-_=+[{]}\\| :'\",<.>/?`~"
const numbers = "0123456789"
let db = window.localStorage
let oldpwd = document.querySelector(".p1")
let nupwd = document.querySelector(".p2")
let lengBoolean, bigLetterBoolean, numBoolean, specialCharBoolean 
let leng = document.querySelector(".leng") 
let bigLetter = document.querySelector(".big-letter") 
let num = document.querySelector(".num") 
let specialChar = document.querySelector(".special-char") 
//speech synthesis
const synth = window.speechSynthesis
let xloginmodal,
	xequipmentmodal,
    xequipmenttagmodal
let voices = []
//first init delete all localstorage
db.clear()
let util ={
	scrollsTo:(cTarget)=>{
		const elem = document.getElementById(cTarget)
		elem.scrollIntoView()
	},
    //=========================START VOICE SYNTHESIS ===============
    getVoice: async ()=>{
        voices = await synth.getVoices()
        console.log( 'GETVOICE()')
        voices.every(value => {
            if(value.name.indexOf("English")>-1){
                console.log( "bingo!-->",value.name, value.lang )
            }
        })
    },//end func getvoice
    //speak method
    speak:(theMsg)=> {
        console.log("SPEAK()")
        // If the speech mode is on we dont want to load
        // another speech
        if(synth.speaking) {
            //alert('Already speaking....');
            return;
        }	
        const speakText = new SpeechSynthesisUtterance(theMsg);
        // When the speaking is ended this method is fired
        speakText.onend = e => {
            //console.log('Speaking is done!');
        };
        // When any error occurs this method is fired
        speakText.error = e=> {
            console.error('Error occurred...');
        };
        // Checking which voices has been chosen from the selection
        // and setting the voice to the chosen voice
        voices.forEach(voice => {
            if(voice.name.indexOf("English")>-1){	
                ///// take out bring back later, 
                //console.log("speaking voice is ",voice.name)
                speakText.voice = voice
            }
        });
        // Setting the rate and pitch of the voice
        speakText.rate = 1
        speakText.pitch = 1
        // Finally calling the speech function that enables speech
        synth.speak(speakText)
    },//end func speak	
    //=======================END VOICE SYNTHESIS==========
    //===================== MESSENGER=================
    alertMsg:(msg,type,xmodal)=>{
        //where? login or signup modal?
        const alertPlaceholder = document.getElementById(xmodal)
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
          `<div class="alert alert-${type} alert-dismissible" role="alert">`,
          `   <div>${msg}</div>`,
          '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
          '</div>'
        ].join('')
        //new osndp
        alertPlaceholder.innerHTML=""
        alertPlaceholder.append(wrapper)
    },//=======alert msg
    
    // Toast: (msg,nTimeOut)=> {
    //     // Get the snackbar DIV
    //     var x = document.getElementById("snackbar");
    //     x.innerHTML=msg
    //     // Add the "show" class to DIV
    //     x.className = "show";
    //     // After 3 seconds, remove the show class from DIV
    //     setTimeout(function(){ 
    //         x.className = x.className.replace("show", "hid"); 
    //     }, nTimeOut);
    // },

    //===============END MESSENGER ===================
    //==============FORM FUNCS ===========
    clearBox:function(){
        let reset_input_values = document.querySelectorAll("input[type=text]") 
        for (var i = 0; i < reset_input_values.length; i++) { //minus 1 dont include submit bttn
            reset_input_values[i].value = ''
        }
    },
    //remove all form class
    resetFormClass:(frm)=>{
        const forms = document.querySelectorAll(frm)
        const form = forms[0]
        Array.from(form.elements).forEach((input) => {
            input.classList.remove('was-validated')
            input.classList.remove('is-valid')
            input.classList.remove('is-invalid')
        })
    },
    //==========FOR ALL THE DATA ENTRY FORM LOAD THIS FIRST TO BE ABLE TO BE VALIDATED ===//
	loadFormValidation:(eHashFrm)=>{

        console.log('===util.loadFormValidation()==', eHashFrm)
		let aForms = [eHashFrm] 
        let aFormx

		//loop all forms
		aForms.forEach( (element) => {
			aFormx = document.querySelectorAll(element)
			//console.log(aFormx[0])
			if(aFormx){
				let aFormz = aFormx[0]
				//console.log(aFormz.innerHTML)
				Array.from(aFormz.elements).forEach((input) => {
			
					if(!input.classList.contains('p1') &&
						!input.classList.contains('p2')){//process only non-password field
							input.addEventListener('keyup',(e)=>{
								if(input.checkValidity()===false){
									input.classList.remove('is-valid')
									input.classList.add('is-invalid')
									e.preventDefault()
									e.stopPropagation()

								} else {
									input.classList.remove('is-invalid')
									input.classList.add('is-valid')
								} //eif
							},false)

							input.addEventListener('blur',(e)=>{

								if(input.checkValidity()===false){
									input.classList.remove('is-valid')
									input.classList.add('is-invalid')
									e.preventDefault()
									e.stopPropagation()

								} else {
									input.classList.remove('is-invalid')
									input.classList.add('is-valid')
								} //eif
							},false)
					}else{ //=== if input contains pssword field
						if(input.classList.contains('p1')){
							if(eModal=="signupModal"){
								util.passwordCheck(input,passwordAlert)        
							}
						}else{
							util.passwordFinal(input)
						}
						
					}//else password field

				}) //end all get input
			}
		})///=====end loop form to get elements	
	},
    //==========WHEN SUBMIT BUTTON CLICKED ==================
    validateMe: async (frmModal,frm,classX)=>{
        const forms = document.querySelectorAll(frm)
        const form = forms[0]
        let aValid=[]
        Array.from(form.elements).forEach((input) => {
            if(input.classList.contains(classX)){
                aValid.push(input.checkValidity())
                if(input.checkValidity()===false){
					console.log(input)
                    input.classList.add('is-invalid')
                }else{
                   input.classList.add('is-valid')
                }
            }
        })
        if(aValid.includes(false)){
            console.log('don\'t post')
            return false
        }else{
            //getform data for posting
            const mydata = document.getElementById(frm.replace('#',''))
            let formdata = new FormData(mydata)
            let objfrm = {},remarks
            //// objfrm.grp_id="1" <-- if u want additional key value
            for (var key of formdata.keys()) {
                if(key=="pw2"){
                    //console.log('dont add',key)
                }else{
                   objfrm[key] = formdata.get(key);
                }
            }
            objfrm.date_reg = util.getDate()
            //console.log('post this',frm,objfrm)
            //=== POST NA!!!
            switch(frm){
                case '#loginForm':
                    //reset cookie first
                    util.setCookie(`the_voice`,null,1)
                    util.setCookie('fname',null,1)
                    util.setCookie('pic',null,1)
                    util.setCookie('approver_type',null,1)
                    util.setCookie('ip_addy',null,1)
                        //util.Toast('System Ready', 2000)
                    util.alertMsg('Searching Database...','warning','loginPlaceHolder')
                    setTimeout(function(){
                        document.getElementById('loginPlaceHolder').innerHTML="";
                    }, 10000);
                    //// orig -> util.loginPost(frm,frmModal,${admin.myIp}/loginpost/${objfrm.user_name}/${objfrm.password}`)
                    //pang test -> 
                    //util.loginPost(frm,frmModal,${admin.myIp}/loginpost/${objfrm.user_name}/${objfrm.password}`)
                    //then login
                    util.loginPost(frm,frmModal,`${myIp}/loginpost/${objfrm.uid}/${objfrm.pwd}`)
                break
				case "#equipmentForm":
                    const isave = document.getElementById('i-save')
                    const btnsave = document.getElementById('eqpt-save-btn')
                    isave.classList.remove('fa-floppy-o')
                    isave.classList.add('fa-refresh')
                    isave.classList.add('fa-spin')
                    btnsave.disabled = true
                    //remarks = objfrm.remarks.replace(/\s/gm," ")
                    //clear all Enter Character from remarks and replace with 'space'
                    //objfrm.remarks = remarks
					util.equipmentPost(frm,frmModal,`${myIp}/equipmentpost/${util.formatDate()}`,objfrm )
                    console.log('==posting eqpmnt ==',objfrm);
				break;
                case '#equipmentTagForm':
                    console.log('== posting tag now')
                    const itagsave = document.getElementById('i-tag-save')
                    const btntagsave = document.getElementById('tag-save-btn')
                    itagsave.classList.remove('fa-floppy-o')
                    itagsave.classList.add('fa-refresh')
                    itagsave.classList.add('fa-spin')
                    btntagsave.disabled = true
                  
                    //===tag post first
                    util.equipmentTagPost(frm,frmModal,`${myIp}/equipmenttagpost`,objfrm )
                    
                    /*
                    await (function() {
                        return new Promise((resolve, reject) => {
                          setTimeout(function() {
                            console.log("One: Completed");
                            resolve();
                          }, 1000);
                        })
                    })()
                    */
                break
            }
        }
    },
    //======post check / dep slip      
    imagePost: async()=>{
            //upload pic of tagged euqipment
            const myInput = document.getElementsByName('uploaded_file')[0]
            console.log('myinput', myInput.files[0])
            const formData = new FormData();
            formData.append('file', myInput.files[0]);     
            ////console.log(formData)
            // Later, perhaps in a form 'submit' handler or the input's 'change' handler:
            await fetch('${myIp}/postimage', {
            method: 'POST',
            body: formData,
            })
            .then( (response) => {
                return response.json() // if the response is a JSON object
            })
            .then( (data) =>{
                console.log('SUCCESS')
            })
             // Handle the success response object
            .catch( (error) => {
                console.log(error) // Handle the error response object
            });
            return true
    },
    //===tagging equipment for rent/sale
    equipmentTagPost: async (frm,modal,url="",xdata={}) =>{
        console.log(xdata)
        fetch(url,{
            method:'PUT',
            //cache:'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(xdata)
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            if(data.status){
                console.log('=== util.equipmenttagpost() done === ')
                console.log('=== calling image attachment upload === ')

                //reset cart
                admin.shopCart.length = 0

                const uploadbtn = document.getElementById('upload-btn')
                uploadbtn.click()
                
                console.log('=======speaking now====', data)
                util.speak(data.voice)        
                //send message to super users
                const sendmsg = {
                    msg: data.approve_voice,
                    type: data.transaction     
                }
                //remind super users
                admin.socket.emit('admin', JSON.stringify(sendmsg))
            }else{
                util.speak(data.voice)

                const itagsave = document.getElementById('i-tag-save')
                const btntagsave = document.getElementById('tag-save-btn')
                itagsave.classList.add('fa-floppy-o')
                itagsave.classList.remove('fa-refresh')
                itagsave.classList.remove('fa-spin')
                btntagsave.disabled = false
                
                alert(data.message)
                
                  
                
                //====temporary lang to carlo ha coz of uniquue PO dont close the modal if error so they  can  change
                // admin.shopCart.length = 0//reset shopcart

                // util.hideModal('equipmentTagModal',2000)//then close form    
                // admin.filterBy()
                return false
            }
            //admin.filterBy() //reload admin.getall()
            //location.href='/admin'
        })
        .catch((error) => {
           // util.Toast(`Error:, ${error}`,1000)
            //console.error('Error:', error)
        })
        return true
    },
    //==== for login posting
    loginPost:async function(frm,modal,url="") {
        fetch(url,{
            cache:'reload'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            //close ModalBox
            if(data.found){
                    console.log('pasok na')
                    util.alertMsg(data.message,'success','loginPlaceHolder')
                    //hide modalbox
                    util.hideModal('loginModal',2000)    
                    //add to locstorage
                    const logData = {
                        email: data.email,
                        full_name: data.full_name,
                        grp_id: data.grp_id,
                        voice : data.voice 
                    }
                    console.log('**logdata**', logData )
                    //set cookie
                    util.setCookie(`the_voice`,data.the_voice,1)
                    util.setCookie('fname',data.fname,1)
                    util.setCookie('pic',data.pic,1)
                    util.setCookie('grp_id',data.grp_id,1)
                    util.setCookie('approver_type',data.approver_type,1)
                    util.setCookie('ip_addy',data.ip_addy,1)

                    if(data.grp_id=="2"){
                        console.log('new merrylle')
                        window.location.replace(`/admin`)
                    }else if( data.grp_id=="1" || data.grp_id=="0"){
                        console.log('OTP PLS...')   
                        /*  take out otp
                        util.otpemail = data.email
                        util.sendotp(${admin.myIp}/sendotp/${data.email}/${data.fname}`)
                       */
                        ////window.location.replace( `/dashboard` )
                        window.location.replace( `/main` )

                        //location.href = 'https://vantaztic.com/app/dashboard.html'
                    }
                    return true
            }else{
                util.speak(data.voice)
                util.alertMsg(data.message,'warning','loginPlaceHolder')
                console.log('notfound',data.message)
                return false
            }
        })
        .catch((error) => {
            util.alertMsg('LOGIN ERROR!','danger','loginPlaceHolder')
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })
        return true
    },
    //equipment posting 
    equipmentPost:async (frm,modal,url="",xdata={})=>{
        fetch(url,{
            method:'POST',
            //cache:'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(xdata)
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            if(data.status){
                util.speak(data.voice);
                //util.Toast(data.message,2000)
                 //send message to super users
                const sendmsg = {
                    msg: data.approve_voice,
                    type:""    
                }
                //remind super users
                admin.socket.emit('admin', JSON.stringify(sendmsg))
                ////util.alertMsg(data.message,'success','equipmentPlaceHolder')
                //hide modalbox
                util.hideModal('equipmentModal',2000)    

                admin.filterBy() ///getAll() // update tables and speak
                //util.Toast(data.message,2000)
            }else{
                util.speak(data.voice)
                util.alertMsg(data.message,'warning','equipmentPlaceHolder')
                return false
            }//eif
        })
        .catch((error) => {
        // util.Toast(`Error:, ${error.message}`,1000)
        console.error('Error:', error)
        })
        return true
    },
    //==== delete wrong entery
    //===== for signup posting
    signupPost:async function(frm,modal,url="",xdata={}){
        let continue_email = true
        fetch(url,{
            method:'POST',
            //cache:'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(xdata)
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            //
            if(data.status){
                continue_email=true
				//util.speak( data.message )
                util.alertMsg(data.message,'success','signupPlaceHolder')
                util.alertMsg("Mailing "+util.UCase(xdata.full_name),'info','signupPlaceHolder')
            }else{
				//util.speak(data.message)
                continue_email=false
                util.alertMsg(data.message,'warning','signupPlaceHolder')
                return false
            }//eif
        })
        .finally(() => {
            if(continue_email){
				//util.speak('Emailed Successfully!')
                util.signupMailer(`/signupmailer/${util.UCase(xdata.full_name)}/${xdata.email}/${encodeURIComponent(window.location.origin)}`)
            }//eif
        })
        .catch((error) => {
           // util.Toast(`Error:, ${error.message}`,1000)
           console.error('Error:', error)
        })
        return true
    },
    //===passwordcheck
    passwordCheck:(pwd,pAlert)=>{
        requirements.forEach((element) => element.classList.add("wrong")) 
        //on focus show alter
        pwd.addEventListener('focus',(e)=>{
            pAlert.classList.remove("d-none") 
            if (!pwd.classList.contains("is-valid")) {
                pwd.classList.add("is-invalid") 
            }
            console.log('util focus')
        },false)
        //if blur, hide alert
        pwd.addEventListener("blur", () => {
            pAlert.classList.add("d-none") 
        },false) 
        //as the user types.. pls check 
        pwd.addEventListener('input',(e)=>{
            if(nupwd.value!==""){
                if(nupwd.value!==pwd.value){
                    nupwd.classList.remove("is-valid")
                    nupwd.classList.add("is-invalid")
                }
            }
            util.pwdChecker(pwd,pAlert)
        },false)
    }, //end func
    pwdChecker:(password,passwordAlert)=>{
        //check length first
        let value = password.value 
        if (value.length < 6) {
            lenBool = false 
        } else if (value.length > 5) {
            lenBool = true 
        }
        if (value.toLowerCase() == value) {
            bigLetterBoolean = false 
        } else {
            bigLetterBoolean = true 
        }
        numBoolean = false 
        for (let i = 0;  i < value.length ; i++) {
            for (let j = 0;  j < numbers.length ; j++) {
                if (value[i] == numbers[j]) {
                    numBoolean = true 
                }
            }
        }
        specialCharBoolean = false 
        for (let i = 0 ; i < value.length;  i++) {
            for (let j = 0 ; j < specialChars.length ; j++) {
                if (value[i] == specialChars[j]) {
                    specialCharBoolean = true 
                }
            }
        }
        //conditions
        if (lenBool == true &&
            bigLetterBoolean == true && 
            numBoolean == true && 
            specialCharBoolean == true) {
            password.classList.remove("is-invalid") 
            password.classList.add("is-valid") 
            requirements.forEach((element) => {
                element.classList.remove("wrong") 
                element.classList.add("good") 
            }) 
            passwordAlert.classList.remove("alert-warning") 
            passwordAlert.classList.add("alert-success") 
        } else {
            password.classList.remove("is-valid") 
            password.classList.add("is-invalid") 
            passwordAlert.classList.add("alert-warning") 
            passwordAlert.classList.remove("alert-success") 
            if (lenBool == false) {
                leng.classList.add("wrong") 
                leng.classList.remove("good") 
            } else {
                leng.classList.add("good") 
                leng.classList.remove("wrong") 
            }
            if (bigLetterBoolean == false) {
                bigLetter.classList.add("wrong") 
                bigLetter.classList.remove("good") 
            } else {
                bigLetter.classList.add("good") 
                bigLetter.classList.remove("wrong") 
            }
            if (numBoolean == false) {
                num.classList.add("wrong") 
                num.classList.remove("good") 
            } else {
                num.classList.add("good") 
                num.classList.remove("wrong") 
            }
            if (specialCharBoolean == false) {
                specialChar.classList.add("wrong") 
                specialChar.classList.remove("good") 
            } else {
                specialChar.classList.add("good") 
                specialChar.classList.remove("wrong") 
            }                        
        }//eif lengbool
    },///======end func checker
    //==========field 2 password validator
    passwordFinal:(pwd)=>{
        //on focus show alter
        pwd.addEventListener('focus',(e)=>{
            if (!pwd.classList.contains("is-valid")) {
                pwd.classList.add("is-invalid") 
            }
        },false)
        //if blur, hide alert
        pwd.addEventListener("blur", () => {
            console.log('p2 blur')
        },false) 
        pwd.addEventListener("input", () => {
            if(pwd.value == oldpwd.value){
                pwd.classList.remove("is-invalid") 
                pwd.classList.add("is-valid") 
            }else{
                if(pwd.classList.contains("is-valid")){
                    pwd.classList.remove("is-valid") 
                    pwd.classList.add("is-invalid") 
                }
            }
        },false) 
    },///// ========end password field 2 checker
    //===============END FORMS ==========//
    //====================UTILITIES ==============
    UCase:function(element){
        return element.toUpperCase()
    },
    //===== addto cart
	xaddtocart:()=>{
		//db.clear()//clear shopcart
		let cart = util.checklogin()
		//console.log(cart)
		if(cart==""||cart==null){
			util.alertMsg('Please Sign up then Login before you purchase a domain.','warning','warningPlaceHolder')    
		}else{
			//if all is good add to cart
			//console.log('==UY LOGGED==== ', dns_existing, searched_dns)
			if(dns_existing===false){
				let orders = {
					domain: searched_dns,
					amount: 10,
					email : cart.email
				}
				//===add to cart domain
				let tebingOrder = db.setItem("tebinglane-order",JSON.stringify(orders))
				//show for pay
				util.modalShow('paymentmodal')
			}//Eif
			//
		}
		console.log('hey adding to cart')
	},
	//check first if logged
	checklogin:()=>{
		let tebingUser = db.getItem("tebinglane-user")
		return JSON.parse(tebingUser)
	},
	setCookie : (c_name,value,exdays) => {
		//console.log('bagong setcookie');
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null)
			? "" : "; expires="+exdate.toUTCString())
			+ "; path=/";
		document.cookie=c_name + "=" + c_value;	
	},//eo setcookie
	getCookie : (c_name) => {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++)
		  {
		  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		  x=x.replace(/^\s+|\s+$/g,"");
		  if (x==c_name)
			{
			return unescape(y);
			}
		  }
	},
	//==========================END UTILITIES =======================
    //====================== CREATE DATE/SERIAL CODE==========================
    getDate:()=>{
        var today = new Date() 
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()
        today = mm + '-' + dd + '-' + yyyy
        return today
    },
    formatDate2:(xdate)=>{
        today = new Date(xdate)
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()
        today = mm+'/'+dd+'/'+yyyy
        return today
    },
    formatDate:()=>{
        var today = new Date() 
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()
        today = yyyy+ '-' + mm + '-' + dd
        return today
    },
    addCommas: (nStr)=> {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    Codes:()=>{
		var today = new Date() 
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()
		var hh = String( today.getHours()).padStart(2,'0')
		var mmm = String( today.getMinutes()).padStart(2,'0')
		var ss = String( today.getSeconds()).padStart(2,'0')
        today = "VAN"+yyyy+mm+dd+hh+mmm+ss
        return today
	},
	//====================== END CREATE DATE/SERIAL CODE==========================
    //=======================MODALS ====================
    loadModals:(eModal, eModalFrm, eHashModalFrm, eModalPlaceHolder)=>{
        //off keyboard cofig
        const configObj = { keyboard: false, backdrop:'static' }
        // get event
        //login event
        if(eModal == "loginModal"){
            xloginmodal =  new bootstrap.Modal(document.getElementById(eModal),configObj);
            let loginModalEl = document.getElementById(eModal)
            loginModalEl.addEventListener('hide.bs.modal', function (event) {
                //clear form
                let xform = document.getElementById(eModalFrm)
                xform.reset()
                util.resetFormClass(eHashModalFrm)
                //take away alert
                let cDiv = document.getElementById(eModalPlaceHolder)
                cDiv.innerHTML=""
                // do something...
                //console.log('LOGIN FORM EVENT -> ha?')
            },false)
        } //eif loginmodal
        if(eModal == "equipmentModal"){
            console.log('===equipment modal====')
            xequipmentmodal =  new bootstrap.Modal(document.getElementById(eModal),configObj);
            //equipment 
            let equipmentModalEl = document.getElementById(eModal)
            equipmentModalEl.addEventListener('show.bs.modal', function (event) {
                document.getElementById('serial').value= util.Codes() 
            },false)
            equipmentModalEl.addEventListener('hide.bs.modal', function (event) {
                 //clear form
                 let xform = document.getElementById(eModalFrm)
                 xform.reset()
                 util.resetFormClass(eHashModalFrm)
                //take away alert
                const cDiv = document.getElementById('equipmentPlaceHolder')
                cDiv.innerHTML=""
                //after posting bring back btn
                const isave = document.getElementById('i-save')
                const btnsave = document.getElementById('eqpt-save-btn')
                btnsave.disabled = false
                isave.classList.remove('fa-spin')
                isave.classList.remove('fa-refresh')
                isave.classList.add('fa-floppy-o')
                ////// take out muna admin.fetchBadgeData()
                //admin.getAll() //first time load speak
                // do something...
                //console.log('LOGIN FORM EVENT -> ha?')
            },false)       
        }//eif equipmentmodal
        //equipment tag modal
        if(eModal == "equipmentTagModal"){
            //console.log('loadModals(equpmentTagModal)')
            xequipmenttagmodal =  new bootstrap.Modal(document.getElementById(eModal),configObj);
            //equipment 
            let equipmentTagModalEl = document.getElementById(eModal)
            equipmentTagModalEl.addEventListener('show.bs.modal', function (event) {
               console.log('uyyy showing ')
            },false)
            equipmentTagModalEl.addEventListener('hide.bs.modal', function (event) {
                 //clear form
                 let xform = document.getElementById(eModalFrm)
                 xform.reset()
                 util.resetFormClass(eHashModalFrm)
                //take away alert
                const cDiv = document.getElementById('equipmentTagPlaceHolder')
                cDiv.innerHTML=""
                //after posting bring back btn
                const itagsave = document.getElementById('i-tag-save')
                const btntagsave = document.getElementById('tag-save-btn')
                btntagsave.disabled = false
                itagsave.classList.remove('fa-spin')
                itagsave.classList.remove('fa-refresh')
                itagsave.classList.add('fa-floppy-o')
               //// takeout muna  admin.fetchBadgeData()
            },false)       
        }//eif equipmentTagModal
        
        //================login,equipment andsignup  listener
        let aForms = [eHashModalFrm] 
        let aFormx
        // console.log(input.classList)
        if(eModal=="signupModal"){
            let passwordAlert = document.getElementById("password-alert");
        }


        //loop all forms
        aForms.forEach( (element) => {
            aFormx = document.querySelectorAll(element)
            //console.log(aFormx[0])
            if(aFormx){
                let aFormz = aFormx[0]
                //console.log(aFormz.innerHTML)
                Array.from(aFormz.elements).forEach((input) => {
                    if(!input.classList.contains('p1') &&
                        !input.classList.contains('p2')){//process only non-password field
                            input.addEventListener('keyup',(e)=>{
                                if(input.checkValidity()===false){
                                    input.classList.remove('is-valid')
                                    input.classList.add('is-invalid')
                                    e.preventDefault()
                                    e.stopPropagation()
                                } else {
                                    input.classList.remove('is-invalid')
                                    input.classList.add('is-valid')
                                } //eif
                            },false)
                            input.addEventListener('blur',(e)=>{
                                if(input.checkValidity()===false){
                                    input.classList.remove('is-valid')
                                    input.classList.add('is-invalid')
                                    e.preventDefault()
                                    e.stopPropagation()
                                } else {
                                    input.classList.remove('is-invalid')
                                    input.classList.add('is-valid')
                                } //eif
                            },false)
                    }else{ //=== if input contains pssword field
                        if(input.classList.contains('p1')){
                            if(eModal=="signupModal"){
                                util.passwordCheck(input,passwordAlert)        
                            }
                        }else{
                            util.passwordFinal(input)
                        }
                    }//else password field
                }) //end all get input
            }
        })///=====end loop form to get elements
    },
    //hide modal box
    hideModal:(cModal,nTimeOut)=>{
        setTimeout(function(){ 
            const myModalEl = document.getElementById(cModal)
            let xmodal = bootstrap.Modal.getInstance(myModalEl)
            xmodal.hide()
        }, nTimeOut)
    },
    //show modal box
    modalShow:(formtoShow)=>{
        switch( formtoShow ){
            case "loginmodal":
                xloginmodal.show()    
            break
			case "equipmentmodal":
                xequipmentmodal.show()    
            break
			case "equipmenttagmodal":
                xequipmenttagmodal.show()    
            break
            case "imageModal":
            break
        }
    },
    //======================END MODALS====================
    //===========STRIPE PAY ===========
    paymentInsert:()=>{
		const iframer = document.getElementById( "payframe" )
		const wrapper = document.createElement('div')
		wrapper.innerHTML = [
			'<iframe width="100%" height="100%" border=0 class="embed-responsive-item" src="checkout2.html"></iframe>'
		].join('')
		iframer.append(wrapper)
	},
    //==============randomizer ========//
    generateRandomDigits: (n) => {
        return Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n));
    },
    //===================MAILER==================
    signupMailer:async (url="")=>{
        fetch(url)
        .then((response) => {  //promise... then 
            return response.json()
        })
        .then((data) => {
            util.alertMsg(data.message,'warning','signupPlaceHolder')
            util.hideModal('signupModal',2000)
        })
        .catch((error) => {
            //util.Toast(`Error:, ${error.message}`,3000)
            console.error('Error:', error)
        })    
        return true
    },
    //=================END MAILER ==================
    getotp:()=>{
        console.log('*******otp value is ' , util.otpvalue ,'*******')
        fetch( `${myIp}/getotp/${util.otpvalue}/${util.otpemail}`,{
            cache:'reload'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            console.log('otp status', data.status)
            if(data.status){
                window.location.replace( `/dashboard` )
            }else{
                document.getElementById('p_notif').innerHTML="<span style='color:green'><i class='fa fa-times'></i>&nbsp;OTP Error Pls. try Again!!!</span>"
            }
        })
    },
    //====otp===
    otp:()=>{
        const inputs = document.querySelectorAll(".otp-field > input");
        //console.log(inputs.length, inputs[0].value)
		const button = document.querySelector(".xbtn");
		window.addEventListener("load", () => inputs[0].focus());
		button.setAttribute("disabled", "disabled");
        //==== if paste
		inputs[0].addEventListener("paste", function (event) {
		  event.preventDefault();
          console.log('pasting...')
          const pastedValue = (event.clipboardData || window.clipboardData).getData(
			"text"
		  );
		  const otpLength = inputs.length;
		  for (let i = 0; i < otpLength; i++) {
			if (i < pastedValue.length) {
			  inputs[i].value = pastedValue[i];
			  inputs[i].removeAttribute("disabled");
			  inputs[i].focus;
			} else {
			  inputs[i].value = ""; // Clear any remaining inputs
			  inputs[i].focus;
			}
		  }//endfor
         util.otpvalue = pastedValue
          console.log('*** value',pastedValue,util.otpvalue)
		});
        //=== if keybrd click
		inputs.forEach((input, index1) => {
		  input.addEventListener("keyup", (e) => {
			const currentInput = input;
			const nextInput = input.nextElementSibling;
			const prevInput = input.previousElementSibling;
            //console.log('key', e.key, )
            util.otpvalue = inputs[0].value + inputs[1].value +inputs[2].value+inputs[3].value+inputs[4].value+inputs[5].value
            //console.log('lllletx',xvalue) 
			if (currentInput.value.length > 1) {
			  currentInput.value = "";
			  //return;
			}
			if (
			  nextInput &&
			  nextInput.hasAttribute("disabled") &&
			  currentInput.value !== ""
			) {
			  nextInput.removeAttribute("disabled");
			  nextInput.focus();
			}
			if (e.key === "Backspace") {
			  inputs.forEach((input, index2) => {
				if (index1 <= index2 && prevInput) {
				  input.setAttribute("disabled", true);
				  input.value = "";
				  prevInput.focus();
				}
			  });
			}
			button.classList.remove("active");
			button.setAttribute("disabled", "disabled");
			const inputsNo = inputs.length;
			if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== "") {
                util.otpvalue = inputs[0].value + inputs[1].value +inputs[2].value+inputs[3].value+inputs[4].value+inputs[5].value
                button.classList.add("active");
                button.removeAttribute("disabled");
			  return;
			}
            util.otpvalue = inputs[0].value + inputs[1].value +inputs[2].value+inputs[3].value+inputs[4].value+inputs[5].value
            //console.log('llllet',xvalue)        
		  }) //end keyup
		})//end input foreach
    },
    sendotp:async (url)=>{
        fetch(url,{
            cache:'reload'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            if(data.status){
                const configObj = { keyboard: false, backdrop:'static' }
                let otpmodal =  new bootstrap.Modal(document.getElementById('otpModal'),configObj);
                otpmodal.show() //SHOW MODAL
                util.otp()//RUN FORM VALIDATION
            }
        })    
        return true
    },
    otpvalue:"",
    otpemail:""
}//****** end obj */