/*
author : Carlo O. Dominguez
*/
let dash = {
	socket:null,
    myIp: "http://192.168.214.221:10000", //https://vantaztic-api-onrender.onrender.com}
    //myIp: `https://vantaztic-api-onrender.onrender.com`,
    
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
            //util.Toast(msg,3000)
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

    //collapse sidebar
    collapz: () =>{
        /*
        if( ! document.getElementById("sidebarCollapse") ){
            //document.getElementById('filter_number').focus()
        }else{
            document.getElementById("sidebarCollapse").click()
           // document.getElementById('filter_number').focus()
        }
           */
        /// take out muna document.getElementById("sidebarCollapse").click()
        //focus on emp number claims filter
    },

    formatdate:(xdate)=>{
        // Parse into a Date object
        const date = new Date(xdate);

        // Extract parts
        const month = date.getMonth() + 1; // months are 0-based
        const day = date.getDate();
        const year = date.getFullYear();

        // Format as M/D/Y
        const formattedDate = `${month}/${day}/${year}`;

        //console.log('xdate',formattedDate)
        return formattedDate
    },

    poData:null,
       
    // ==== retrieve PO for approval ==//
    getPO:  () => {
        
        fetch(`${dash.myIp}/getpo/${util.getCookie('approver_type')}`,{
            cache:'reload'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then( (data) => {
           
            if( data.found ){

                //console.log('rec', data.result[0])
               
                let ydata = [], obj
                
                for (let key in data.result) {

                    xdetails = JSON.parse(data.result[key].details)
                    
                    //console.log(xdetails)
                    //console.log(data.result[key])
        
                    obj = {}
                    obj.po_number = data.result[key].po_number
                    obj.invoice_number  = data.result[key].invoice_number
                    obj.qty = xdetails.qty
                    obj.total = data.result[key].grand_total
                    obj.client = data.result[key].client_name
                    obj.company = data.result[key].client_company
                    obj.eqpt_no = data.result[key].eqpt_no
                    obj.type = xdetails.type
                    obj.transaction = data.result[key].transaction
                    obj.serial = xdetails.serial
                    obj.description = xdetails.description
                    obj.remarks = data.result[key].client_remarks

                    obj.avatarurl = `https://app.vantaztic.com/assets/resized/${data.result[key].po_number.replace("TEST_","")}.jpg`
                    
                    // Parse into a Date object
                    obj.po_date = dash.formatdate(data.result[key].po_date)

                    ydata.push( obj )
                    
                }//========================== end for loop====================im
                // if want to chck data -> use console.log(ydata)
                console.log(ydata)
                                
                dash.ctrlExt.loadPo(ydata)
               
                obj={}

                dash.loadbarChart()

                //////// BALIK NATENN PAG DI UBRA, how to call method in Myapp.Application  window.myapp.test(ydata[0]);
                
                util.speak(`You have  ${ydata.length} Purchase Order for Approval!`)

            }else{
                util.speak('No Purchase Order for approval!')
                //dash.updateBadge(azero) //===update badge
            }//eif
        })
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })
    },

    appExt: null,
    ctrlExt:null,
    selected_po:null,

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

    //NEW EQUIPMENT APPROVVED
    equipmentApprove: async(po,si,id)=>{
    
        fetch(`${dash.myIp}/equipmentapprove/${po}/${si}/${id}/${util.formatDate()}`,{
            cache: 'reload',
            method:'PUT'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            util.speak(data.voice)
            //======emit message to sales people=====//
            //send message to super users
            const sendmsg = {
                msg: "Attention, there's one Transaction approved, please check it on your web apps!"
            }
            //emit message and remind sales team
            dash.socket.emit('sales', JSON.stringify(sendmsg))
            dash.getPO()
            
        })
        .catch((error) => {
            console.error('Error:', error)
        })    
    },

    //show modal and iamge
    showImage: async (src) => {
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
              
                // const earningsdiv = document.getElementById('earnings')
                // earningsdiv.innerHTML = "<span class='peso'>&#8369;</span>"+ util.addCommas(data.result[0].profit.toFixed(2) )
                //opex
                // const opex = document.getElementById('opex')
                // opex.innerHTML = `<span class='peso'>&#8369;</span>${util.addCommas(data.result[0].opex.toFixed(2)) }`
                            
                resolve(true)
              
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

    //===========GETMENU==========
    getmenu: async(grp_id) =>{
        console.log('=====FIRING ggetmenu()==========')
        
        await fetch(`${dash.myIp}/xmenu/${util.getCookie('grp_id')}`,{
            cache:'reload'
        })
        .then( (res)  => res.json() )
        .then( (data) => {	
            //console.log('menu',data)

            var xdata = []
            
            xdata.push(data)
            //console.log(xdata)
            
            const ul = document.getElementById('sidebarnav'); // Get the <ul> or <ol>

            //remove all elements of UL
            while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
            }
            
            xdata[0].forEach(info => {  
            
                const li = document.createElement('li'); // Create a new <li>
                li.classList.add("nav-small-cap")

                const ii =  document.createElement('i')
                ii.classList.add("fs-10")
                
                li.appendChild( ii )

                const span =  document.createElement('span')
                span.textContent = info.menu
                span.classList.add('hide-menu')  
                //span.appendChild(ii)
                
                li.appendChild(span)

                ul.appendChild(li); // Append the <li> to the list
            
                //var subdata = JSON.parse(info.list)
                //console.log( info )
                var aList = []
                // //loop submenu
                aList.push( info.list )
                //console.log( "yo", info.list )
                    
                aList[0].forEach(xmenu => {  
                    // //=================== submenu
                    const li2 = document.createElement('li'); // Create a new <li>
                    li2.classList.add("sidebar-item")
                    
                    const span1 =  document.createElement('span')
                    const i2 =  document.createElement('i')
                    i2.classList.add("ti",`${xmenu.icon}`)
                    span1.appendChild(i2)

                    const span2 =  document.createElement('span')
                    span2.classList.add('hide-menu')  
                    span2.textContent = `${xmenu.sub}`

                    const aa = document.createElement('a'); // Create a new <li>
                    aa.classList.add("sidebar-link")

                    aa.appendChild(  span1 )
                    aa.appendChild(  span2 )

                    aa.href = xmenu.href
                    
                    li2.appendChild(aa)
                    
                    ul.appendChild(li2); // Append the <li> to the list                    
            
                })//===end subdata

            })//end foreach

            return true;
            
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },
    //==========END  GETMENU

    //======== LOAD EXTJS
    loadbarChart: async()=>{
        console.log('loading... loadbarchart()')

        await fetch(`${dash.myIp}/bardata`,{
            cache: 'reload'
        })
        .then((res) => {  //promise... then 
            return res.json();
        })
        .then((xdata) => {

            //console.log('merege',xdata.xdata)

            const mergedData = dash.mergeFinalData(xdata.xdata);
            console.log('my merge data ', mergedData);

            var options = {
                series: mergedData,
                chart: {
                type: 'bar',
                height: 350
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: '55%',
                  borderRadius: 5,
                  borderRadiusApplication: 'end'
                },
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
              },
              xaxis: {
                categories: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              },
              yaxis: {
                title: {
                  text: 'Qty.'
                }
              },
              fill: {
                opacity: 1
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return  val + " (Qty)"
                  }
                }
              }
            };
      
              var chart = new ApexCharts(document.querySelector("#pie-chart"), options);
              chart.render();
        
        })
        .catch((error) => {
            console.error('Error:', error)
        })


        
    },
    
    mergeFinalData:(arr)=>{
        const data = arr ; 

        // Define your periods (or generate from data)
        const periods = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05'];
        
        // Step 1: Collect all unique transaction types
        const typesSet = new Set();
        data.forEach(item => {
          typesSet.add(item.transaction.toUpperCase()); // or as-is if case matches
        });
        const types = Array.from(typesSet);
        
        // Step 2: Initialize result map with empty data arrays
        const resultMap = {};
        types.forEach(type => {
          resultMap[type] = { name: type, data: Array(periods.length).fill(0) };
        });
        
        // Step 3: Populate data
        data.forEach(item => {
          const transType = item.transaction.toUpperCase(); // standardize case if needed
          const period = item["substring(b.date_created,1,7)"]; // your period string
          const qty = parseInt(item["sum(a.qty)"]);
        
          const index = periods.indexOf(period);
          if (index !== -1 && resultMap[transType]) {
            resultMap[transType].data[index] = qty;
          }
        });
        
        // Step 4: Convert object to array format
        const finalArray = Object.values(resultMap);
        
        return finalArray
        
    },

    //useful for joining qty into 1
    mergeData:(arr)=> {
        const resultMap = {};
      
        arr.forEach(item => {
          const key = item.transaction;
          if (!resultMap[key]) {
            resultMap[key] = {
              transaction: key,
              qty: 0,
              price: 0,
              sale_price: 0,
              total: 0,
              dates: []
            };
          }
      
          // parseFloat after removing commas, then sum
          resultMap[key].qty += parseInt(item["sum(a.qty)"]);
          resultMap[key].price += parseFloat(item["format(sum(a.price),2)"].replace(/,/g, ""));
          resultMap[key].sale_price += parseFloat(item["format(sum(a.sale_price),2)"].replace(/,/g, ""));
          resultMap[key].total += parseFloat(item["format(sum(a.total),2)"].replace(/,/g, ""));
      
          // Collect periods
          resultMap[key].dates.push(item["substring(b.date_created,1,7)"]);
        });
      
        // Convert map to array
        const mergedArray = Object.values(resultMap).map(item => ({
          transaction: item.transaction,
          total_qty: item.qty,
          total_price: item.price.toFixed(2),
          total_sale_price: item.sale_price.toFixed(2),
          total_amount: item.total.toFixed(2),
          periods: [...new Set(item.dates)].join(', ')
        }));
      
        return mergedArray;
    },

    testing:()=>{
        const data = [{"transaction":"PURCHASE","sum(a.qty)":"29","format(sum(a.price),2)":"1,659,000.01","format(sum(a.sale_price),2)":"2,741,872.00","format(sum(a.total),2)":"5,326,624.00","substring(b.date_created,1,7)":"2025-01"},{"transaction":"PURCHASE","sum(a.qty)":"18","format(sum(a.price),2)":"2,520,000.00","format(sum(a.sale_price),2)":"5,503,110.00","format(sum(a.total),2)":"6,546,510.00","substring(b.date_created,1,7)":"2025-02"},{"transaction":"PURCHASE","sum(a.qty)":"20","format(sum(a.price),2)":"2,356,000.00","format(sum(a.sale_price),2)":"840,386,530.00","format(sum(a.total),2)":"2,518,049,350.00","substring(b.date_created,1,7)":"2025-03"},{"transaction":"PURCHASE","sum(a.qty)":"25","format(sum(a.price),2)":"5,306,000.00","format(sum(a.sale_price),2)":"426,857,996.30","format(sum(a.total),2)":"847,460,001.30","substring(b.date_created,1,7)":"2025-04"},{"transaction":"PURCHASE","sum(a.qty)":"16","format(sum(a.price),2)":"650,000.00","format(sum(a.sale_price),2)":"1,836,305.14","format(sum(a.total),2)":"9,501,520.37","substring(b.date_created,1,7)":"2025-05"},{"transaction":"RENT","sum(a.qty)":"1","format(sum(a.price),2)":"0.01","format(sum(a.sale_price),2)":"163,000.00","format(sum(a.total),2)":"163,000.00","substring(b.date_created,1,7)":"2025-01"},{"transaction":"RENT","sum(a.qty)":"4","format(sum(a.price),2)":"0.04","format(sum(a.sale_price),2)":"74,220.00","format(sum(a.total),2)":"74,220.00","substring(b.date_created,1,7)":"2025-02"},{"transaction":"RENT","sum(a.qty)":"4","format(sum(a.price),2)":"0.04","format(sum(a.sale_price),2)":"1,481,396.00","format(sum(a.total),2)":"1,481,396.00","substring(b.date_created,1,7)":"2025-03"},{"transaction":"RENT","sum(a.qty)":"3","format(sum(a.price),2)":"0.02","format(sum(a.sale_price),2)":"276,000.00","format(sum(a.total),2)":"477,000.00","substring(b.date_created,1,7)":"2025-04"},{"transaction":"RENT","sum(a.qty)":"6","format(sum(a.price),2)":"0.04","format(sum(a.sale_price),2)":"467,033.30","format(sum(a.total),2)":"889,099.90","substring(b.date_created,1,7)":"2025-05"},{"transaction":"TERMS","sum(a.qty)":"3","format(sum(a.price),2)":"413,000.02","format(sum(a.sale_price),2)":"399,200.00","format(sum(a.total),2)":"399,200.00","substring(b.date_created,1,7)":"2025-02"}]
  
        const mergedData = dash.mergeData(data);
        console.log(mergedData);
        
    },

	//==,= main run
	init : () => {

        console.log('dash.init() .....')

        //Sdash.testing()

        dash.getmenu() //get menu
        //dash.loadExt() //load extjs

        util.speak( util.getCookie('the_voice'))
        
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
        //const xname = document.getElementById('xname')
        const xpic = document.getElementById('img-profile')

        console.log(  util.getCookie('pic') )

        dash.approver_type = util.getCookie('approver_type')
        
        //get name of logged user
        //xname.innerHTML = util.getCookie('fname')
        
        xpic.src = util.getCookie('pic')
        
        //get ip address
        //const ipaddy = document.getElementById('ip')
        //ipaddy.innerHTML = util.getCookie('ip_addy')
                
        //util.Toast('System Ready', 2000)
        //// balik na

        dash.getMsg()
       
        
        ////// balik mo ang dash.getPO, this gets  the for approval's
        // dash.fetchBadgeData() // update badges
        // .then( x=>{
        //     console.log('badgedata', x)

        //     if(x){
        //         dash.getMsg()
        //         dash.getPO() //get pending for approval
        //     }
        // })

        //TAKE OUT MUNA
        // dash.pieChart()
        // dash.barChart()
	}//END MAIN
} //======================= end ajax obj==========//
//ajax.Bubbl
Ext.onReady(function(){
    console.log('ext on ready....')
    Ext.tip.QuickTipManager.init();

    dash.appExt = MyApp.app ; //get instance of Ext.application MyApp.app

    // Get the controller
    dash.ctrlExt = dash.appExt.getController('myController');

    dash.getPO()

})

window.scrollTo(0,0);
dash.init()

