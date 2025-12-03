


const scanner = {

    checker:()=>{
        if(document.getElementById('guard').value==""){
            document.getElementById('my-qr-reader').classList.add('disableMe')
        }else{
            document.getElementById('my-qr-reader').classList.remove('disableMe')
        }


    }, 
     
    qrsave:(txt,guard) =>{

        document.getElementById('xmsg').innerHTML = "Scanning..."

        //this is temporary ur.replace ... take out during production
        //const txt2 = txt.replace('https://vantaztic-api-onrender.onrender.com/','https://vantaztic-api-onrender.onrender.com/')
        
        let url =`${txt}/${guard}`

        // const configObj = { keyboard: false, backdrop:'static' }
        // const qrmodal =  new bootstrap.Modal(document.getElementById('myModal'),configObj)
    
    
        // fetch(url)
        // .then((response) => {  //promise... then 
        //     return response.json();
        // })
        // .then((data) => {


        //     scanner.htmlscanner.stop().then((ignore) => {
        //         // QR Code scanning is stopped.
        //         document.getElementById('xmsg').innerHTML ='stopped '+ data.po_number

        //       }).catch((err) => {
        //         // Stop failed, handle it.
        //       });

           
        //     //set icon
        //     if(data.icon=="SUCCESS"){
        //         xicon = `<i class="text-success fa fa-check-circle-o "></i> `
        //         xcolor = "text-success"
        //     }else{
        //         xicon = `<i class="text-warning fa fa-times-circle-o "></i> `
        //         xcolor = "text-warning"
        //     }
        
        //     document.getElementById('myicon').innerHTML = `${xicon}  ${data.icon}`
        //     document.getElementById('msg').innerHTML = `Released By: ${data.guard}<br>
        //                                                 DR : ${data.dr_number}<br>
        //                                                 PO : ${data.po_number}<br>
        //                                                 <span class='${xcolor}'><b>${data.message}</b></span>`
        //     pocartmodal.show()//====show modal dialog
             
        // })
        // .catch((error) => {
        //     //xToast(`Error:, ${error}`,4000)
            
        //     console.error('Error:', error)
        // })
    },

    populate:async ( selectElement )=>{
      
        await fetch( `https://vantaztic-api-onrender.onrender.com/getsecurity`)
        .then(response => { 
            return response.json()
        })
        .then( (data)=>{

            let option = document.createElement("option")
            option.setAttribute('value', "")
            option.setAttribute('selected','selected')
            option.setAttribute('class','sekyu')
              
            let optionText = document.createTextNode( "-- Pls Select --" )
            option.appendChild(optionText)

            selectElement.appendChild(option)

            for (let key in data.result) {
                let option = document.createElement("option")
                option.setAttribute('value', data.result[key].full_name)
                option.setAttribute('class','sekyu')
              
                let optionText = document.createTextNode( data.result[key].full_name )
                option.appendChild(optionText)
              
                selectElement.appendChild(option)
            }

            selectElement.focus()
        
        }) 
        .catch(error => { 
            console.log("An error occurred: ", error); 
        })        

    },

    removeOptions: (selectElement) => {
        console.log('here first, removing options first')
        var i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
           selectElement.remove(i);
        }
    },


    cameraId:null,
    htmlxcan:null,

    init:()=>{

        console.log('loading x init')
        const domx = document.getElementById('guard')
        scanner.removeOptions( domx )
        scanner.populate( domx )

        scanner.htmlscan = new Html5QrcodeScanner(
            "my-qr-reader",
            { fps: 10, qrbox: {width: 250, height: 250} },
            /* verbose= */ false);

        scanner.htmlscan.render(scanner.onScanSuccess );


        //listener load
        let xmodalEl = document.getElementById('myModal')

        //modal listener
        xmodalEl.addEventListener('hide.bs.modal', (e)=>{
            document.getElementById('xmsg').innerHTML = "System Ready..."
            scanner.htmlscan.resume()
           
        })

    },
    onScanSuccess: (decodedText, decodedResult) => {

        // handle the scanned code as you like, for example:
        document.getElementById('xmsg').innerHTML =`${decodedText}`
        scanner.scanURL = `${decodedText}`
        

        scanner.qrsave( scanner.scanURL,document.getElementById('guard').value)

        scanner.htmlscan.pause(true)


        //console.log(`Code matched = ${decodedText}`, decodedResult);
        
    },

    onScanFailure: (error) => {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        alert(`Code scan error = ${error}`);
        return false

    },
    scanURL:null,
    htmlscan:null,
   
    qrsave: async (txt,guard) =>{

        
        //this is temporary ur.replace ... take out during production
        //const txt2 = txt.replace('https://vantaztic-api-onrender.onrender.com/','https://vantaztic-api-onrender.onrender.com/')
       scanner.htmlscan.pause(true)
   
       //this code also works but.. same as pause
    //    html5QrCode.stop().then((ignore) => {
    //     // QR Code scanning is stopped.
    //   }).catch((err) => {
    //     // Stop failed, handle it.
    //   });
       
        let url =`${txt}/${guard}`
        document.getElementById('xmsg').innerHTML = "Reading Success!!!"
   
        //document.getElementById('url').innerHTML = text
    
        await fetch(url,
            {
                cache:'reload',
                method:'GET'
            }
        )
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
 
            //set icon
            if(data.icon=="SUCCESS"){
                xicon = `<i class="text-success fa fa-check-circle-o "></i> `
                xcolor = "text-success"
            }else{
                xicon = `<i class="text-warning fa fa-times-circle-o "></i> `
                xcolor = "text-warning"
            }
        
            document.getElementById('myicon').innerHTML = `${xicon}  ${data.icon}`
            document.getElementById('msg').innerHTML = `Released By: ${data.guard}<br>
                                                        DR : ${data.dr_number}<br>
                                                        PO : ${data.po_number}<br>
                                                        <span class='${xcolor}'><b>${data.message}</b></span>`
            
            const configObj = { keyboard: false, backdrop:'static' }
            const qrmodal =  new bootstrap.Modal(document.getElementById('myModal'),configObj)
        
            qrmodal.show()//====show modal dialog

            
            // this works but with undesirable result
            
            // document.getElementById("html5-qrcode-button-camera-stop").click();
        })
        .catch((error) => {
            //xToast(`Error:, ${error}`,4000)
            
            console.error('Error:', error)
        })
    },

    modalsetup:()=>{

    }
}

scanner.init()

