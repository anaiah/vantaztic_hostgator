/*
author : Carlo O. Dominguez
*/
let dash = {
	socket:null,
    approver_type:null,
    resolver:async (xmsg,xtype) => {
        console.log('RESOLVER()')
        //balik na 
        dash.fetchBadgeData() // update badges
        .then( x=>{
            if(x){
                console.log('SPEAK NOW',xmsg)
                util.speak(xmsg )
                util.Toast(xmsg, 3000)
                dash.getPO()
            }
        })    
        //remove muna
        // let barstat = Chart.getChart("chart1")
        // if(barstat!==undefined){
        //     barstat.destroy()
        // }
        // let piestat = Chart.getChart("chart2")
        // if(piestat!==undefined){
        //     piestat.destroy()
        // }
        // dash.barChart()
        // dash.pieChart()
            // if(xtype==="2"){
            //     dash.getAll('All','2')
            // }else{
            //     dash.getAll('All','1')
            // }
            //dash.fetchBadgeData()
    },
	//main func
    getMsg:()=>{
        console.log('dash.getMsdg()===')
        //when msg receive
        dash.socket.on('admin',(msg)=>{
            const xname = util.getCookie("fname")
            let xmsg  = JSON.parse( msg )
            //console.log('==themsg',msg, xmsg)
            //console.log(xname==null,xname=="")
            if( xname!==null || xname!==""){
                //if already logged
                //then speak 
                const xmsg  = JSON.parse(msg)
                console.log('may message po')
                dash.resolver(xmsg.msg, xmsg.type)
            }
        })
        dash.socket.on('logged', (msg) => {
            util.Toast(msg,3000)
            util.clearBox()
            /*
            var item = document.getElementById("xmsg")
            item.textContent = msg
            */
        })
    },
    dataforTag:null,
    updateBadge : (xdata) =>{
        const badge = document.getElementById('bell-badge')
        const badges = document.getElementById('badge-approval')
        badge.innerHTML = xdata.length
        badges.innerHTML = xdata.length
    },
    // ==== retrieve PO for approval ==//
    getPO: async () => {
        await fetch(`https://vantaztic-api-onrender.onrender.com/getpo/${util.getCookie('approver_type')}`,{
            cache:'reload'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then( (data) => {
            //=== reset nav tabs
            //=== reset nav tabs
            document.getElementById('nav-tab').innerHTML = ""
            document.getElementById('nav-po').innerHTML = ""
            document.getElementById('nav-po').innerHTML = "NO DATA TO SHOW!"
            document.getElementById('nav-client').innerHTML = ""
            if( data.found ){
                dash.updateBadge(data.result) //===update badge
                let xdata, xstat, xprice, imgId = 0, cartid = 0, inputcartid, xicon = "", xclient = ""
                console.log('== dashboard.js getPO()***',data.result)
                document.getElementById('nav-tab').innerHTML = `
                <button class="nav-link active" id="nav-po-tab" data-bs-toggle="tab" data-bs-target="#nav-po" 
                    type="button" role="tab" aria-controls="nav-po" aria-selected="true">Equipment Details</button>
                <button class="nav-link" id="nav-client-tab" data-bs-toggle="tab" data-bs-target="#nav-client" 
                    type="button" role="tab" aria-controls="nav-client" aria-selected="false">Client Info</button>
                `
                for (let key in data.result) {
                    imgId++;  cartid ++
                    ximage = `assets/resized/${data.result[key].po_number}.jpg`
                    let xdet = JSON.parse(JSON.stringify(data.result[key].details))
                    for(let xx in xdet ){//=================next FOR NEXT
                        let xdets = JSON.parse(xdet[xx])
                        //=======PO/ SI HEader =======//
                        xicon += `<span class='eqptno' >
                            <b>PO # ${data.result[key].po_number}  -  INV # ${data.result[key].invoice_number.toUpperCase()}<br>
                            </span>`
                        xicon += `
                            <table width="70%" class='clientelle'>
                            <tr>
                            <td valign=top  >Transaction</td>
                            <td>:</td>
                            <td valign=top >${data.result[key].transaction}</td>
                            </tr>
                            <tr>
                            <td valign=top  >Type </td>
                            <td>:</td>
                            <td valign=top >${xdets.type}</td>
                            </tr>
                            <tr>
                            <td valign=top  >Date Created</td>
                            <td>:</td>
                            <td valign=top >${util.formatDate2(data.result[key].po_date)}</td>
                            </tr>
                            `
                        xicon +=`
                            <tr>
                            <td valign=top >Eqpt No.</td>
                            <td>:</td>
                            <td valign=top >${data.result[key].eqpt_no}</td>
                            </tr>
                            <tr>
                            <td valign=top >Description</td>
                            <td>:</td>
                            <td valign=top >${xdets.description}</td>
                            </tr>
                            <tr>
                            <td valign=top >Qty</td>
                            <td>:</td>
                            <td valign=top >${xdets.qty}</td>
                            </tr>
                            <tr>
                            <td valign=top >Acquired Price</td>
                            <td>:</td>
                            <td  valign=top align=left>${util.addCommas(xdets.price.toFixed(2))}</td>
                            </tr>
                            <tr>
                            <td valign=top >Selling Price</td>
                            <td>:</td>
                            <td  valign=top align=left>${util.addCommas(xdets.sale.toFixed(2))}</td>
                            </tr>
                            <tr>
                            <td valign=top >Total</td>
                            <td>:</td>
                            <td  valign=top align=left>${util.addCommas(xdets.total.toFixed(2))}</td>
                            </tr>`
                        xicon+=`
                            <tr>
                                <td colspan=3 align=left valign='bottom'>
                                    <div class="d-sm-flex justify-content-between" >
                                        <button type="button" class="btn btn-primary btn-sm" 
                                        onclick="javascript:dash.showApprover(
                                        '${util.getCookie('approver_type')}',
                                        '${data.result[key].po_number}')">
                                        <i class="fa fa-thumbs-up"></i> Approve PO# ${data.result[key].po_number}</button>
                                        &nbsp;
                                    </div>
                                </td>
                            </tr>
                            <tr>
                            <td colspan=3><hr></td>
                            </tr>
                            `
                    }//================ end 2ND FOR NEXT
                    xicon +='</table>'
                    /* take out grand total
                    xicon+=`
                        <tr>
                        <td colspan=2 align=left>&nbsp;</td>
                        <td>
                        <span id='gtotal'>${util.addCommas(data.result[key].grand_total.toFixed(2))}</span>
                        </td>
                        </tr>
                        </table>
                    `*/
                    inputcartid = "qty_"+cartid
                    document.getElementById('nav-po').innerHTML = xicon
                    xclient += `
                    <table width="70%" class='clientelle'>
                    <tr>
                    <td valign=top  width='25%'>PO : </td>
                    <td valign=top  width='45%'>${data.result[key].po_number}</td>
                    </tr>
                    <tr>
                    <td valign=top  width='25%'>Invoice : </td>
                    <td valign=top  width='45%'>${data.result[key].invoice_number.toUpperCase()}</td>
                    </tr>
                    <tr>
                    <td valign=top  width='25%'>Client : </td>
                    <td valign=top  width='45%'>${data.result[key].client_name}</td>
                    </tr>
                    <tr>
                    <td valign=top >Company : </td>
                    <td valign=top >${data.result[key].client_company}</td>
                    </tr>
                    <tr>
                    <td valign=top >Address : </td>
                    <td valign=top >${data.result[key].client_address}</td>
                    </tr>
                    <tr>
                    <td valign=top >Contact # : </td>
                    <td valign=top >${data.result[key].client_phone}</td>
                    </tr>
                    <tr>
                    <td valign=top >Email : </td>
                    <td valign=top >${data.result[key].client_email.toLowerCase()}</td>
                    </tr>
                    </table>
                    <br>
                    <span class="attach">Remarks:</span><br>
                     ${data.result[key].client_remarks.toUpperCase()}<br>
                    <span class="attach">Attachment:</span><br>
                    <img id="image-${imgId}" class="imgpreview" src="${ximage}" height=80 onclick="javascript:dash.showImage(this.id,this.src)">
                    </span>`
                    xclient+="<hr>"
                    document.getElementById('nav-client').innerHTML = xclient 
                }//========================== end for loop====================
            }else{
                azero = []
                dash.updateBadge(azero) //===update badge
            }//eif
        })
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })
    },
    //=============show pdf
    showPdf: async() => {
        const configObj = { keyboard: false, backdrop:'static' }
        let pdfmodal =  new bootstrap.Modal(document.getElementById('pdfModal'),configObj);
        // const xmsg = document.getElementById('xmsg')
        // xmsg.innerHTML = `Are you sure you want to Approve PO# ${po_number}?`
        // let xid = document.getElementById('xid')
        // xid.innerHTML=`${po_number}`
        // let xtype = document.getElementById('xtype')
        // xtype.innerHTML=`${approver_type}`
        pdfmodal.show()
    },
    //==========show if approve
    showApprover: async(approver_type,po_number)=>{
        //console.log(id,src)   
        const configObj = { keyboard: false, backdrop:'static' }
        let msgmodal =  new bootstrap.Modal(document.getElementById('msgModal'),configObj);
        const xmsg = document.getElementById('xmsg')
        xmsg.innerHTML = `Are you sure you want to Approve PO# ${po_number}?`
        let xid = document.getElementById('xid')
        xid.innerHTML=`${po_number}`
        let xtype = document.getElementById('xtype')
        xtype.innerHTML=`${approver_type}`
        msgmodal.show()
    },
    //==================tag equipment as approved
    equipmentApprove: async ()=>{
        let xid = document.getElementById('xid')
        let xtype = document.getElementById('xtype')
        console.log('==dash.equipmentApprove()=== approving ', xid.innerHTML)
        document.getElementById('alertPlaceHolder').innerHTML = "Saving Please Wait..."
        const po_btn = document.getElementById('po_approve_btn')
        po_btn.disabled = true
        const i_saves = document.getElementById('i-saves')
        i_saves.classList.add('fa-pulse')
        i_saves.classList.add('fa-spinner')
        i_saves.classList.add('fa-fw')
        document.getElementById('alertPlaceHolder').innerHTML = ""
        fetch(`https://vantaztic-api-onrender.onrender.com/equipmentapprove/${xid.innerHTML}/${xtype.innerHTML}/${util.formatDate()}`,{
            cache: 'reload',
            method:'PUT'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            console.log('***FETCH BADGE DATA NOW***')
            //balik na
            dash.fetchBadgeData() // update badges
            .then( x=>{
                if(x){
                    document.getElementById('alertPlaceHolder').innerHTML = ""
                    i_saves.classList.remove('fa-pulse')
                    i_saves.classList.remove('fa-spinner')
                    i_saves.classList.remove('fa-fw')
                    i_saves.classList.add('fa-floppy-o')
                    po_btn.disabled = false
                    util.hideModal('msgModal',2000)  
                    util.speak(data.voice)
                    //======emit message to sales people=====//
                    //send message to super users
                    const sendmsg = {
                        msg: "Attention, there's one Transaction approved, please check it on your web apps!"
                    }
                    //emit message and remind sales team
                    dash.socket.emit('sales', JSON.stringify(sendmsg))
                    dash.getPO()
                }
            })	
            //// remove muna mga barchart
            // /* ==== update chart also ========*/
            // let barstat = Chart.getChart("chart1")
            // if(barstat!==undefined){
            //     barstat.destroy()
            // }
            // let piestat = Chart.getChart("chart2")
            // if(piestat!==undefined){
            //     piestat.destroy()
            // }
            // dash.barChart()
            // dash.pieChart()
        })
        .catch((error) => {
            console.error('Error:', error)
        })    
    },
    //show modal and iamge
    showImage: async (id,src) => {
        //console.log(id,src)
        const configObj = { keyboard: false, backdrop:'static' }
        let ximagemodal =  new bootstrap.Modal(document.getElementById('imageModal'),configObj);
        let imageModalEl = document.getElementById('imageModal')
        let imageprev = document.getElementById('imagePreview')
        imageprev.src = src
        ximagemodal.show()
        imageModalEl.addEventListener('show.bs.modal', function (event) {
        },false)
    },
    fetchBadgeData: async()=>{ //first to fire to update badge
        return new Promise((resolve, reject)=> {
            fetch(`https://vantaztic-api-onrender.onrender.com/fetchinitdata`,{
                cache: 'reload'
            })
            .then((response) => {  //promise... then 
                return response.json();
            })
            .then((data) => {
                console.log('dash.fetchbadgeData() ',data)
                //////////==== tanggal muna mga badgeupdate badage for pending approv
                // const badge = document.getElementById('bell-badge')
                // // badge.innerHTML = data.result[2].status_count
                // const rentbadge = document.getElementById('rent-badge')
                // rentbadge.innerHTML = data.result[0].status_count
                // const salebadge = document.getElementById('sale-badge')
                // salebadge.innerHTML = data.result[1].status_count
                // const badgeforapprove = document.getElementById('badge-approval')
                // badgeforapprove.innerHTML = parseInt(data.result[1].status_count) + parseInt(data.result[0].status_count)
                // //earnings
                const earningsdiv = document.getElementById('earnings')
                    earningsdiv.innerHTML = "<span class='peso'>&#8369;</span>"+ util.addCommas(data.result[0].profit.toFixed(2) )
                //opex
                const opex = document.getElementById('opex')
                opex.innerHTML = `<span class='peso'>&#8369;</span>${util.addCommas(data.result[0].opex.toFixed(2)) }`
                resolve(true)
                //tanggal muna rent rent overdue
                // if(data.result[0].overdue!=="0" ||
                //     isNaN(data.result[0].overdue)){
                // }else{
                //     const rentdue = document.getElementById('rent-overdue')
                //     rentdue.innerHTML = `${ data.result[0].status_count / data.result[0].overdue } %`
                //     const rentduediv = document.getElementById('rentduediv')
                //     rentduediv.setAttribute("style",`width:${(data.result[0].status_count / data.result[0].overdue )}%`)
                //     //rentduediv.aria-valuenow = `${ (data.result[0].status_count / data.result[0].overdue )}`
                // }
            })
            .catch((error) => {
                //util.Toast(`Error:, ${error}`,1000)
                reject(error)
                console.error('Error:', error)
            })    
        })
    },
    barChart: async ()=>{
        await fetch(`https://vantaztic-api-onrender.onrender.com/booga`,{
            cache: 'reload'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            let monthValues = [],
                categoryValues = []
            for (const xkey in data.result){
                monthValues.push(data.result[xkey].xmonth)
                categoryValues.push( data.result[xkey].type )
            }//end fornext
            //make unique display of months
            let uniqueMonthValues = [...new Set(monthValues)]
            console.log('==UNIQUE MONTH==',uniqueMonthValues)
            //make unique display of categories
            let uniqueCategoryValues = [...new Set(categoryValues)]
            /* ==== SAMPLE DATASET 
            [
                {
                  label: "Chassis",
                  data: [1, 6]
                }, {
                  label: "Container",
                  data: [1,8]
                }
                , {
                    label: "Genset",
                    data: [0,3]
                  },
                  {
                    label: "Reefer",
                    data: [0,5]
                  }
              ]
            */
            let obj ={},
                resultData=[]
            const config1 = {
                type: "bar",
                data: {
                  labels: uniqueMonthValues,
                  datasets:resultData
                },
                options: {
                  "maintainAspectRatio": false,
                  plugins: {
                      legend: {
                          position:'bottom',
                          display: true,
                          //align:'start'
                      },
                      title: {
                          display: true,
                          text: 'Equipment Performance'
                      },
                  },
                  responsive: true,    
                  scales: {
                      /*
                      x: {
                        display: true,
                        title: {
                          display: true,
                          text: 'Month',
                          color: '#911',
                          font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                          },
                          padding: {top: 20, left: 0, right: 0, bottom: 0}
                        }
                      },*///end x
                      y: {
                          display: true,
                          title: {
                            display: true,
                            text: 'Transaction Count',
                            color: '#191',
                            font: {
                              family: 'verdana',
                              size: 12,
                              style: 'normal',
                              lineHeight: 1.2
                            },
                            padding: {top: 30, left: 0, right: 0, bottom: 0}
                          }
                      }			
                  }
                }
            }//end config1
            let adata=[], resultset=[],hwmany=0
            uniqueCategoryValues.forEach( (val,idx,arr)=>{
                console.log('==',val)
                obj={}
                obj.label = val //get label first
                resultData.push(obj)
                hwmany = 0 //reset
                adata=[] //reset
                //find category in data.result
                for( const zkey in data.result){
                    if(val==data.result[zkey].type){
                        hwmany++
                        ///onsole.log(hwmany)
                        //console.log(data.result[zkey].count.indexOf(val)==-1)	
                        adata.push(data.result[zkey].count)
                        obj.data = adata		
                    }	
                }//===============end for next
                if(hwmany<=1){
                    if(uniqueMonthValues.length==1){
                    }else{
                        adata.push(0)
                        adata.sort()
                    }
                    obj.data = adata
                }
                console.log('ADATA',adata )
            })//================end forEACH,obj.data
            console.log('RESULTSET',resultset)
            //============= display FIRST CHART
            new Chart("chart1", config1);
        })//end then 
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    }, //===end method barchart
    pieChart: async ()=>{
        const pieLabels =['Sales','Rent']
        const piedata = {
            labels: pieLabels,
            datasets:[
                {
                    label: '%',
                    backgroundColor:['#36e32b','#0abfd2'],
                    data : [ parseInt(util.getCookie('Sales')), parseInt(util.getCookie('Rent')) ]	
                }
            ]
        }	
        //for second chart
        const pieConfig = {
            type: 'doughnut',
            data: piedata, 
            options: {
              "maintainAspectRatio": false,
              responsive: true,
              plugins: {
                    legend: {
                        position:'bottom',
                        display: true,
                        //align:'start'
                    },
                    title: {
                        display: true,
                        text: 'Revenue Contributors'
                    },
                }
            },
        }
        new Chart("chart2",pieConfig)
    },
	//==,= main run
	init : async () => {
        console.log('dash.init() .....')
        let authz = []
        authz.push(util.getCookie('grp_id' ))
        authz.push(util.getCookie('fname'))
        //==HANDSHAKE FIRST WITH SOCKET.IO
        const userName = { token : authz[1] , mode: 1}//full name token
        dash.socket = io.connect("https://vantaztic-api-onrender.onrender.com", {
            //withCredentials: true,
            query:`userName=${JSON.stringify(userName)}`
            // extraHeaders: {
            //   "osndp-header": "osndp"
            // }
        });//========================initiate socket handshake ================
        //write name
        const xname = document.getElementById('xname')
        const xpic = document.getElementById('xpic')
        dash.approver_type = util.getCookie('approver_type')
        //get name of logged user
        xname.innerHTML = util.getCookie('fname')
        xpic.src = util.getCookie('pic')
        //get ip address
        const ipaddy = document.getElementById('ip')
        ipaddy.innerHTML = util.getCookie('ip_addy')
        util.speak( util.getCookie('the_voice'))
        util.Toast('System Ready', 2000)
        //// balik na
        dash.fetchBadgeData() // update badges
        .then( x=>{
            if(x){
                dash.getMsg()
                dash.getPO() //get pending for approval
            }
        })	
        //TAKE OUT MUNA
        // dash.pieChart()
        // dash.barChart()
	}//END MAIN
} //======================= end ajax obj==========//
//ajax.Bubbl
window.scrollTo(0,0);
dash.init()
